import { useState } from "react";
import type { FC, ChangeEvent } from "react";
import Head from "next/head";
import { useRouter } from "next/navigation";
import {
  Box,
  Card,
  Checkbox,
  Container,
  MenuItem,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
  TextField,
} from "@mui/material";
import { PageHeader } from "../../../src/app/components/page-header";
import { useSearch } from "../../../src/app/hooks/useSearch";
import { useSort } from "../../../src/app/hooks/useSort";
import { SearchInput } from "../../../src/app/components/search-input";
import { GetServerSideProps } from "next";
import { useDeleteProducts } from "@/api/products";
import { ProductTableRow } from "../../../src/app/components/products/product-list/products-table-row";
import { QueryClient, useQuery, useQueryClient, dehydrate } from "@tanstack/react-query";
import { useDialog } from "../../../src/app/hooks/useDialog";
import { AlertDialog } from "../../../src/app/components/alert-dialog";
import { Plus as PlusIcon } from "../../../src/app/icons/plus";
import { appFetch } from "../../../src/app/utils/app-fetch";
import { DataTable } from "../../../src/app/components/data-table";
import { Product } from "../../../src/app/types/products";
import { DataTableHead } from "../../../src/app/components/data-table-head";
import type { HeadCell } from "../../../src/app/components/data-table-head";
import { Button } from "../../../src/app/components/button";
import { useQueryValue } from "../../../src/app/hooks/useQueryValue";

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

interface GetProductsData {
  products: Product[];
  count: number;
}

const getProducts = (query: Record<string, any>, config: Record<string, any> = {}) => () =>
  appFetch<GetProductsData>({
    url: "/products",
    query,
    withAuth: true,
    ...config,
  });

const Products: FC = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [keyword, keywordParam, handleKeywordChange, handleSearch] =
    useSearch();
  const [selected, setSelected] = useState<string[]>([]);
  const [status, setStatus] = useQueryValue("status", "all", "all");
  const [dialogOpen, handleOpenDialog, handleCloseDialog] = useDialog();
  const { error, data } = useQuery({
    queryKey: ["products", router.query],
    queryFn: getProducts(router.query)
  }


  );
  const deleteProducts = useDeleteProducts(() =>
    queryClient.invalidateQueries({ queryKey: ["products"] })
  );

  if (!data) return null;

  const { products, count } = data;

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
      <Head>
        <title>Products</title>
      </Head>
      <AlertDialog
        content="Are you sure you want to permanently delete these products?"
        isLoading={deleteProducts.isPending}
        onClose={handleCloseDialog}
        onSubmit={handleDeleteProducts}
        open={dialogOpen}
        title={`Delete ${selected.length} articles`}
      />
      <Box sx={{ py: 3 }}>
        <Container maxWidth={false}>
          <PageHeader
            title="Products"
            action={{
              href: "/products/create",
              isLink: true,
              label: "Add",
              icon: PlusIcon,
            }}
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
            <DataTable count={count}>
              <DataTableHead
                headCells={headCells}
                selectedLength={selected.length}
                itemsLength={products.length}
                onSelectAll={handleSelectAll}
              />
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
        </Container>
      </Box>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  locale,
  query,
  req,
  res,
}) => {
  const queryClient = new QueryClient();

  try {
    await queryClient.fetchQuery({
      queryKey: ["products", query],
      queryFn: getProducts(query, { res, req })
    });
  } catch (error) {
    console.error(error);
  }

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
};

export default Products;
