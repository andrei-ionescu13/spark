import { useEffect, useState } from 'react';
import type { FC } from 'react';
import {
  Box,
  Card,
  Chip,
  Stack,
  TableBody,
} from '@mui/material';
import { useSearch } from '@/hooks/useSearch';
import { SearchInput } from '@/components/search-input';
import { OrdersTableRow } from '@/components/orders/list/orders-table-row';
import type { Order } from '@/types/orders';
import { DataTable } from './data-table';
import 'simplebar/dist/simplebar.min.css';
import { CheckboxMenu } from './checkbox-menu';
import { useRouter } from 'next/router';
import { DataTableHead } from '@/components/data-table-head';
import type { HeadCell } from '@/components/data-table-head';

const getHeadCells = (showCustomer: boolean): HeadCell[] => ([
  {
    id: 'orderNumber',
    label: 'Order number',
  },
  ...showCustomer ? [{
    id: 'customer',
    label: 'Customer',
  }] : [],
  {
    id: 'createdAt',
    label: 'Created At',
  },
  {
    id: 'totalPrice',
    label: 'Total',
  },
  {
    id: 'paymentStatus',
    label: 'Payment',
  },
  {
    id: 'fulfillmentStatus',
    label: 'Fulfillment',
  },
  {
    id: 'status',
    label: 'Status',
  }
])

interface Option {
  label: string;
  value: string;
}

export interface CheckboxMenuField {
  label: string,
  key: string,
  options: Option[];
}

const menusSchema: CheckboxMenuField[] = [
  {
    label: 'Status',
    key: 'status',
    options: [
      {
        label: 'Open',
        value: 'open'
      },
      {
        label: 'Archived',
        value: 'archived'
      },
      {
        label: 'Canceled',
        value: 'canceled'
      }
    ]
  },
  {
    label: 'Payment',
    key: 'paymentStatus',
    options: [
      {
        label: 'Authorized',
        value: 'authorized'
      },
      {
        label: 'Paid',
        value: 'paid'
      },
      {
        label: 'Pending',
        value: 'pending'
      },
      {
        label: 'Refunded',
        value: 'refunded'
      },
      {
        label: 'Expired',
        value: 'expired'
      }
    ]
  },
  {
    label: 'Fulfillment',
    key: 'fulfillmentStatus',
    options: [
      {
        label: 'Fulfilled',
        value: 'fulfilled'
      },
      {
        label: 'Unfulfilled',
        value: 'unfulfilled'
      },
      {
        label: 'Partially fulfilled',
        value: 'partially fulfilled',
      }
    ]
  },
]


interface OrdersTableProps {
  orders: Order[];
  count: number;
  showCustomer?: boolean;
}

export const OrdersTable: FC<OrdersTableProps> = (props) => {
  const { orders, count, showCustomer = true } = props;
  const { pathname, query, push } = useRouter();
  const [keyword, keywordParam, handleKeywordChange, handleSearch] = useSearch();
  const [selected, setSelected] = useState<string[]>([]);
  const [fieldsSelected, setFieldsSelected] = useState<any>({});

  const handleSelect = (id: string): void => {
    setSelected((prevSelected) => {
      if (prevSelected.includes(id)) {
        return prevSelected.filter((_id) => _id !== id)
      }

      return [...prevSelected, id];
    })
  }

  const handleSelectAll = (): void => {
    setSelected((prevSelected) => {
      if (prevSelected.length === orders.length) {
        return [];
      }

      return orders.map((order) => order._id)
    })
  }

  const handleDeleteStatusValue = (type: CheckboxMenuField, option: Option): void => {
    const newQuery = { ...query };

    if (Array.isArray(query?.[type.key])) {
      newQuery[type.key] = (newQuery[type.key] as string[]).filter(x => x !== option.value)
    } else {
      delete newQuery[type.key]
    }

    push({
      pathname: pathname,
      query: newQuery
    });
  }

  const handleClick = (key: string, value: string): void => {
    const newFieldsSelected = { ...fieldsSelected };

    if (!!newFieldsSelected?.[key]) {
      if (Array.isArray(newFieldsSelected[key])) {
        newFieldsSelected[key] = newFieldsSelected[key]?.includes(value) ? (newFieldsSelected[key] as string[])?.filter((x) => x !== value) : [...(newFieldsSelected[key] as string[]), value]
      } else {
        newFieldsSelected[key] = query[key] === value ? [] : [newFieldsSelected[key], value]
      }
    } else {
      newFieldsSelected[key] = value;
    }

    setFieldsSelected(newFieldsSelected)

    const newQuery = { ...query, ...newFieldsSelected };
    delete newQuery?.page;

    push({
      pathname: pathname,
      query: newQuery
    });
  };

  useEffect(() => {
    const { fulfillmentStatus = [], paymentStatus = [], status = [] } = query;
    setFieldsSelected({ fulfillmentStatus, paymentStatus, status })
  }, [query])

  return (
    <Card>
      {menusSchema.some((menu) => !!query?.[menu.key]) && <Stack
        alignItems="center"
        direction="row"
        spacing={1}
        sx={{
          pt: 2,
          px: 2,
        }}
        flexWrap="wrap"
      >
        {menusSchema?.map((menu, index) => (
          menu.options.map((option) => (query?.[menu.key] === option.value || (Array.isArray(query?.[menu.key]) && query?.[menu.key]?.includes(option.value))) && (
            <Chip
              label={option.value}
              key={`${menu.key}-${option.value}`}
              size="small"
              variant="outlined"
              onDelete={() => handleDeleteStatusValue(menu, option)}
              onClick={() => handleDeleteStatusValue(menu, option)}
            />
          ))
        ))}
      </Stack>}
      <Box sx={{ p: 2 }}>
        <form onSubmit={handleSearch}>
          <SearchInput
            onChange={handleKeywordChange}
            placeholder="Search orders..."
            value={keyword}
          />
        </form>
      </Box>
      <Stack
        sx={{ pt: 1, px: 2, pb: 2 }}
        spacing={1.5}
        direction="row"
      >
        {menusSchema.map((type) => (
          <CheckboxMenu
            options={type.options}
            buttonLabel={type.label}
            onSelect={handleClick}
            optionsKey={type.key}
            key={type.key}
            verifyIsChecked={(key: string, value: string): boolean => (fieldsSelected?.[key] === value || (Array.isArray(fieldsSelected?.[key]) && fieldsSelected?.[key]?.includes(value)))}
          />
        ))}
      </Stack>
      <DataTable count={count}>
        <DataTableHead
          headCells={getHeadCells(showCustomer)}
          selectedLength={selected.length}
          itemsLength={orders.length}
          onSelectAll={handleSelectAll}
        />
        <TableBody>
          {orders.map((order) => (
            <OrdersTableRow
              showCustomer={showCustomer}
              order={order}
              key={order._id}
              onSelect={() => { handleSelect(order._id) }}
              selected={selected.includes(order._id)}
            />
          ))}
        </TableBody>
      </DataTable>
    </Card>
  );
};