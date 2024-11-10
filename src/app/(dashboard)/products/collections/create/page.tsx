import { PageHeader } from '@/components/page-header';
import { Box, Container } from '@mui/material';
import Head from 'next/head';
import type { FC } from 'react';
import { CreateCollectionForm } from './create-collection-form';

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
          <CreateCollectionForm />
        </Container>
      </Box>
    </>
  );
};

export default CollectionCreate;
