"use client"

import { KeysTable } from '@/components/keys-table';
import { useQueryValue } from '@/hooks/useQueryValue';
import { useSearch } from '@/hooks/useSearch';
import { SelectChangeEvent } from '@mui/material';
import type { FC } from 'react'
import { useSearchProductKeys } from '../../api-calls-hooks';

interface ProductKeysTableProps {
}

export const ProductKeysTable: FC<ProductKeysTableProps> = (props) => {
  const [keyword, handleKeywordChange, handleSearch] =
    useSearch();
  const [status, setStatus] = useQueryValue("status", "all", "all");
  const { data, refetch } = useSearchProductKeys();

  if (!data) return null;

  const { keys, count } = data;

  const handleStatusChange = (event: SelectChangeEvent<string>): void => {
    setStatus(event.target.value);
  };

  return (
    <KeysTable
      keys={keys}
      count={count}
      onStatusChange={handleStatusChange}
      onKeywordChange={handleKeywordChange}
      onSearch={handleSearch}
      keyword={keyword}
      status={status}
      showProductCell={false}
      refetch={refetch}
    />
  )
};
