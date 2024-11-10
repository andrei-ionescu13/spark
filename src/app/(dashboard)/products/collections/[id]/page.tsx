'use client';

import { Box, Container } from '@mui/material';
import Head from 'next/head';
import { useGetCollectionQuery } from './api';
import { CollectionHeader } from './collection-header';
import { UpdateCollectionForm } from './update-collection-form';

export default function Collection() {
  const { data: collection } = useGetCollectionQuery();

  return (
    <>
      <Head>
        <title>Collection</title>
      </Head>
      <Box sx={{ py: 3 }}>
        <Container maxWidth="lg">
          <CollectionHeader />
          {collection && <UpdateCollectionForm collection={collection} />}
        </Container>
      </Box>
    </>
  );
}
