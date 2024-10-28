"use client"

import Head from "next/head";
import {
  Box,
  Container,
} from "@mui/material";
import { appFetch } from "../../utils/app-fetch";
import type { Currency } from "../../types/currencies";
import { useSearchCurrencies } from "./api-calls-hooks";
import { CurrenciesHeader } from "./currencies-header";
import { CurrenciesTable } from "./currencies-table";


const getCurrencies =
  (config: Record<string, any> = {}) =>
    () =>
      appFetch<{ currencies: Currency[]; count: number }>({
        url: "/currencies/search",
        withAuth: true,
        ...config,
      });

export default function Currencies() {
  const { data, refetch, isError, isLoading } = useSearchCurrencies();
  const { currencies, count } = data || {};

  return (
    <>
      <Head>
        <title>Currencies</title>
      </Head>
      <Box sx={{ py: 3 }}>
        <Container maxWidth={false}>
          <CurrenciesHeader />
          <CurrenciesTable
            currencies={currencies}
            count={count}
            isError={isError}
            isLoading={isLoading}
            refetch={refetch}
          />
        </Container>
      </Box>
    </>
  );
};
