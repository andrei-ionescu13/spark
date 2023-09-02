import type { FC } from "react";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import { useQueryClient } from "react-query";
import * as Yup from "yup";
import {
  Card,
  CardContent,
  CardHeader,
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

interface ArticleStatusTagProps {
  article: Article;
  isEditDisabled?: boolean;
  categories: ArticleCategory[];
}

interface Category {
  label: string;
  value: string;
}

export const ArticleStatusCategory: FC<ArticleStatusTagProps> = (props) => {
  const { article, categories, isEditDisabled } = props;
  const theme = useTheme();
  const queryClient = useQueryClient();
  const updateArticleStatus = useUpdateArticleStatus(article._id);
  const updateArticleCategory = useUpdateArticleCategory(article._id);

  const categoryOptions: Category[] = categories?.map((category) => ({
    label: category.name,
    value: category._id,
  }));

  const statusOptions: StatusOption[] = [
    {
      label: "Published",
      value: "published",
      color: theme.palette.success.main,
    },
    {
      label: "Draft",
      value: "draft",
      color: colors.grey[500],
    },
    {
      label: "Archived",
      value: "archived",
      color: theme.palette.error.main,
    },
  ];

  const formikStatus = useFormik({
    initialValues: {
      status: article.status,
    },
    validationSchema: Yup.object({
      status: Yup.string()
        .oneOf(statusOptions.map((status) => status.value))
        .required("Required"),
    }),
    onSubmit: (values) => {
      updateArticleStatus.mutate(values, {
        onSuccess: ({ status }) => {
          queryClient.setQueryData(["articles", article._id], {
            ...article,
            status,
          });
          toast.success("Article updated");
        },
        onError: (error) => {
          toast.error(error.message);
        },
      });
    },
  });

  const formikTag = useFormik({
    initialValues: {
      category: article.category._id,
    },
    validationSchema: Yup.object({
      category: Yup.string()
        .oneOf(categoryOptions.map((category) => category.value))
        .required("Required"),
    }),
    onSubmit: (values) => {
      updateArticleCategory.mutate(values, {
        onSuccess: ({ category }) => {
          queryClient.setQueryData(["articles", article._id], {
            ...article,
            category,
          });
          toast.success("Article updated");
        },
        onError: (error) => {
          toast.error(error.message);
        },
      });
    },
  });

  return (
    <Card>
      <CardHeader title="Status/Tag" />
      <Divider />
      <CardContent>
        <Grid container spacing={2}>
          <Grid
            item
            xs={12}
            sx={{
              display: "grid",
              gridTemplateColumns: "9fr 3fr",
              gap: 1,
            }}
          >
            <FormControl
              error={
                !!formikStatus.touched.status && !!formikStatus.errors.status
              }
              fullWidth
              size="small"
            >
              <StatusSelect
                id="status"
                name="status"
                onBlur={formikStatus.handleBlur}
                onChange={formikStatus.handleChange}
                value={formikStatus.values.status}
                options={statusOptions}
              />
              {!!formikStatus.touched.status &&
                !!formikStatus.errors.status && (
                  <FormHelperText>{formikStatus.errors.status}</FormHelperText>
                )}
            </FormControl>
            <Button
              color="primary"
              variant="contained"
              isLoading={updateArticleStatus.isLoading}
              disabled={formikStatus.values.status === article.status}
              onClick={() => {
                formikStatus.handleSubmit();
              }}
            >
              Update
            </Button>
          </Grid>
          <Grid
            item
            xs={12}
            sx={{
              display: "grid",
              gridTemplateColumns: "9fr 3fr",
              gap: 1,
            }}
          >
            <FormControl
              error={
                !!formikTag.touched.category && !!formikTag.errors.category
              }
              fullWidth
              size="small"
            >
              <Select
                id="category"
                name="category"
                onBlur={formikTag.handleBlur}
                onChange={formikTag.handleChange}
                value={formikTag.values.category}
              >
                {categoryOptions.map((category) => (
                  <MenuItem value={category.value} key={category.value}>
                    {category.label}
                  </MenuItem>
                ))}
              </Select>
              {!!formikTag.touched.category && !!formikTag.errors.category && (
                <FormHelperText>{formikTag.errors.category}</FormHelperText>
              )}
            </FormControl>
            <Button
              color="primary"
              disabled={
                isEditDisabled ||
                formikTag.values.category === article.category._id
              }
              isLoading={updateArticleCategory.isLoading}
              onClick={() => {
                formikTag.handleSubmit();
              }}
              variant="contained"
            >
              Update
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};
