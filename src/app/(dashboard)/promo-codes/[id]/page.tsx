"use client"

import type { FC } from "react";
import Head from "next/head";
import type { GetServerSideProps } from "next";
import { Box, colors, Container, useTheme } from "@mui/material";
import { PageHeader } from "../../../components/page-header";
import { appFetch } from "../../../utils/app-fetch";
import { dehydrate, QueryClient, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import type { ActionsItem } from "../../../components/actions-menu";
import { Trash as TrashIcon } from "../../../icons/trash";
import { EyeOff as EyeOffIcon } from "../../../icons/eye-off";
import { AlertDialog } from "../../../components/alert-dialog";
import { useDialog } from "../../../hooks/useDialog";
import type { PromoCode as PromoCodeI } from "../../../types/promo-code";
import { useDeactivatePromoCode, useDeletePromoCode } from "@/api/promo-codes";
import { getStatusFromInterval } from "../../../utils/get-status-from-interval";
import { Label } from "../../../components/label";
import { usePromoCode } from "../api-calls-hooks";
import { PromoCodeForm } from "../promo-code-form";
import { PromoCodeHeader } from "./promo-code-header";


export default function PromoCode() {
  const { data: promoCode, isLoading, isRefetching } = usePromoCode();

  return (
    <>
      <Head>
        <title>Promo Code</title>
      </Head>
      <Box sx={{ py: 3 }}>
        <Container maxWidth="lg">
          <PromoCodeHeader
            promoCode={promoCode}
            isLoading={isLoading}
          />
          {!!promoCode && (
            <PromoCodeForm
              promoCode={promoCode}
              mode="update"
              promoCodeIsRefetching={isRefetching}
            />
          )}
        </Container>
      </Box>
    </>
  );
};