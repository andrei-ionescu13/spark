import { useState } from "react";
import type { FC, ChangeEvent } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import type { GetServerSideProps } from "next";
import {
  Box,
  Card,
  Container,
  FormControlLabel,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
} from "@mui/material";
import { TranslationsDialog } from "@/components/translations/translations-dialog";
import { TranslationsTableRow } from "@/components/translations/translations-table-row";
import { ActionsItem } from "@/components/actions-menu";
import { PageHeader } from "@/components/page-header";
import { SearchInput } from "@/components/search-input";
import { Plus as PlusIcon } from "@/icons/plus";
import { Trash as TrashIcon } from "@/icons/trash";
import { useDialog } from "@/hooks/useDialog";
import { useSearch } from "@/hooks/useSearch";
import { useSort } from "@/hooks/useSort";
import { useDeleteNamespace } from "@/api/translations";
import { LanguagesMenu } from "@/components/translations/languages-menu";
import { dehydrate, QueryClient, useQuery, useQueryClient } from "@tanstack/react-query";
import { AlertDialog } from "@/components/alert-dialog";
import { appFetch } from "@/utils/app-fetch";
import type { ParsedUrlQuery } from "querystring";
import type { Language, Namespace } from "@/types/translations";
import { isString } from "lodash";

const getLanguages =
  (config: Record<string, any> = {}) =>
    () =>
      appFetch<Language[]>({
        url: "/languages",
        withAuth: true,
        ...config,
      });
const getNamespace =
  (id: string, query: ParsedUrlQuery, config: Record<string, any> = {}) =>
    () =>
      appFetch<Namespace>({
        url: `/namespaces/${id}/translations/search`,
        query,
        withAuth: true,
        ...config,
      });

const TranslationList: FC = () => {
  const { query, push } = useRouter();
  const [addDialogOpen, handleOpenAddDialog, handleCloseAddDialog] =
    useDialog();
  const [deleteDialogOpen, handleOpenDeleteDialog, handleCloseDeleteDialog] =
    useDialog();
  const [keyword, keywordParam, handleKeywordChange, handleSearch] =
    useSearch();
  const [sortBy, sortOrder, handleSort] = useSort();
  const [dense, setDense] = useState(false);
  const queryClient = useQueryClient();
  const deleteNamespace = useDeleteNamespace();
  const id = isString(query.id) ? query.id : "";
  const { data: languages } = useQuery({
    queryKey: ["namespaces-languages"],
    queryFn: getLanguages()
  });
  const { data: namespace } = useQuery({
    queryKey: ["namespace"],
    queryFn: getNamespace(id, query)
  });
  const [selectedLanguageCodes, setSelectedLanguageCodes] = useState(() => {
    if (query?.language) {
      if (typeof query.language === "string") {
        return [query.language];
      }

      return query.language;
    }

    if (languages) {
      return languages.map((language) => language.code);
    }

    return [];
  });

  const shownLanguageCodes = (() => {
    if (query?.language) {
      if (typeof query.language === "string") {
        return [query.language];
      }

      return query.language;
    }

    if (languages) {
      return languages.map((language) => language.code);
    }

    return [];
  })();

  if (!languages || !namespace) return null;

  const shownLanguages = languages?.filter((language) =>
    shownLanguageCodes?.includes(language.code)
  );

  const handleChangeDense = (event: ChangeEvent<HTMLInputElement>): void => {
    setDense(event.target.checked);
  };

  const actionItems: ActionsItem[] = [
    {
      label: "Add",
      icon: PlusIcon,
      onClick: handleOpenAddDialog,
    },
    {
      label: "Delete",
      icon: TrashIcon,
      onClick: handleOpenDeleteDialog,
      color: "error",
    },
  ];

  const handleSelectLanguage = (_: any, languageCode: string) => {
    if (selectedLanguageCodes.includes(languageCode)) {
      setSelectedLanguageCodes(
        selectedLanguageCodes.filter((code) => code !== languageCode)
      );
      return;
    }

    setSelectedLanguageCodes([...selectedLanguageCodes, languageCode]);
  };

  const handleDeleteNamespace = () => {
    deleteNamespace.mutate(namespace._id, {
      onSuccess: async () => {
        await push("/translations");
        queryClient.invalidateQueries({ queryKey: ["namespace"] });
      },
    });
  };

  return (
    <>
      <Head>
        <title>Translations</title>
      </Head>
      {addDialogOpen && (
        <TranslationsDialog
          onClose={handleCloseAddDialog}
          open
          namespaceId={namespace._id}
          languages={languages}
        />
      )}
      {deleteDialogOpen && (
        <AlertDialog
          open
          onClose={handleCloseDeleteDialog}
          title={`Delete ${namespace.name} namespace`}
          content="Are you sure you want to permanently this namespace?"
          onSubmit={handleDeleteNamespace}
          isLoading={deleteNamespace.isPending}
        />
      )}
      <Box sx={{ py: 3 }}>
        <Container maxWidth={false}>
          <PageHeader
            title={`${namespace?.name} namespace`}
            actions={actionItems}
            backHref="/translations"
            backLabel="Namespaces"
          />
          <Card>
            <Box
              sx={{
                display: "grid",
                gap: 2,
                gridTemplateColumns: {
                  sm: "1fr 160px",
                },
                p: 2,
              }}
            >
              <form
                onSubmit={(event) => {
                  handleSearch(event, { language: selectedLanguageCodes });
                }}
              >
                <SearchInput
                  onChange={handleKeywordChange}
                  placeholder="Search..."
                  value={keyword}
                />
              </form>
              <LanguagesMenu
                languages={languages}
                selectedLanguageCodes={selectedLanguageCodes}
                onSelect={handleSelectLanguage}
              />
            </Box>
            <TableContainer>
              <Table size={dense ? "small" : "medium"}>
                <TableHead>
                  <TableRow>
                    <TableCell
                      sx={{ fontWeight: 600 }}
                    // width={cell.width}
                    >
                      <TableSortLabel
                        active={"key" === sortBy}
                        direction={"key" === sortBy ? sortOrder : "asc"}
                        onClick={() => {
                          handleSort("key");
                        }}
                      >
                        Key
                      </TableSortLabel>
                    </TableCell>
                    {shownLanguages?.map((language) => (
                      <TableCell key={language.code} sx={{ fontWeight: 600 }}>
                        <TableSortLabel
                          active={language.code === sortBy}
                          direction={
                            language.code === sortBy ? sortOrder : "asc"
                          }
                          onClick={() => {
                            handleSort(language.code);
                          }}
                        >
                          {language.name}
                        </TableSortLabel>
                      </TableCell>
                    ))}
                    <TableCell
                      align="right"
                      sx={{ fontWeight: 600 }}
                      width="5%"
                    >
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {namespace?.translations?.map((translation) => (
                    <TranslationsTableRow
                      languages={languages}
                      translation={translation}
                      key={translation.key}
                      shownLanguages={shownLanguages}
                      namespaceId={namespace._id}
                    />
                  ))}
                </TableBody>
              </Table>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  pl: 2,
                  minHeight: 52,
                }}
              >
                <FormControlLabel
                  control={
                    <Switch checked={dense} onChange={handleChangeDense} />
                  }
                  label="Dense padding"
                />
                <Box sx={{ flexGrow: 1 }} />
              </Box>
            </TableContainer>
          </Card>
        </Container>
      </Box>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  query,
  locale,
  req,
  res,
}) => {
  const queryClient = new QueryClient();
  const { id } = query as { id: string };

  try {
    await Promise.all([
      queryClient.fetchQuery({
        queryKey: ["namespaces-languages"],
        queryFn: getLanguages({ req, res })
      }


      ),
      queryClient.fetchQuery({
        queryKey: ["namespace"],
        queryFn: getNamespace(id, query, { req, res })
      }),
    ]);
  } catch (error) {
    console.error(error);
  }

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
};

export default TranslationList;
