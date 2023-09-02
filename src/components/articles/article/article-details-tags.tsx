import type { FC } from "react";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import { useQueryClient } from "react-query";
import * as Yup from "yup";
import {
  Card,
  CardContent,
  CardHeader,
  Chip,
  colors,
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  MenuItem,
  Select,
  useTheme,
} from "@mui/material";
import { Button } from "@/components/button";
import { StatusSelect } from "@/components/status";
import type { StatusOption } from "@/components/status";
import {
  useUpdateArticleStatus,
  useUpdateArticleCategory,
} from "@/api/articles";
import { Article } from "@/types/articles";
import { ArticleCategory } from "@/types/article-category";
import { ArticleTag } from "@/types/article-tag";
import { useDialog } from "@/hooks/useDialog";
import { ArticleDetailsTagsForm } from "./article-details-tags-form";

interface ArticleStatusTagProps {
  article: Article;
  isEditDisabled?: boolean;
}

export const ArticleDetailsTags: FC<ArticleStatusTagProps> = (props) => {
  const { article, isEditDisabled } = props;
  const [dialogOpen, handleOpenDialog, handleCloseDialog] = useDialog();

  return (
    <>
      <Card>
        <CardHeader
          title="Tags"
          action={
            <Button
              color="secondary"
              onClick={handleOpenDialog}
              variant="text"
              disabled={isEditDisabled}
            >
              Edit
            </Button>
          }
        />
        <Divider />
        <CardContent
          sx={{
            display: "flex",
            gap: 1,
          }}
        >
          {article.tags.map((tag) => (
            <Chip size="small" label={tag.name} />
          ))}
        </CardContent>
      </Card>
      {dialogOpen && (
        <ArticleDetailsTagsForm
          article={article}
          onClose={handleCloseDialog}
          open
        />
      )}
    </>
  );
};
