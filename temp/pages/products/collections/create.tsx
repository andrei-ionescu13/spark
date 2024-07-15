import type { FC } from "react";
import Head from "next/head";
import type { GetServerSideProps } from "next";
import { Box, Container } from "@mui/material";
import { PageHeader } from "../../../../src/app/components/page-header";
import { CollectionForm } from "../../../../src/app/components/collections/collection-form";

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
          <CollectionForm />
        </Container>
      </Box>
    </>
  );
};

export default CollectionCreate;
