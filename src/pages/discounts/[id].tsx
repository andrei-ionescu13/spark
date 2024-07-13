import type { FC } from "react";
import Head from "next/head";
import type { GetServerSideProps } from "next";
import { PageHeader } from "@/components/page-header";
import { useDeactivateDiscount, useDeleteDiscount } from "@/api/discounts";
import { appFetch } from "@/utils/app-fetch";
import type { Discount as DiscountI } from "@/types/discounts";
import { dehydrate, QueryClient, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import type { ActionsItem } from "@/components/actions-menu";
import { Trash as TrashIcon } from "@/icons/trash";
import { EyeOff as EyeOffIcon } from "@/icons/eye-off";
import { AlertDialog } from "@/components/alert-dialog";
import { useDialog } from "@/hooks/useDialog";
import { DiscountForm } from "@/components/discounts/create/discount-form";
import { getStatusFromInterval } from "@/utils/get-status-from-interval";
import { Label } from "@/components/label";
import { useTheme } from "@mui/material/styles";
import { Box, Container, colors } from "@mui/material";

const getDiscount =
  (id: string, config: Record<string, any> = {}) =>
    () =>
      appFetch<DiscountI>({
        url: `/discounts/${id}`,
        withAuth: true,
        ...config,
      });

const Discount: FC = () => {
  const theme = useTheme();
  const router = useRouter();
  const id = router.query.id as string;
  const { data: discount, isRefetching } = useQuery({
    queryKey: ["discount", id],
    queryFn: getDiscount(id)
  });
  const [deleteDialogOpen, handleOpenDeleteDialog, handleCloseDeleteDialog] =
    useDialog(false);
  const [
    deactivateDialogOpen,
    handleOpenDeactivateDialog,
    handleCloseDeactivateDialog,
  ] = useDialog(false);
  const deleteDiscount = useDeleteDiscount();
  const deactivateDiscount = useDeactivateDiscount();
  const queryClient = useQueryClient();
  if (!discount) return null;

  const status = getStatusFromInterval(discount.startDate, discount.endDate);

  const actionItems: ActionsItem[] = [
    {
      label: "Deactivate",
      icon: EyeOffIcon,
      onClick: handleOpenDeactivateDialog,
      disabled: status === "expired",
    },
    {
      label: "Delete",
      icon: TrashIcon,
      onClick: handleOpenDeleteDialog,
      color: "error",
    },
  ];

  const mappedColors = {
    scheduled: colors.grey[500],
    active: theme.palette.success.main,
    expired: theme.palette.error.main,
  };

  const handleDeleteDiscount = (): void => {
    deleteDiscount.mutate(discount._id, {
      onSuccess: () => {
        router.push("/discounts");
      },
    });
  };

  const handleDeactivateDiscount = (): void => {
    deactivateDiscount.mutate(discount._id, {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["discount", id]
        });
        handleCloseDeactivateDialog();
      },
    });
  };

  return (
    <>
      <AlertDialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        title={`Delete discount`}
        content="Are you sure you want to delete this discount?"
        onSubmit={handleDeleteDiscount}
        isLoading={deleteDiscount.isPending}
      />
      <AlertDialog
        open={deactivateDialogOpen}
        onClose={handleCloseDeactivateDialog}
        title={`Deactivate discount`}
        content="Are you sure you want to deactivate this discount?"
        onSubmit={handleDeactivateDiscount}
        isLoading={deactivateDiscount.isPending}
      />
      <Head>
        <title>Discount</title>
      </Head>
      <Box sx={{ py: 3 }}>
        <Container maxWidth="lg">
          <PageHeader
            actions={actionItems}
            backHref="/discounts"
            backLabel="Discounts"
            title="Discount"
          >
            <Label color={mappedColors[status]}>{status}</Label>
          </PageHeader>
          <DiscountForm
            discount={discount}
            mode="update"
            discountIsRefetching={isRefetching}
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
      queryKey: ["discount", id],
      queryFn: getDiscount(id, { req, res })
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

export default Discount;
