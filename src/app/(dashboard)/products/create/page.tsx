import Head from "next/head";
import {
  Box,
  Container,
} from "@mui/material";
import { ProductForm } from "./product-form-form";
import { PageHeader } from "@/components/page-header";

export default async function ProductCreate() {
  return (
    <>
      <Head>
        <title>Create product</title>
      </Head>
      <Box sx={{ py: 3 }}>
        <Container maxWidth="md">
          <PageHeader title="Create Product" />
          <ProductForm />
        </Container>
      </Box>
    </>
  );
};
