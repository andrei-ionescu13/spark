"use client"

import type { FC } from "react";
import Head from "next/head";
import type { GetServerSideProps } from "next";
import { Box, Container } from "@mui/material";
import { PageHeader } from "../../../components/page-header";
import { PromoCodeForm } from "../promo-code-form";

export default function DiscountCreate() {
  return (
    <>
      <Head>
        <title>Promo code Create</title>
      </Head>
      <Box sx={{ py: 3 }}>
        <Container maxWidth="lg">
          <PageHeader
            backHref="/promo-codes"
            backLabel="Promo codes"
            title="Create promo code"
          />
          <PromoCodeForm mode="create" />
        </Container>
      </Box>
    </>
  );
};
