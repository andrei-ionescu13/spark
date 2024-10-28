"use client"

import { useState } from "react";
import type { FC } from "react";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  IconButton,
} from "@mui/material";
import { InfoListItem } from "../../../components/info-list-item";
import { InfoList } from "../../../components/info-list";
import { useDialog } from "../../../hooks/useDialog";
import { Eye as EyeIcon } from "../../../icons/eye";
import type { Product } from "../../../types/products";
import { ProductGeneralForm } from "./product-general-form";
import { formatDate } from "../../../utils/format-date";
import { MarkdownPreview } from "../../../components/markdown-preview";
import { Button } from "../../../components/button";
import { useGetCollectionQuery, useGetProduct } from "app/(dashboard)/products/api-calls-hooks";

interface ProductGeneralProps {
  product: Product;
  isEditDisabled?: boolean;
}

export const ProductGeneral: FC<ProductGeneralProps> = (props) => {
  const { product, isEditDisabled = false } = props;
  const [dialogOpen, handleOpenDialog, handleCloseDialog] = useDialog();
  const [openPreviewDialog, handleOpenPreviewDialog, handleClosePreviewDialog] =
    useDialog();
  const [previewSelected, setPreviewSelected] = useState<
    "minimumRequirements" | "recommendedRequirements" | "markdown" | undefined
  >();

  if (!product) return null;

  return (
    <>
      {dialogOpen && (
        <ProductGeneralForm
          onClose={handleCloseDialog}
          open
          product={product}
        />
      )}
      <Card>
        <CardHeader
          action={
            <Button
              variant="text"
              color="secondary"
              onClick={handleOpenDialog}
              disabled={isEditDisabled}
            >
              Edit
            </Button>
          }
          title="Details"
        />
        <Divider />
        <CardContent>
          <Grid container spacing={2.5} sx={{ wordBreak: "break-all" }}>
            <Grid item xs={12} sm={6}>
              <InfoList>
                <InfoListItem title="Id" content={product._id} type="line" />
                <InfoListItem
                  title="Title"
                  content={product.title}
                  type="line"
                />
                <InfoListItem
                  title="Genres"
                  content={product.genres.map((genre) => genre.name).join(", ")}
                  type="line"
                />
                <InfoListItem
                  title="Publisher"
                  content={product.publisher.name}
                  type="line"
                />
                <InfoListItem
                  title="Developer"
                  content={product.developers
                    .map((developer) => developer.name)
                    .join(", ")}
                  type="line"
                />
                <InfoListItem
                  title="Languages"
                  content={product.languages
                    .map((language) => language.name)
                    .join(", ")}
                  type="line"
                />
                <InfoListItem
                  title="Features"
                  content={product.features
                    .map((feature) => feature.name)
                    .join(", ")}
                  type="line"
                />
                <InfoListItem
                  title="Platform"
                  content={product.platform.name}
                  type="line"
                />
                <InfoListItem
                  title="Os"
                  content={product.os.map((_os) => _os.name).join(", ")}
                  type="line"
                />
              </InfoList>
            </Grid>
            <Grid item xs={12} sm={6}>
              <InfoList>
                <InfoListItem
                  title="Price"
                  content={`${product.price}$`}
                  type="line"
                />
                <InfoListItem
                  title="Release date"
                  content={formatDate(product.releaseDate)}
                  type="line"
                />
                <InfoListItem
                  title="Created At"
                  content={formatDate(product.createdAt)}
                  type="line"
                />
              </InfoList>
            </Grid>
            <Grid item xs={12} sm={6}>
              <InfoListItem
                title="Minimum Requirements"
                content={product.minimumRequirements}
              />
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                }}
              >
                <IconButton
                  color="secondary"
                  onClick={() => {
                    setPreviewSelected("minimumRequirements");
                    handleOpenPreviewDialog();
                  }}
                >
                  <EyeIcon />
                </IconButton>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <InfoListItem
                title="Recommended Requirements"
                content={product.recommendedRequirements}
              />
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                }}
              >
                <IconButton
                  color="secondary"
                  onClick={() => {
                    setPreviewSelected("recommendedRequirements");
                    handleOpenPreviewDialog();
                  }}
                >
                  <EyeIcon />
                </IconButton>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <InfoListItem title="Markdown" content={product.markdown} />
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                }}
              >
                <IconButton
                  color="secondary"
                  onClick={() => {
                    setPreviewSelected("markdown");
                    handleOpenPreviewDialog();
                  }}
                >
                  <EyeIcon />
                </IconButton>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      {openPreviewDialog && previewSelected && (
        <MarkdownPreview
          open
          onClose={handleClosePreviewDialog}
          markdown={product[previewSelected]}
        />
      )}
    </>
  );
};
