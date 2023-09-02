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
import { LanguageDialog } from "@/components/translations/languages/language-dialog";
import { PageHeader } from "@/components/page-header";
import { Plus as PlusIcon } from "@/icons/plus";
import { Trash as TrashIcon } from "@/icons/trash";
import { useDialog } from "@/hooks/useDialog";
import { dehydrate, QueryClient, useQuery, useQueryClient } from "react-query";
import { LanguagesDeleteDialog } from "@/components/translations/languages/languages-delete-dialog";
import { appFetch } from "@/utils/app-fetch";
import type { Language } from "@/types/translations";
import type { HeadCell } from "@/components/data-table-head";

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
  const { data: languages } = useQuery(
    "translations-languages",
    getLanguages()
  );
  const [openDialog, handleOpenDialog, handleCloseDialog] = useDialog();

  if (!languages) return null;

  return (
    <>
      {openDialog && <LanguageDialog open onClose={handleCloseDialog} />}
      <Head>
        <title>Languages</title>
      </Head>
      <Box sx={{ py: 3 }}>
        <Container maxWidth={false}>
          <PageHeader
            title="Languages"
            action={{
              label: "Add",
              icon: PlusIcon,
              onClick: handleOpenDialog,
            }}
          />
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
    await queryClient.fetchQuery("languages", getLanguages({ req, res }));
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
