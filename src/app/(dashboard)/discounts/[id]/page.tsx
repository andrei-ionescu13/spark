"use client"

import type { FC } from "react";
import Head from "next/head";
import type { GetServerSideProps } from "next";
import { useDeactivateDiscount, useDeleteDiscount } from "@/api/discounts";
import { dehydrate, QueryClient, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Box, Container, colors, useTheme } from "@mui/material";
import { useGetDiscount } from "../api-calls-hooks";
import { ActionsItem } from "@/components/actions-menu";
import { AlertDialog } from "@/components/alert-dialog";
import { PageHeader } from "@/components/page-header";
import { useDialog } from "@/hooks/useDialog";
import { getStatusFromInterval } from "@/utils/get-status-from-interval";
import { id } from "date-fns/locale";
import router from "next/router";
import { getDiscount } from "../api-calls";
import { DiscountForm } from "../discount-form";
import { EyeOff } from "@/icons/eye-off";
import { Trash } from "@/icons/trash";
import { Label } from "@/components/label";
import { DiscountHeader } from "./discount-header";

export default function Discount() {
  const { data: discount, isLoading, isRefetching } = useGetDiscount();

  return (
    <>
      <Head>
        <title>Discount</title>
      </Head>
      <Box sx={{ py: 3 }}>
        <Container maxWidth="lg">
          <DiscountHeader
            discount={discount}
            isLoading={isLoading}
          />
          {discount && (
            <DiscountForm
              discount={discount}
              mode="update"
              discountIsRefetching={isRefetching}
            />
          )}
        </Container>
      </Box>

    </>
  );
};
