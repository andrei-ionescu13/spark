import { useState } from "react";
import type { FC } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import type { GetServerSideProps } from "next";
import { Box, Card, Container, TableBody } from "@mui/material";
import { PageHeader } from "@/components/page-header";
import { SearchInput } from "@/components/search-input";
import { useDialog } from "@/hooks/useDialog";
import { useSearch } from "@/hooks/useSearch";
import { AlertDialog } from "@/components/alert-dialog";
import { GenresTableRow } from "@/components/products/genres/genres-table-row";
import { GenreDialog } from "@/components/products/genres/genre-dialog";
import { Plus as PlusIcon } from "@/icons/plus";
import { dehydrate, QueryClient, useQuery, useQueryClient } from "react-query";
import { useDeleteGenres } from "@/api/genres";
import { appFetch } from "@/utils/app-fetch";
import { Genre } from "@/types/genres";
import type { ParsedUrlQuery } from "querystring";
import { DataTable } from "@/components/data-table";
import { DataTableHead } from "@/components/data-table-head";
import type { HeadCell } from "@/components/data-table-head";
import { Button } from "@/components/button";
import { LanguagesMenu } from "@/components/translations/languages-menu";
import { Language } from "@/types/translations";

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
  const { error, data: genresData } = useQuery(
    ["genres", query],
    getGenres(query)
  );
  const [dialogOpen, handleOpenDialog, handleCloseDialog] = useDialog();
  const [addDialogOpen, handleOpenAddDialog, handleCloseAddDialog] =
    useDialog();
  const deleteGenres = useDeleteGenres(() =>
    queryClient.invalidateQueries("genres")
  );
  const { data: languages } = useQuery("languages", getLanguages());
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
        isLoading={deleteGenres.isLoading}
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
      queryClient.fetchQuery("languages", getLanguages({ req, res })),
      queryClient.fetchQuery(["genres", query], getGenres(query, { req, res })),
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
