import { useEffect, useRef, useState } from "react";
import type { FC, ChangeEvent } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import type { GetServerSideProps } from "next";
import {
  Box,
  Button,
  Card,
  Container,
  FormControl,
  FormControlLabel,
  InputLabel,
  Menu,
  MenuItem,
  Select,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material";
import { TranslationNamespaceDialog } from "@/components/translations/translation-namespace-dialog";
import { NamespaceTableRow } from "@/components/translations/namespace/namespace-table-row";
import { PageHeader } from "@/components/page-header";
import { SearchInput } from "@/components/search-input";
import { TableRowSkeleton } from "@/components/table-row-skeleton";
import { Plus as PlusIcon } from "@/icons/plus";
import { Check as CheckIcon } from "@/icons/check";
import { Download as DownloadIcon } from "@/icons/download";
import { useDialog } from "@/hooks/useDialog";
import { usePage } from "@/hooks/usePage";
import { useLimit } from "@/hooks/usePerPage";
import { useSearch } from "@/hooks/useSearch";
import { useSort } from "@/hooks/useSort";
import { generateArray } from "@/utils/generate-array";
import { LanguagesMenu } from "@/components/translations/languages-menu";
import { useQueryValue } from "@/hooks/useQueryValue";
import { download } from "@/utils/download";
import { ActionsItem } from "@/components/actions-menu";
import { dehydrate, QueryClient, useQuery } from "react-query";
import { appFetch } from "@/utils/app-fetch";
import { DataTable } from "@/components/data-table";
import type { ParsedUrlQuery } from "querystring";
import type { Language, Namespace } from "@/types/translations";
import { DataTableHead } from "@/components/data-table-head";
import type { HeadCell } from "@/components/data-table-head";

const headCells: HeadCell[] = [
  {
    id: "name",
    label: "Namespace",
  },
];

const statusOptions = [
  {
    label: "Namespaces",
    value: "namespaces",
  },
  {
    label: "Translations",
    value: "translations",
  },
];

interface GetNamespacesData {
  namespaces: Namespace[];
  count: number;
}

const getLanguages =
  (config: Record<string, any> = {}) =>
  () =>
    appFetch<Language[]>({
      url: "/translations/languages",
      withAuth: true,
      ...config,
    });
const getNamespaces =
  (query: ParsedUrlQuery, config: Record<string, any> = {}) =>
  () =>
    appFetch<GetNamespacesData>({
      url: "/translations/namespaces/search",
      query,
      ...config,
    });

const TranslationList: FC = () => {
  const { query } = useRouter();
  const [
    openAddGroupDialog,
    handleOpenAddGroupDialog,
    handleCloseAddGroupDialog,
  ] = useDialog();
  const [keyword, keywordParam, handleKeywordChange, handleSearch] =
    useSearch();
  const { data: languages } = useQuery("namespace-languages", getLanguages());
  const { data: namespacesData } = useQuery("namespaces", getNamespaces(query));

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
  const [searchFor, setSearchFor] = useState(
    (query?.searchFor as string) || "namespaces"
  );
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

  if (!namespacesData || !languages) return null;

  const shownLanguages = languages?.filter((language) =>
    shownLanguageCodes?.includes(language.code)
  );

  const { namespaces, count } = namespacesData;

  const handleSelectLanguage = (_: any, languageCode: string) => {
    if (selectedLanguageCodes.includes(languageCode)) {
      setSelectedLanguageCodes(
        selectedLanguageCodes.filter((code) => code !== languageCode)
      );
      return;
    }

    setSelectedLanguageCodes([...selectedLanguageCodes, languageCode]);
  };

  const handleStatusChange = (event: SelectChangeEvent<string>): void => {
    setSearchFor(event.target.value);
  };

  const exportTranslations = async () => {
    const blob = await appFetch({
      url: "/namespaces/export",
      responseType: "blob",
      withAuth: true,
    });
    download(blob, "translations.zip");
  };

  const actionItems: ActionsItem[] = [
    {
      label: "Add",
      icon: PlusIcon,
      onClick: handleOpenAddGroupDialog,
    },
    {
      label: "Export",
      icon: DownloadIcon,
      onClick: exportTranslations,
    },
  ];

  return (
    <>
      <Head>
        <title>Translations</title>
      </Head>
      {openAddGroupDialog && (
        <TranslationNamespaceDialog open onClose={handleCloseAddGroupDialog} />
      )}
      <Box sx={{ py: 3 }}>
        <Container maxWidth={false}>
          <PageHeader title="Namespaces" actions={actionItems} />
          <Card>
            <Box
              sx={{
                display: "grid",
                gap: 2,
                gridTemplateColumns: {
                  sm: "1fr 240px 160px",
                },
                p: 2,
              }}
            >
              <form
                onSubmit={(event) => {
                  handleSearch(event, {
                    searchFor,
                    language: selectedLanguageCodes,
                  });
                }}
              >
                <SearchInput
                  onChange={handleKeywordChange}
                  placeholder="Search..."
                  value={keyword}
                />
              </form>
              <FormControl>
                <InputLabel id="status">Search for</InputLabel>
                <Select
                  id="status"
                  label="Search for"
                  onChange={handleStatusChange}
                  value={searchFor}
                >
                  {statusOptions.map((status) => (
                    <MenuItem key={status.value} value={status.value}>
                      {status.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <LanguagesMenu
                languages={languages}
                selectedLanguageCodes={selectedLanguageCodes}
                onSelect={handleSelectLanguage}
              />
            </Box>
            <DataTable count={count}>
              <DataTableHead headCells={headCells} />
              <TableBody>
                {namespaces?.map((namespace) => (
                  <NamespaceTableRow
                    languages={languages}
                    namespace={namespace}
                    key={namespace.name}
                    shownLanguages={shownLanguages}
                  />
                ))}
              </TableBody>
            </DataTable>
          </Card>
        </Container>
      </Box>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  locale,
  query,
  req,
  res,
}) => {
  const queryClient = new QueryClient();

  try {
    await Promise.all([
      queryClient.fetchQuery("namespace-languages", getLanguages({ req, res })),
      queryClient.fetchQuery("namespaces", getNamespaces(query, { req, res })),
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
