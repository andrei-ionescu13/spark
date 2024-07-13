import type { FC } from "react";
import Head from "next/head";
import type { GetServerSideProps } from "next";
import {
  Box,
  Card,
  Container,
  IconButton,
  TableBody,
  TableCell,
  TableRow,
  useTheme,
} from "@mui/material";
import { PageHeader } from "@/components/page-header";
import { Plus as PlusIcon } from "@/icons/plus";
import { Trash as TrashIcon } from "@/icons/trash";
import { useDialog } from "@/hooks/useDialog";
import { dehydrate, QueryClient, useQuery, useQueryClient } from "@tanstack/react-query";
import { appFetch } from "@/utils/app-fetch";
import type { Currency } from "@/types/currencies";
import { CurrencyDialog } from "@/components/currencies/currency-dialog";
import { AlertDialog } from "@/components/alert-dialog";
import { useDeleteCurrency } from "@/api/currencies";
import { useRouter } from "next/router";
import { DataTable } from "@/components/data-table";
import { SearchInput } from "@/components/search-input";
import { useSearch } from "@/hooks/useSearch";
import { DataTableHead } from "@/components/data-table-head";

interface CurrenciesTableRowProps {
  currency: Currency;
}

const CurrenciesTableRow: FC<CurrenciesTableRowProps> = (props) => {
  const { currency } = props;
  const queryClient = useQueryClient();
  const deleteLanguage = useDeleteCurrency(() =>
    queryClient.invalidateQueries({ queryKey: ["currencies"] })
  );
  const [deleteDialogOpen, handleOpenDeleteDialog, handleCloseDeleteDialog] =
    useDialog();

  const handleDeleteLanguage = () => {
    deleteLanguage.mutate(currency._id, {
      onSuccess: () => {
        handleCloseDeleteDialog();
      },
    });
  };

  return (
    <>
      <AlertDialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        title={`Delete ${currency.name} currency`}
        content="Are you sure you want to permanently delete this language?"
        onSubmit={handleDeleteLanguage}
        isLoading={deleteLanguage.isPending}
      />
      <TableRow key={currency._id}>
        <TableCell>{currency.name}</TableCell>
        <TableCell>{currency.code}</TableCell>
        <TableCell>{currency.symbol}</TableCell>
        <TableCell align="right">
          <IconButton color="error" onClick={handleOpenDeleteDialog}>
            <TrashIcon />
          </IconButton>
        </TableCell>
      </TableRow>
    </>
  );
};

const headCells = [
  {
    id: "name",
    label: "Name",
    width: "20%",
  },
  {
    id: "code",
    label: "Code",
    width: "15%",
  },
  {
    id: "symbol",
    label: "Symbol",
    width: "15%",
  },
];

const getCurrencies =
  (config: Record<string, any> = {}) =>
    () =>
      appFetch<{ currencies: Currency[]; count: number }>({
        url: "/currencies/search",
        withAuth: true,
        ...config,
      });

const CurrencyList: FC = () => {
  const { query } = useRouter();
  const { data } = useQuery({
    queryKey: ["currencies"],
    queryFn: getCurrencies(query)
  });
  const [keyword, keywordParam, handleKeywordChange, handleSearch] =
    useSearch();
  const [openDialog, handleOpenDialog, handleCloseDialog] = useDialog();

  if (!data) return null;

  const { currencies, count } = data;

  return (
    <>
      {openDialog && <CurrencyDialog open onClose={handleCloseDialog} />}
      <Head>
        <title>Currencies</title>
      </Head>
      <Box sx={{ py: 3 }}>
        <Container maxWidth={false}>
          <PageHeader
            title="Currencies"
            action={{
              label: "Add",
              icon: PlusIcon,
              onClick: handleOpenDialog,
            }}
          />
          <Card>
            <Box sx={{ p: 2 }}>
              <form onSubmit={handleSearch}>
                <SearchInput
                  onChange={handleKeywordChange}
                  placeholder="Search languages..."
                  value={keyword}
                />
              </form>
            </Box>
            <DataTable count={count}>
              <DataTableHead headCells={headCells} />
              <TableBody>
                {currencies.map((currency) => (
                  <CurrenciesTableRow key={currency._id} currency={currency} />
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
    await queryClient.fetchQuery({
      queryKey: ["currencies"],
      queryFn: getCurrencies({ req, res })
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

export default CurrencyList;
