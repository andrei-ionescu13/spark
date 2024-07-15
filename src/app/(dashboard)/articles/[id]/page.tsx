"use client"
import type { FC } from "react";
import Head from "next/head";
import { useRouter } from "next/navigation";
import type { GetServerSideProps } from "next";
import { toast } from "react-toastify";
import {
  Box,
  colors,
  Container,
  Grid,
  Link,
  Typography,
  useTheme,
} from "@mui/material";
import { listArticleCategories } from "@/api/article-categories";
import { useDeleteArticle, useDuplicateArticle } from "@/api/articles";
import { ActionsItem } from "@/components/actions-menu";
import { AlertDialog } from "@/components/alert-dialog";
import { MarkdownPreview } from "@/components/markdown-preview";
import { PageHeader } from "@/components/page-header";
import { useDialog } from "@/hooks/useDialog";
import { ArticleStatus } from "@/types/articles";
import { appFetch } from "@/utils/app-fetch";
import { Article as ArticleI } from "@/types/articles";
import { useQuery, QueryClient, dehydrate } from "@tanstack/react-query";
import { Duplicate as DuplicateIcon } from "@/icons/duplicate";
import { Eye as EyeIcon } from "@/icons/eye";
import { Trash as TrashIcon } from "@/icons/trash";
import { Label } from "@/components/label";
import { ArticleDetailsGeneral } from "./article-details-general";
import { ArticleDetailsMeta } from "./article-details-meta";
import { ArticleDetailsTags } from "./article-details-tags";
import { ArticleStatusCategory } from "./article-status-category";


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

const Article: FC<any> = ({ params }) => {
  const theme = useTheme();
  const router = useRouter();
  const { id } = params;
  const { data: article, isLoading } = useQuery({
    queryKey: ["articles", id],
    queryFn: getArticle(id)
  });
  const { data: articleCategories } = useQuery({
    queryKey: ["article-categories"],
    queryFn: listArticleCategories()
  });

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
  const duplicateArticle = useDuplicateArticle(article?._id || "");
  const isEditDisabled = article?.status === "archived";

  if (!article || !articleCategories) return null;

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
        isLoading={deleteArticle.isPending}
      />
      <AlertDialog
        open={openDuplicateDialog}
        onClose={handleCloseDuplicateDialog}
        title={`Duplicate article`}
        content="Are you sure you want to duplicate this article?"
        onSubmit={handleDuplicateArticle}
        isLoading={duplicateArticle.isPending}
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
                  categories={articleCategories}
                />
              </Grid>
              <Grid item xs={12}>
                <ArticleDetailsTags
                  article={article}
                  isEditDisabled={isEditDisabled}
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


export default Article;
