'use client';

import { Box, Container } from '@mui/material';
import Head from 'next/head';
import { CollectionForm } from '../collection-form';
import { useGetCollectionQuery } from './api';
import { CollectionHeader } from './collection-header';

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
          {collection && (
            <CollectionForm
              mode="edit"
              collection={collection}
            />
          )}
        </Container>
      </Box>
    </>
  );
}
