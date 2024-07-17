"use client"

import { KeysTable } from '@/components/keys-table';
import type { FC } from 'react'
import { useSearchKeysQuery } from '../api-calls-hooks';
import { useQueryValue } from '@/hooks/useQueryValue';
import { useSearch } from '@/hooks/useSearch';
import { SelectChangeEvent } from '@mui/material';

interface ProductKeysTableProps {

}

export const ProductKeysTable: FC<ProductKeysTableProps> = (props) => {
  const [keyword, handleKeywordChange, handleSearch] =
    useSearch();
  const [status, setStatus] = useQueryValue("status", "all", "all");
  const { data, refetch } = useSearchKeysQuery();

  if (!data) return null;

  const { keys, count } = data;

  const handleStatusChange = (event: SelectChangeEvent): void => {
    setStatus(event.target.value);
  };

  return (
    <KeysTable
      count={count}
      keys={keys}
      onStatusChange={handleStatusChange}
      onKeywordChange={handleKeywordChange}
      onSearch={handleSearch}
      keyword={keyword}
      status={status}
      refetch={refetch}
    />
  )
};
