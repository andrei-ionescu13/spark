import { useDeletePromoCodes } from '@/api/promo-codes';
import { AlertDialog } from '@/components/alert-dialog';
import { DataTable } from '@/components/data-table';
import { HeadCell, DataTableHead } from '@/components/data-table-head';
import { PromoCodeTableRow } from '@/components/promo-codes/promo-code-list/promo-code-table-row';
import { SearchInput } from '@/components/search-input';
import { useDialog } from '@/hooks/useDialog';
import { useQueryValue } from '@/hooks/useQueryValue';
import { useSearch } from '@/hooks/useSearch';
import { PromoCode } from '@/types/promo-code';
import { Card, Box, Button, TextField, MenuItem, TableBody } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { ChangeEvent, useState, type FC } from 'react'

interface PromoCodesTableProps {
  promoCodes?: PromoCode[];
  count?: number;
  isError: boolean;
  isLoading: boolean;
  refetch: any;
}

const headCells: HeadCell[] = [
  {
    id: "code",
    label: "Code",
  },
  {
    id: "startDate",
    label: "Start Date",
  },
  {
    id: "endDate",
    label: "End Date",
  },
  {
    id: "status",
    label: "Status",
    disableSort: true,
  },
];

const statusOptions = [
  {
    label: "All",
    value: "all",
  },
  {
    label: "Active",
    value: "active",
  },
  {
    label: "Scheduled",
    value: "scheduled",
  },
  {
    label: "Expired",
    value: "expired",
  },
];

export const PromoCodesTable: FC<PromoCodesTableProps> = (props) => {
  const {
    promoCodes,
    count,
    isError,
    isLoading,
    refetch,
  } = props;
  const queryClient = useQueryClient()
  const [keyword, handleKeywordChange, handleSearch] =
    useSearch();
  const [selected, setSelected] = useState<string[]>([]);
  const [statusSelected, setStatusSelected] = useState("");
  const [dialogOpen, handleOpenDialog, handleCloseDialog] = useDialog();


  const deletePromoCodes = useDeletePromoCodes(() =>
    queryClient.invalidateQueries({ queryKey: ["promo-codes"] })
  );
  const [status, setStatus] = useQueryValue("status", "all", "all");


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
    if (!promoCodes) return;

    setSelected((prevSelected) => {
      if (prevSelected.length === promoCodes?.length) {
        return [];
      }

      return promoCodes?.map((promoCode) => promoCode._id);
    });
  };

  const handleDeleteDiscounts = () => {
    deletePromoCodes.mutate(selected, {
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
              placeholder="Search promo codes..."
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
              itemsLength={promoCodes?.length}
              onSelectAll={handleSelectAll}
            />
          }
        >
          <TableBody>
            {promoCodes?.map((promoCode) => (
              <PromoCodeTableRow
                promoCode={promoCode}
                key={promoCode._id}
                onSelect={() => {
                  handleSelect(promoCode._id);
                }}
                selected={selected.includes(promoCode._id)}
              />
            ))}
          </TableBody>
        </DataTable>
      </Card>
      <AlertDialog
        content="Are you sure you want to permanently delete these promoCodes?"
        isLoading={deletePromoCodes.isPending}
        onClose={handleCloseDialog}
        onSubmit={handleDeleteDiscounts}
        open={dialogOpen}
        title={`Delete ${selected.length} articles`}
      />
    </>
  )
};
