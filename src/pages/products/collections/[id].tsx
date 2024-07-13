import type { FC } from "react";
import Head from "next/head";
import type { GetServerSideProps } from "next";
import { Box, Container, useTheme, colors } from "@mui/material";
import { PageHeader } from "@/components/page-header";
import { dehydrate, QueryClient, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import type { ActionsItem } from "@/components/actions-menu";
import { Trash as TrashIcon } from "@/icons/trash";
import { EyeOff as EyeOffIcon } from "@/icons/eye-off";
import { AlertDialog } from "@/components/alert-dialog";
import { useDialog } from "@/hooks/useDialog";
import type { Collection as CollectionI } from "@/types/collection";
import { CollectionForm } from "@/components/collections/collection-form";
import {
  useDeactivateCollection,
  useDeleteCollection,
} from "@/api/collections";
import { Label } from "@/components/label";
import { getStatusFromInterval } from "@/utils/get-status-from-interval";
import { appFetch } from "@/utils/app-fetch";

const getCollection =
  (id: string, config: Record<string, any> = {}) =>
    () =>
      appFetch<CollectionI>({
        url: `/collections/${id}`,
        withAuth: true,
        ...config,
      });

const Collection: FC = () => {
  const theme = useTheme();
  const router = useRouter();
  const queryClient = useQueryClient();
  const id = router.query.id as string;
  const { data: collection } = useQuery({
    queryKey: ["collection", id],
    queryFn: getCollection(id)
  });
  const [deleteDialogOpen, handleOpenDeleteDialog, handleCloseDeleteDialog] =
    useDialog(false);
  const [
    deactivateDialogOpen,
    handleOpenDeactivateDialog,
    handleCloseDeactivateDialog,
  ] = useDialog(false);
  const deleteCollection = useDeleteCollection();
  const deactivateCollection = useDeactivateCollection();
  if (!collection) return null;

  const status = getStatusFromInterval(
    collection.startDate,
    collection?.endDate
  );

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
    deleteCollection.mutate(collection._id, {
      onSuccess: () => {
        router.push("/products/collections");
      },
    });
  };

  const handleDeactivatePromoCode = (): void => {
    deactivateCollection.mutate(collection._id, {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["collection", id]
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
        title={`Delete collection`}
        content="Are you sure you want to delete this collection?"
        onSubmit={handleDeletePromoCode}
        isLoading={deleteCollection.isPending}
      />
      <AlertDialog
        open={deactivateDialogOpen}
        onClose={handleCloseDeactivateDialog}
        title={`Deactivate collection`}
        content="Are you sure you want to deactivate this collection?"
        onSubmit={handleDeactivatePromoCode}
        isLoading={deactivateCollection.isPending}
      />
      <Head>
        <title>Collection</title>
      </Head>
      <Box sx={{ py: 3 }}>
        <Container maxWidth="lg">
          <PageHeader
            actions={actionItems}
            backHref="/products/collections"
            backLabel="Collections"
            title="Collection"
          >
            <Label color={mappedColors[status]}>{status}</Label>
          </PageHeader>
          <CollectionForm collection={collection} mode="edit" />
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
      queryKey: ["collection", id],
      queryFn: getCollection(id, { req, res })
    }


    );
  } catch (error) {
    console.error(error);
  }

  return {
    props: {
      q: query,
      dehydratedState: dehydrate(queryClient),
    },
  };
};

export default Collection;
