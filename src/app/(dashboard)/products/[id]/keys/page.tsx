'use client';

import Head from 'next/head';
import { KeysTable } from '../../keys-table';
import { ProductLayout } from '../product-layout';
import { useSearchProductKeys } from './api';

export default function ProductKeys() {
  const { data, refetch, isError, isLoading } = useSearchProductKeys();
  const { keys, count } = data || {};

  return (
    <>
      <Head>
        <title>Keys</title>
      </Head>
      <ProductLayout>
        <KeysTable
          keys={keys}
          count={count}
          isError={isError}
          isLoading={isLoading}
          refetch={refetch}
          showProductCell={false}
        />
      </ProductLayout>
    </>
  );
}
