import { useRef, useState } from "react";
import type { FC } from "react";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
} from "@mui/material";
import { ArticleDetailsGeneralForm } from "@/components/articles/article/article-details-general-form";
import { InfoList } from "@/components/info-list";
import { InfoListItem } from "@/components/info-list-item";
import { formatDate } from "@/utils/format-date";
import { Article } from "@/types/articles";
import { Link } from "@/components/link";
import Image from "next/image";
import { Button } from "@/components/button";

interface ArticleDetailsGeneralProps {
  article: Article;
  isEditDisabled?: boolean;
}

export const ArticleDetailsGeneral: FC<ArticleDetailsGeneralProps> = (
  props
) => {
  const { article, isEditDisabled } = props;
  const [openDialog, setOpenDialog] = useState(false);
  const ref = useRef<HTMLElement>(null);

  const handleOpenDialog = (): void => {
    setOpenDialog(true);
  };

  const handleCloseDialog = (): void => {
    setOpenDialog(false);
  };

  return (
    <>
      <Card>
        <CardHeader
          action={
            <Button
              color="secondary"
              disabled={isEditDisabled}
              onClick={handleOpenDialog}
              variant="text"
            >
              Edit
            </Button>
          }
          title="General"
        />
        <Divider />
        <CardContent>
          <Grid container spacing={2.5}>
            <Grid item md={6} xs={12}>
              <InfoList>
                <InfoListItem content={article._id} title="Id" />

                <InfoListItem content={article.slug} title="Slug" />
                <InfoListItem
                  content={article.description}
                  title="Description"
                />
              </InfoList>
            </Grid>
            <Grid item md={6} xs={12}>
              <InfoList>
                <InfoListItem
                  content={formatDate(article.createdAt)}
                  title="Created At"
                />
                {article.updatedAt && (
                  <InfoListItem
                    content={formatDate(article.updatedAt)}
                    title="Updated At"
                  />
                )}
              </InfoList>
            </Grid>
            <Grid item xs={12}>
              <InfoList>
                <InfoListItem content={article.markdown} title="Content" />
                <InfoListItem title="Cover image">
                  <Box ref={ref}>
                    <Link target="_blank" href={article.cover.url}>
                      <Image
                        src={article.cover.url}
                        width={16}
                        height={9}
                        priority
                        layout="responsive"
                        alt={article.title}
                      />
                    </Link>
                  </Box>
                </InfoListItem>
              </InfoList>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      {openDialog && (
        <ArticleDetailsGeneralForm
          article={article}
          onClose={handleCloseDialog}
          open
        />
      )}
    </>
  );
};
