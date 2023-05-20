import type { FC } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import type { GetServerSideProps } from "next";
import { toast } from "react-toastify";
import {
  Box,
  colors,
  Container,
  Grid,
  Typography,
  useTheme,
} from "@mui/material";
import { ArticleDetailsGeneral } from "@/components/articles/article/article-details-general";
import { ArticleDetailsMeta } from "@/components/articles/article/article-details-meta";
import { MarkdownPreview } from "@/components/markdown-preview";
import { ArticleStatusCategory } from "@/components/articles/article/article-status-category";
import { ActionsItem } from "@/components/actions-menu";
import { AlertDialog } from "@/components/alert-dialog";
import { PageHeader } from "@/components/page-header";
import { Duplicate as DuplicateIcon } from "@/icons/duplicate";
import { Eye as EyeIcon } from "@/icons/eye";
import { Trash as TrashIcon } from "@/icons/trash";
import { useDialog } from "@/hooks/useDialog";
import { useDeleteArticle, useDuplicateArticle } from "@/api/articles";
import { Link } from "@/components/link";
import { appFetch } from "@/utils/app-fetch";
import { dehydrate, QueryClient, useQuery } from "react-query";
import { getCookie } from "cookies-next";
import { Article as ArticleI, ArticleStatus } from "@/types/articles";
import { Label } from "@/components/label";

const ToastSuccess = (id: string) => (
  <Box>
    <Typography variant="body1" color="textPrimary">
      Article duplicated
    </Typography>
    <Link
      color="textPrimary"
      href={`/articles/${id}`}
      underline="hover"
      variant="body1"
    >
      Go to the created article
    </Link>
  </Box>
);

const getArticle =
  (id: string, config: Record<string, any> = {}) =>
  () =>
    appFetch<ArticleI>({
      url: `/articles/${id}`,
      withAuth: true,
      ...config,
    });

const Article: FC = () => {
  const theme = useTheme();
  const router = useRouter();
  const { id } = router.query as { id: string };
  const { data: article, isLoading } = useQuery(
    ["articles", id],
    getArticle(id)
  );
  const [openDeleteDialog, handleOpenDeleteDialog, handleCloseDeleteDialog] =
    useDialog();
  const [
    openDuplicateDialog,
    handleOpenDuplicateDialog,
    handleCloseDuplicateDialog,
  ] = useDialog();
  const [openPreviewDialog, handleOpenPreviewDialog, handleClosePreviewDialog] =
    useDialog();
  const deleteArticle = useDeleteArticle();
  const duplicateArticle = useDuplicateArticle();
  const isEditDisabled = article?.status === "archived";

  if (!article) return null;

  const handleDeleteArticle = () => {
    deleteArticle.mutate(article._id, {
      onSuccess: () => {
        router.push("/articles");
      },
    });
  };

  const handleDuplicateArticle = () => {
    duplicateArticle.mutate(article._id, {
      onSuccess: ({ id }) => {
        handleCloseDuplicateDialog();
        toast.success(ToastSuccess(id));
      },
    });
  };

  const actionItems: ActionsItem[] = [
    {
      label: "Preview",
      icon: EyeIcon,
      onClick: handleOpenPreviewDialog,
    },
    {
      label: "Duplicate",
      icon: DuplicateIcon,
      onClick: handleOpenDuplicateDialog,
    },
    {
      label: "Delete",
      icon: TrashIcon,
      onClick: handleOpenDeleteDialog,
      color: "error",
    },
  ];

  const mappedColors: Record<ArticleStatus, string> = {
    draft: colors.grey[500],
    published: theme.palette.success.main,
    archived: theme.palette.error.main,
  };

  return (
    <>
      <AlertDialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        title="Delete article"
        content="Are you sure you want to delete this article?"
        onSubmit={handleDeleteArticle}
        isLoading={deleteArticle.isLoading}
      />
      <AlertDialog
        open={openDuplicateDialog}
        onClose={handleCloseDuplicateDialog}
        title={`Duplicate article`}
        content="Are you sure you want to duplicate this article?"
        onSubmit={handleDuplicateArticle}
        isLoading={duplicateArticle.isLoading}
      />
      <MarkdownPreview
        open={openPreviewDialog}
        onClose={handleClosePreviewDialog}
        markdown={article.markdown}
        title={article.title}
        cover={article.cover.url}
      />
      <Head>
        <title>Article</title>
      </Head>
      <Box sx={{ py: 3 }}>
        <Container maxWidth="lg">
          <PageHeader
            actions={actionItems}
            backHref="/articles"
            backLabel="Articles"
            title={article.title}
            isTitleLoading={isLoading}
            isActionsLoading={isLoading}
          >
            <Label color={mappedColors[article.status]}>{article.status}</Label>
          </PageHeader>
          <Grid container spacing={2}>
            <Grid item md={8} xs={12}>
              <ArticleDetailsGeneral
                isEditDisabled={isEditDisabled}
                article={article}
              />
            </Grid>
            <Grid
              container
              item
              md={4}
              spacing={2}
              sx={{ height: "fit-content" }}
              xs={12}
            >
              <Grid item xs={12}>
                <ArticleStatusCategory
                  isEditDisabled={isEditDisabled}
                  article={article}
                />
              </Grid>
              <Grid item xs={12}>
                <ArticleDetailsMeta
                  isEditDisabled={isEditDisabled}
                  article={article}
                />
              </Grid>
            </Grid>
          </Grid>
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
  const { id } = query;
  const queryClient = new QueryClient();

  try {
    await queryClient.fetchQuery(
      ["articles", id],
      getArticle(id, { req, res })
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

export default Article;
