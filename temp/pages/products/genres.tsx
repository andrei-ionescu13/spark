import { useState } from "react";
import type { FC } from "react";
import Head from "next/head";
import { useRouter } from "next/navigation";
import type { GetServerSideProps } from "next";
import { Box, Card, Container, TableBody } from "@mui/material";
import { PageHeader } from "../../../src/app/components/page-header";
import { SearchInput } from "../../../src/app/components/search-input";
import { useDialog } from "../../../src/app/hooks/useDialog";
import { useSearch } from "../../../src/app/hooks/useSearch";
import { AlertDialog } from "../../../src/app/components/alert-dialog";
import { GenresTableRow } from "../../../src/app/components/products/genres/genres-table-row";
import { GenreDialog } from "../../../src/app/components/products/genres/genre-dialog";
import { Plus as PlusIcon } from "../../../src/app/icons/plus";
import { dehydrate, QueryClient, useQuery, useQueryClient } from "@tanstack/react-query";
import { useDeleteGenres } from "@/api/genres";
import { appFetch } from "../../../src/app/utils/app-fetch";
import { Genre } from "../../../src/app/types/genres";
import type { ParsedUrlQuery } from "querystring";
import { DataTable } from "../../../src/app/components/data-table";
import { DataTableHead } from "../../../src/app/components/data-table-head";
import type { HeadCell } from "../../../src/app/components/data-table-head";
import { Button } from "../../../src/app/components/button";
import { LanguagesMenu } from "../../../src/app/components/translations/languages-menu";
import { Language } from "../../../src/app/types/translations";

const headCells: HeadCell[] = [
  {
    id: "name",
    label: "Name",
  },
];

interface GetGenresData {
  genres: Genre[];
  count: 0;
}

const getGenres =
  (query: ParsedUrlQuery, config: Record<string, any> = {}) =>
    () =>
      appFetch<GetGenresData>({
        url: "/genres/search",
        query,
        withAuth: true,
        ...config,
      });

const getLanguages =
  (config: Record<string, any> = {}) =>
    () =>
      appFetch<Language[]>({
        url: "/languages",
        withAuth: true,
        ...config,
      });

const extractLanguagesCodeFromQuery = (
  query: ParsedUrlQuery
): string[] | null => {
  if (query?.language) {
    if (typeof query.language === "string") {
      return [query.language];
    }

    return query.language;
  }

  return null;
};

const getLanguageCodesFromQueryOrDefaultLanguages = (
  query: ParsedUrlQuery,
  languages: Language[]
): string[] =>
  extractLanguagesCodeFromQuery(query) ||
  languages?.map((language) => language.code) ||
  [];

const Genres: FC = () => {
  const { query } = useRouter();
  const queryClient = useQueryClient();
  const [keyword, keywordParam, handleKeywordChange, handleSearch] =
    useSearch();
  const [selected, setSelected] = useState<string[]>([]);
  const { error, data: genresData } = useQuery({
    queryKey: ["genres", query],
    queryFn: getGenres(query)
  });
  const [dialogOpen, handleOpenDialog, handleCloseDialog] = useDialog();
  const [addDialogOpen, handleOpenAddDialog, handleCloseAddDialog] =
    useDialog();
  const deleteGenres = useDeleteGenres(() =>
    queryClient.invalidateQueries({ queryKey: ["genres"] })
  );
  const { data: languages } = useQuery({
    queryKey: ["languages"],
    queryFn: getLanguages()
  });
  const [selectedLanguageCodes, setSelectedLanguageCodes] = useState(
    getLanguageCodesFromQueryOrDefaultLanguages(query, languages || [])
  );
  const shownLanguageCodes = getLanguageCodesFromQueryOrDefaultLanguages(
    query,
    languages || []
  );

  const shownLanguages =
    languages?.filter((language) =>
      shownLanguageCodes?.includes(language.code)
    ) || [];

  if (!genresData || !languages) return null;

  const { genres, count } = genresData;

  const handleSelectLanguage = (_: any, languageCode: string) => {
    if (selectedLanguageCodes.includes(languageCode)) {
      setSelectedLanguageCodes(
        selectedLanguageCodes.filter((code) => code !== languageCode)
      );
      return;
    }

    setSelectedLanguageCodes([...selectedLanguageCodes, languageCode]);
  };

  const handleSelect = (id: string): void => {
    setSelected((prevSelected) => {
      if (prevSelected.includes(id)) {
        return prevSelected.filter((_id) => _id !== id);
      }

      return [...prevSelected, id];
    });
  };

  const handleSelectAll = (): void => {
    setSelected((prevSelected) => {
      if (prevSelected.length === genres?.length) {
        return [];
      }

      return genres?.map((genre) => genre._id);
    });
  };

  const handleDeleteGenres = () => {
    deleteGenres.mutate(selected, {
      onSuccess: () => {
        setSelected([]);
        handleCloseDialog();
      },
    });
  };

  return (
    <>
      <AlertDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        title={`Delete multiple genres`}
        content="Are you sure you want to permanently delete these genre?"
        onSubmit={handleDeleteGenres}
        isLoading={deleteGenres.isPending}
      />
      {addDialogOpen && <GenreDialog open onClose={handleCloseAddDialog} />}
      <Head>
        <title>Genres</title>
      </Head>
      <Box sx={{ py: 3 }}>
        <Container maxWidth={false}>
          <PageHeader
            title="Genres"
            action={{
              label: "Add genre",
              icon: PlusIcon,
              onClick: handleOpenAddDialog,
            }}
          />
          <Card>
            <Box
              sx={{
                display: "grid",
                gap: 2,
                gridTemplateColumns: {
                  sm: `${!!selected.length ? "auto" : ""} 1fr`,
                },
                p: 2,
              }}
            >
              {!!selected.length && (
                <Button
                  color="error"
                  onClick={handleOpenDialog}
                  variant="contained"
                >
                  Bulk Delete {selected.length}
                </Button>
              )}
              <form
                onSubmit={(event) => {
                  handleSearch(event, { language: selectedLanguageCodes });
                }}
              >
                <SearchInput
                  onChange={handleKeywordChange}
                  placeholder="Search genres..."
                  value={keyword}
                />
              </form>
            </Box>
            <DataTable count={count}>
              <DataTableHead
                headCells={headCells}
                selectedLength={selected.length}
                itemsLength={genres.length}
                onSelectAll={handleSelectAll}
              />
              <TableBody>
                {genres.map((genre) => (
                  <GenresTableRow
                    genre={genre}
                    key={genre._id}
                    onSelect={() => {
                      handleSelect(genre._id);
                    }}
                    selected={selected.includes(genre._id)}
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
      queryClient.fetchQuery({
        queryKey: ["languages"],
        queryFn: getLanguages({ req, res })
      }),
      queryClient.fetchQuery({
        queryKey: ["genres", query],
        queryFn: getGenres(query, { req, res })
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

export default Genres;
