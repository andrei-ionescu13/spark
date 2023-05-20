import Head from "next/head";
import { PageHeader } from "@/components/page-header";
import { Box, Container } from "@mui/material";

const Home = () => {
  return (
    <>
      <Head>
        <title>Dashboard</title>
      </Head>
      <Box sx={{ py: 3 }}>
        <Container maxWidth={false}>
          <PageHeader title="Dashboard" />
        </Container>
      </Box>
    </>
  );
};

export default Home;
