"use client";

import { useDeleteProducts } from '@/api/products';
import { DataTable } from '@/components/data-table';
import { DataTableHead, HeadCell } from '@/components/data-table-head';
import { SearchInput } from '@/components/search-input';
import { useDialog } from '@/hooks/useDialog';
import { useQueryValue } from '@/hooks/useQueryValue';
import { useSearch } from '@/hooks/useSearch';
import { Card, Box, Button, TextField, MenuItem, TableBody } from '@mui/material';
import { useQueryClient, useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { ChangeEvent, useState, type FC } from 'react'
import { useSearchProductKeys, useSearchProducts } from '../api-calls-hooks';
import { AlertDialog } from '@/components/alert-dialog';
import { Product } from '@/types/products';
import { ProductTableRow } from './products-table-row';

interface ProductsTableProps {
  products?: Product[];
  count?: number;
  isError: boolean;
  isLoading: boolean;
  refetch: any;
}

const headCells: HeadCell[] = [
  {
    id: "id",
    label: "Id",
  },
  {
    id: "title",
    label: "Title",
  },
  {
    id: "createdAt",
    label: "Created At",
  },
  {
    id: "status",
    label: "Status",
  },
];

const statusOptions = [
  {
    label: "All",
    value: "all",
  },
  {
    label: "Published",
    value: "published",
  },
  {
    label: "Draft",
    value: "draft",
  },
  {
    label: "Archived",
    value: "archived",
  },
];


export const ProductsTable: FC<ProductsTableProps> = (props) => {
  const { products, count, isError, isLoading, refetch } = props;
  const queryClient = useQueryClient();
  const [keyword, handleKeywordChange, handleSearch] =
    useSearch();
  const [selected, setSelected] = useState<string[]>([]);
  const [status, setStatus] = useQueryValue("status", "all", "all");
  const [dialogOpen, handleOpenDialog, handleCloseDialog] = useDialog();
  const deleteProducts = useDeleteProducts(() =>
    queryClient.invalidateQueries({ queryKey: ["products"] })
  );

  const handleStatusChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setStatus(event.target.value);
  };

  const handleSelect = (id: string): void => {
    setSelected((prevSelected) => {
      if (prevSelected.includes(id)) {
        return prevSelected.filter((_id) => _id !== id);
      }

      return [...prevSelected, id];
    });
  };

  const handleSelectAll = (): void => {
    if (!products) return;

    setSelected((prevSelected) => {
      if (prevSelected.length === products?.length) {
        return [];
      }

      return products?.map((product) => product._id);
    });
  };

  const handleDeleteProducts = () => {
    deleteProducts.mutate(selected, {
      onSuccess: () => {
        setSelected([]);
        handleCloseDialog();
      },
    });
  };


  return (
    <>
      <Card>
        <Box
          sx={{
            display: "grid",
            gap: 2,
            gridTemplateColumns: {
              sm: `${!!selected.length ? "auto" : ""} 1fr 240px`,
            },
            p: 2,
          }}
        >
          {!!selected.length && (
            <Button
              color="error"
              onClick={handleOpenDialog}
              variant="contained"
            >
              Bulk Delete {selected.length}
            </Button>
          )}
          <form onSubmit={handleSearch}>
            <SearchInput
              onChange={handleKeywordChange}
              placeholder="Search products..."
              value={keyword}
            />
          </form>
          <TextField
            fullWidth
            label="Status"
            name="status"
            onChange={handleStatusChange}
            value={status}
            select
          >
            {statusOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </Box>
        <DataTable
          isLoading={isLoading}
          count={count}
          hasError={isError}
          hasNoData={count === 0}
          headCellsCount={headCells.length}
          onRefetchData={refetch}
          headSlot={
            <DataTableHead
              isLoading={isLoading}
              headCells={headCells}
              selectedLength={selected.length}
              itemsLength={products?.length}
              onSelectAll={handleSelectAll}
            />
          }
        >
          <TableBody>
            {products?.map((product) => (
              <ProductTableRow
                product={product}
                key={product._id}
                onSelect={() => {
                  handleSelect(product._id);
                }}
                selected={selected.includes(product._id)}
              />
            ))}
          </TableBody>
        </DataTable>
      </Card>
      <AlertDialog
        content="Are you sure you want to permanently delete these products?"
        isLoading={deleteProducts.isPending}
        onClose={handleCloseDialog}
        onSubmit={handleDeleteProducts}
        open={dialogOpen}
        title={`Delete ${selected.length} articles`}
      />
    </>
  )
};
