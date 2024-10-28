import type { FC } from "react";
import Head from "next/head";
import { Box, Container } from "@mui/material";
import { PageHeader } from "@/components/page-header";
import { CollectionForm } from "../collection-form";

const CollectionCreate: FC = () => {
  return (
    <>
      <Head>
        <title>Collection Create</title>
      </Head>
      <Box sx={{ py: 3 }}>
        <Container maxWidth="lg">
          <PageHeader
            backHref="/products/collections"
            backLabel="Collections"
            title="Create collection"
          />
          <CollectionForm mode="create" />
        </Container>
      </Box>
    </>
  );
};

export default CollectionCreate;
