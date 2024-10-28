"use client"

import Head from "next/head";
import { Box, Container } from "@mui/material";
import { PageHeader } from "@/components/page-header";
import { DiscountForm } from "../discount-form";

export default function DiscountCreate() {
  return (
    <>
      <Head>
        <title>Discount Create</title>
      </Head>
      <Box sx={{ py: 3 }}>
        <Container maxWidth="lg">
          <PageHeader
            backHref="/discounts"
            backLabel="Discounts"
            title="Create discount"
          />
          <DiscountForm mode="create" />
        </Container>
      </Box>
    </>
  );
};

