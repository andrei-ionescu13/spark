import type { FC } from "react";
import Head from "next/head";
import type { GetServerSideProps } from "next";
import { Box, colors, Container, useTheme } from "@mui/material";
import { PageHeader } from "../../../src/app/components/page-header";
import { appFetch } from "../../../src/app/utils/app-fetch";
import { dehydrate, QueryClient, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import type { ActionsItem } from "../../../src/app/components/actions-menu";
import { Trash as TrashIcon } from "../../../src/app/icons/trash";
import { EyeOff as EyeOffIcon } from "../../../src/app/icons/eye-off";
import { AlertDialog } from "../../../src/app/components/alert-dialog";
import { useDialog } from "../../../src/app/hooks/useDialog";
import { PromoCodeForm } from "../../../src/app/components/promo-codes/create/promo-code-form";
import type { PromoCode as PromoCodeI } from "../../../src/app/types/promo-code";
import { useDeactivatePromoCode, useDeletePromoCode } from "@/api/promo-codes";
import { getStatusFromInterval } from "../../../src/app/utils/get-status-from-interval";
import { Label } from "../../../src/app/components/label";

const getPromoCode =
  (id: string, config: Record<string, any> = {}) =>
    () =>
      appFetch<PromoCodeI>({
        url: `/promo-codes/${id}`,
        withAuth: true,
        ...config,
      });

const PromoCode: FC = () => {
  const theme = useTheme();
  const router = useRouter();
  const id = router.query.id as string;
  const { data: promoCode, isRefetching } = useQuery({
    queryKey: ["promo-code", id],
    queryFn: getPromoCode(id)
  }


  );
  const [deleteDialogOpen, handleOpenDeleteDialog, handleCloseDeleteDialog] =
    useDialog(false);
  const [
    deactivateDialogOpen,
    handleOpenDeactivateDialog,
    handleCloseDeactivateDialog,
  ] = useDialog(false);
  const deletePromoCode = useDeletePromoCode();
  const deactivatePromoCode = useDeactivatePromoCode(() =>
    queryClient.invalidateQueries({ queryKey: ["promo-code", id] })
  );
  const queryClient = useQueryClient();

  if (!promoCode) return null;

  const status = getStatusFromInterval(promoCode.startDate, promoCode.endDate);

  const mappedColors = {
    scheduled: colors.grey[500],
    active: theme.palette.success.main,
    expired: theme.palette.error.main,
  };

  const actionItems: ActionsItem[] = [
    {
      label: "Deactivate",
      icon: EyeOffIcon,
      onClick: handleOpenDeactivateDialog,
    },
    {
      label: "Delete",
      icon: TrashIcon,
      onClick: handleOpenDeleteDialog,
      color: "error",
    },
  ];

  const handleDeletePromoCode = (): void => {
    deletePromoCode.mutate(promoCode._id, {
      onSuccess: () => {
        router.push("/promo-codes");
      },
    });
  };

  const handleDeactivatePromoCode = (): void => {
    deactivatePromoCode.mutate(promoCode._id, {
      onSuccess: (data) => {
        handleCloseDeactivateDialog();
      },
    });
  };

  return (
    <>
      <AlertDialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        title={`Delete promoCode`}
        content="Are you sure you want to delete this promoCode?"
        onSubmit={handleDeletePromoCode}
        isLoading={deletePromoCode.isPending}
      />
      <AlertDialog
        open={deactivateDialogOpen}
        onClose={handleCloseDeactivateDialog}
        title={`Deactivate promoCode`}
        content="Are you sure you want to deactivate this promoCode?"
        onSubmit={handleDeactivatePromoCode}
        isLoading={deactivatePromoCode.isPending}
      />
      <Head>
        <title>Promo Code</title>
      </Head>
      <Box sx={{ py: 3 }}>
        <Container maxWidth="lg">
          <PageHeader
            actions={actionItems}
            backHref="/promo-codes"
            backLabel="Promo codes"
            title="Promo code"
          >
            <Label color={mappedColors[status]}>{status}</Label>
          </PageHeader>
          <PromoCodeForm
            promoCode={promoCode}
            mode="update"
            promoCodeIsRefetching={isRefetching}
          />
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
  const { id } = query as { id: string };
  const queryClient = new QueryClient();

  try {
    await queryClient.fetchQuery({
      queryKey: ["promo-code", id],
      queryFn: getPromoCode(id, { req, res })
    }


    );
  } catch (error) {
    console.error(error);
  }

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
};

export default PromoCode;
