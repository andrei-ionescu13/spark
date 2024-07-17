import type { FC } from "react";
import Head from "next/head";
import type { GetServerSideProps } from "next";
import {
  Box,
  Card,
  Container,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { LanguageDialog } from "../../../src/app/components/translations/languages/language-dialog";
import { PageHeader } from "../../../src/app/components/page-header";
import { Plus as PlusIcon } from "../../../src/app/icons/plus";
import { Trash as TrashIcon } from "../../../src/app/icons/trash";
import { useDialog } from "../../../src/app/hooks/useDialog";
import { dehydrate, QueryClient, useQuery, useQueryClient } from "@tanstack/react-query";
import { LanguagesDeleteDialog } from "../../../src/app/components/translations/languages/languages-delete-dialog";
import { appFetch } from "../../../src/app/utils/app-fetch";
import type { Language } from "../../../src/app/types/translations";
import type { HeadCell } from "../../../src/app/components/data-table-head";

interface LanguagesTableRowProps {
  language: Language;
}

const LanguagesTableRow: FC<LanguagesTableRowProps> = (props) => {
  const { language } = props;
  const [deleteDialogOpen, handleOpenDeleteDialog, handleCloseDeleteDialog] =
    useDialog();

  return (
    <>
      <LanguagesDeleteDialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        language={language}
      />
      <TableRow key={language._id}>
        <TableCell>{language.name}</TableCell>
        <TableCell>{language.nativeName}</TableCell>
        <TableCell>{language.code}</TableCell>
        <TableCell align="right">
          <IconButton color="error" onClick={handleOpenDeleteDialog}>
            <TrashIcon />
          </IconButton>
        </TableCell>
      </TableRow>
    </>
  );
};

const headCells: HeadCell[] = [
  {
    id: "name",
    label: "Name",
  },
  {
    id: "nativeName",
    label: "Native name",
  },
  {
    id: "code",
    label: "Code",
  },
];

const getLanguages =
  (config: Record<string, any> = {}) =>
    () =>
      appFetch<Language[]>({
        url: "/translations/languages",
        withAuth: true,
        ...config,
      });

const TranslationList: FC = () => {
  const { data: languages } = useQuery({
    queryKey: ["translations-languages"],
    queryFn: getLanguages()
  });

  if (!languages) return null;

  return (
    <>
      <Head>
        <title>Languages</title>
      </Head>
      <Box sx={{ py: 3 }}>
        <Container maxWidth={false}>

          <Card>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    {headCells.map((cell) => (
                      <TableCell key={cell.label} sx={{ fontWeight: 600 }}>
                        {cell.label}
                      </TableCell>
                    ))}
                    <TableCell align="right" sx={{ fontWeight: 600 }}>
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {languages.map((language) => (
                    <LanguagesTableRow key={language._id} language={language} />
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </Container>
      </Box>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  locale,
  req,
  res,
}) => {
  const queryClient = new QueryClient();

  try {
    await queryClient.fetchQuery({
      queryKey: ["translations-languages"],
      queryFn: getLanguages({ req, res })
    });
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
