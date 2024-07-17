import Head from "next/head";
import {
  Box,
  Container,
} from "@mui/material";
import { ProductCreateForm } from "./product-create-form";
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
          <ProductCreateForm />
        </Container>
      </Box>
    </>
  );
};
