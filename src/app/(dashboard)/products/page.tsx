import Head from "next/head";
import {
  Box,
  Container,
} from "@mui/material";
import { PageHeader } from "@/components/page-header";
import { QueryClient, dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Plus } from "@/icons/plus";
import { ProductsTable } from "./products-table";
import { searchProducts } from "./api-calls";

export default async function Products({ searchParams }: { searchParams: Record<string, string> }) {
  const queryClient = new QueryClient()
  const query: any = {};
  for (const [key, value] of Object.entries(searchParams)) {
    query[key] = value;
  }

  await queryClient.prefetchQuery({
    queryKey: ["products", query],
    queryFn: searchProducts(query)
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Head>
        <title>Products</title>
      </Head>
      <Box sx={{ py: 3 }}>
        <Container maxWidth={false}>
          <PageHeader
            title="Products"
            action={{
              href: "/products/create",
              isLink: true,
              label: "Add",
              icon: Plus,
            }}
          />
          <ProductsTable />
        </Container>
      </Box>
    </HydrationBoundary>
  );
};
