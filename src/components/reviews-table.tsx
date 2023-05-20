import { useState } from "react";
import type { FC, ChangeEvent } from "react";
import { Box, Card, TableBody, MenuItem, TextField } from "@mui/material";
import { RaviewTableRow } from "@/components/reviews/review-list/review-table-row";
import { AlertDialog } from "@/components/alert-dialog";
import { SearchInput } from "@/components/search-input";
import { useSearch } from "@/hooks/useSearch";
import { useQueryValue } from "@/hooks/useQueryValue";
import { DataTable } from "@/components/data-table";
import { DataTableHead } from "@/components/data-table-head";
import type { HeadCell } from "@/components/data-table-head";
import type { Review } from "@/types/review";
import { useDeleteReviews } from "@/api/reviews";
import { Button } from "@/components/button";

const getHeadCells = (showProduct: boolean, showUser: boolean): HeadCell[] => [
  {
    id: "_id",
    label: "Id",
  },
  {
    id: "rating",
    label: "Rating",
  },
  ...(showProduct
    ? [
        {
          id: "product",
          label: "Product",
        },
      ]
    : []),
  ...(showUser
    ? [
        {
          id: "user",
          label: "User",
        },
      ]
    : []),
  {
    id: "createdAt",
    label: "Date",
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
    label: "Unpublished",
    value: "unpublished",
  },
  {
    label: "Flagged",
    value: "flagged",
  },
];

interface ReviewsTableProps {
  reviews: Review[];
  count: number;
  showProduct?: boolean;
  showUser?: boolean;
  refetch: any;
}

const ReviewsTable: FC<ReviewsTableProps> = (props) => {
  const {
    reviews,
    count,
    showProduct = true,
    showUser = true,
    refetch,
  } = props;
  const [status, setStatus] = useQueryValue("status", "all", "all");
  const [selected, setSelected] = useState<string[]>([]);
  const [keyword, keywordParam, handleKeywordChange, handleSearch] =
    useSearch();
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
    setSelected((prevSelected) => {
      if (prevSelected.length === reviews.length) {
        return [];
      }

      return reviews.map((review) => review._id);
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
              <MenuItem key={status.value} value={status.value}>
                {status.label}
              </MenuItem>
            ))}
          </TextField>
        </Box>
        <DataTable count={count}>
          <DataTableHead
            headCells={getHeadCells(showProduct, showUser)}
            selectedLength={selected.length}
            itemsLength={reviews.length}
            onSelectAll={handleSelectAll}
          />
          <TableBody>
            {reviews.map((review) => (
              <RaviewTableRow
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
        isLoading={deleteReviews.isLoading}
        onClose={handleCloseDialog}
        onSubmit={handleDeleteReviews}
        open={dialogOpen}
        title={`Delete ${selected.length} reviews`}
      />
    </>
  );
};

export default ReviewsTable;
