import { useState } from "react";
import type { FC, ChangeEvent, SyntheticEvent } from "react";
import {
  Box,
  Card,
  TableBody,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material";
import { SearchInput } from "../../components/search-input";
import { useDialog } from "../../hooks/useDialog";
import { AlertDialog } from "../../components/alert-dialog";
import { KeysTableRow } from "./keys-table-row";
import { useDeleteKeys } from "@/api/keys";
import { DataTable } from "../../components/data-table";
import type { Key } from "../../types/keys";
import { DataTableHead } from "../../components/data-table-head";
import type { HeadCell } from "../../components/data-table-head";
import { Button } from "../../components/button";
import { useQueryValue } from "@/hooks/useQueryValue";
import { useSearch } from "@/hooks/useSearch";

const statusOptions = [
  {
    label: "All",
    value: "all",
  },
  {
    label: "Secret",
    value: "secret",
  },
  {
    label: "Revealed",
    value: "revealed",
  },
  {
    label: "Reported",
    value: "reported",
  },
];

interface KeysTableProps {
  keys?: Key[];
  count?: number;
  isError: boolean;
  isLoading: boolean;
  refetch: any;
  showProductCell?: boolean;
}

export const KeysTable: FC<KeysTableProps> = (props) => {
  const {
    showProductCell = true,
    keys,
    count,
    refetch,
    isLoading,
    isError
  } = props;
  const [keyword, handleKeywordChange, handleSearch] =
    useSearch();
  const [status, setStatus] = useQueryValue("status", "all", "all");
  const [selected, setSelected] = useState<string[]>([]);
  const [dialogOpen, handleOpenDialog, handleCloseDialog] = useDialog();
  const deleteKeys = useDeleteKeys(refetch);

  const headCells: HeadCell[] = [
    {
      id: "key",
      label: "Key",
    },
    ...(showProductCell
      ? [
        {
          id: "productName",
          label: "Product",
        },
      ]
      : []),
    {
      id: "createdAt",
      label: "Created At",
    },
    {
      id: "availability",
      label: "Availability",
    },
    {
      id: "status",
      label: "Status",
    },
  ];

  const handleSelect = (id: string): void => {
    setSelected((prevSelected) => {
      if (prevSelected.includes(id)) {
        return prevSelected.filter((_id) => _id !== id);
      }

      return [...prevSelected, id];
    });
  };

  const handleSelectAll = (): void => {
    if (!keys) return;

    setSelected((prevSelected) => {
      if (prevSelected.length === keys?.length) {
        return [];
      }

      return keys?.map((key) => key._id);
    });
  };

  const handleDeleteKeys = () => {
    deleteKeys.mutate(selected, {
      onSuccess: () => {
        setSelected([]);
        handleCloseDialog();
      },
    });
  };

  const handleStatusChange = (event: SelectChangeEvent<string>): void => {
    setStatus(event.target.value);
  };

  return (
    <>
      <AlertDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        title={`Delete keys`}
        content="Are you sure you want to delete these keys?"
        onSubmit={handleDeleteKeys}
        isLoading={deleteKeys.isPending}
      />
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
              placeholder="Search keys..."
              value={keyword}
            />
          </form>
          <FormControl>
            <InputLabel id="status">Status</InputLabel>
            <Select
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
            </Select>
          </FormControl>
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
              itemsLength={keys?.length}
              onSelectAll={handleSelectAll}
            />
          }
        >
          <TableBody>
            {keys?.map((key) => (
              <KeysTableRow
                refetch={refetch}
                showProductCell={showProductCell}
                productKey={key}
                key={key._id}
                onSelect={() => {
                  handleSelect(key._id);
                }}
                selected={selected.includes(key._id)}
              />
            ))}
          </TableBody>
        </DataTable>
      </Card>
    </>
  );
};
