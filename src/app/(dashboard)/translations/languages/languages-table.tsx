import { DataTableHead, HeadCell } from '@/components/data-table-head';
import { Card, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, IconButton, Checkbox } from '@mui/material';
import { useState, type FC } from 'react'
import { Language } from '@/types/translations';
import { DataTable } from '@/components/data-table';
import { LanguagesDeleteDialog } from '@/components/translations/languages/languages-delete-dialog';
import { useDialog } from '@/hooks/useDialog';
import { Trash } from '@/icons/trash';
import { DataTableRow } from '@/components/data-table-row';
import { ActionsItem } from '@/components/actions-menu';
import { ActionsIconButton } from '@/components/icon-actions';
import { LanguagesTableRow } from './languages-table-row';

interface LanguagesTableProps {
  languages?: Language[];
  count?: number;
  isError: boolean;
  isLoading: boolean;
  refetch: any;
}

const headCells: HeadCell[] = [
  {
    id: "name",
    label: "Name",
  },
  {
    id: "nativeName",
    label: "Native name",
  },
  {
    id: "code",
    label: "Code",
  },
];




export const LanguagesTable: FC<LanguagesTableProps> = (props) => {
  const {
    languages,
    count,
    isError,
    isLoading,
    refetch,
  } = props;

  const [selected, setSelected] = useState<string[]>([]);
  const handleSelect = (id: string): void => {
    setSelected((prevSelected) => {
      if (prevSelected.includes(id)) {
        return prevSelected.filter((_id) => _id !== id);
      }

      return [...prevSelected, id];
    });
  };

  const handleSelectAll = (): void => {
    if (!languages) return;

    setSelected((prevSelected) => {
      if (prevSelected.length === languages?.length) {
        return [];
      }

      return languages?.map((product) => product._id);
    });
  };

  const handleDeleteLanguages = () => {
    // deleteProducts.mutate(selected, {
    //   onSuccess: () => {
    //     setSelected([]);
    //     handleCloseDialog();
    //   },
    // });
  };

  return (
    <>
      <Card>
        <DataTable
          isLoading={isLoading}
          count={count}
          hasError={isError}
          hasNoData={languages?.length === 0}
          headCellsCount={headCells.length}
          onRefetchData={refetch}
          headSlot={
            <DataTableHead
              isLoading={isLoading}
              headCells={headCells}
              selectedLength={selected.length}
              itemsLength={languages?.length}
              onSelectAll={handleSelectAll}
            />
          }
        >
          <TableBody>
            {languages?.map((language) => (
              <LanguagesTableRow
                key={language._id}
                language={language}
                onSelect={() => {
                  handleSelect(language._id);
                }}
                selected={selected.includes(language._id)}
              />
            ))}
          </TableBody>
        </DataTable>
      </Card>
    </>
  )
};
