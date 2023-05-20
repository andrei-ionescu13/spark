import type { FC } from "react";
import Head from "next/head";
import type { GetServerSideProps } from "next";
import { Box, Container } from "@mui/material";
import { PageHeader } from "@/components/page-header";

import { DiscountForm } from "@/components/discounts/create/discount-form";

const DiscountCreate: FC = () => {
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

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  return {
    props: {},
  };
};

export default DiscountCreate;
