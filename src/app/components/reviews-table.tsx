'use client';

import { useDeleteReviews } from '@/api/reviews';
import { Box, Card, MenuItem, TableBody, TextField } from '@mui/material';
import type { ChangeEvent, FC } from 'react';
import { useState } from 'react';
import { useQueryValue } from '../hooks/useQueryValue';
import { useSearch } from '../hooks/useSearch';
import type { Review } from '../types/review';
import { AlertDialog } from './alert-dialog';
import { Button } from './button';
import { DataTable } from './data-table';
import type { HeadCell } from './data-table-head';
import { DataTableHead } from './data-table-head';
import { RaviewsTableRow } from './reviews-table-row';
import { SearchInput } from './search-input';

const getHeadCells = (showProduct: boolean, showUser: boolean): HeadCell[] => [
  {
    id: '_id',
    label: 'Id',
    width: showProduct || showUser ? '15%' : '31%',
  },
  {
    id: 'rating',
    label: 'Rating',
    width: '16%',
  },
  ...(showProduct
    ? [
        {
          id: 'product',
          label: 'Product',
          width: '16%',
        },
      ]
    : []),
  ...(showUser
    ? [
        {
          id: 'user',
          label: 'User',
          width: '16%',
        },
      ]
    : []),
  {
    id: 'createdAt',
    label: 'Date',
    width: '16%',
  },
  {
    id: 'status',
    label: 'Status',
    width: '16%',
  },
];

const statusOptions = [
  {
    label: 'All',
    value: 'all',
  },
  {
    label: 'Published',
    value: 'published',
  },
  {
    label: 'Unpublished',
    value: 'unpublished',
  },
  {
    label: 'Flagged',
    value: 'flagged',
  },
];

interface ReviewsTableProps {
  reviews?: Review[];
  count?: number;
  isError: boolean;
  isLoading: boolean;
  refetch: any;
  showProduct?: boolean;
  showUser?: boolean;
}

const ReviewsTable: FC<ReviewsTableProps> = (props) => {
  const {
    showProduct = true,
    showUser = true,
    reviews,
    count,
    refetch,
    isLoading,
    isError,
  } = props;
  const [status, setStatus] = useQueryValue('status', 'all', 'all');
  const [selected, setSelected] = useState<string[]>([]);
  const [keyword, handleKeywordChange, handleSearch] = useSearch();
  const [dialogOpen, setDialogOpen] = useState(false);
  const deleteReviews = useDeleteReviews();

  const handleOpenDialog = (): void => {
    setDialogOpen(true);
  };

  const handleCloseDialog = (): void => {
    setDialogOpen(false);
  };

  const handleDeleteReviews = (): void => {
    deleteReviews.mutate(selected, {
      onSuccess: () => {
        setSelected([]);
        refetch();
        handleCloseDialog();
      },
      onError: (error) => {},
    });
  };

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
    if (!reviews) return;

    setSelected((prevSelected) => {
      if (prevSelected.length === reviews.length) {
        return [];
      }

      return reviews.map((review) => review._id);
    });
  };

  const headCells = getHeadCells(showProduct, showUser);

  return (
    <>
      <Card>
        <Box
          sx={{
            display: 'grid',
            gap: 2,
            gridTemplateColumns: {
              sm: `${!!selected.length ? 'auto' : ''} 1fr 240px`,
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
              placeholder="Search review..."
              value={keyword}
            />
          </form>
          <TextField
            select
            id="status"
            label="Status"
            onChange={handleStatusChange}
            value={status}
          >
            {statusOptions.map((status) => (
              <MenuItem
                key={status.value}
                value={status.value}
              >
                {status.label}
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
              itemsLength={reviews?.length}
              onSelectAll={handleSelectAll}
            />
          }
        >
          <TableBody>
            {reviews?.map((review) => (
              <RaviewsTableRow
                refetch={refetch}
                review={review}
                key={review._id}
                onSelect={() => {
                  handleSelect(review._id);
                }}
                selected={selected.includes(review._id)}
                showProduct={showProduct}
                showUser={showUser}
              />
            ))}
          </TableBody>
        </DataTable>
      </Card>
      <AlertDialog
        content="Are you sure you want to permanently delete these reviews"
        isLoading={deleteReviews.isPending}
        onClose={handleCloseDialog}
        onSubmit={handleDeleteReviews}
        open={dialogOpen}
        title={`Delete ${selected.length} reviews`}
      />
    </>
  );
};

export default ReviewsTable;
