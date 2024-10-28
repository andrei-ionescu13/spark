"use client"

import type { FC } from 'react';
import { Box, Card, CardContent, CardHeader, Divider, Grid } from '@mui/material';
import { InfoListItem } from '../../../components/info-list-item';
import { InfoList } from '../../../components/info-list';
import { useDialog } from '../../../hooks/useDialog';
import type { Product } from '../../../types/products';
import { Link } from '../../../components/link';
import { ProductMediaForm } from './product-media-form';
import Image from 'next/image';
import { Button } from '../../../components/button';
import { useGetCollectionQuery, useGetProduct } from 'app/(dashboard)/products/api-calls-hooks';

interface ProductMediaProps {
  product: Product;
  isEditDisabled?: boolean;
}

export const ProductMedia: FC<ProductMediaProps> = (props) => {
  const { product, isEditDisabled = false } = props;
  const [dialogOpen, handleOpenDialog, handleCloseDialog] = useDialog();

  return (
    <>
      {dialogOpen && <ProductMediaForm
        product={product}
        onClose={handleCloseDialog}
        open
      />}
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
          title="Media"
        />
        <Divider />
        <CardContent>
          <Grid
            container
            spacing={2}
          >
            <Grid
              item
              xs={12}
            >
              <InfoList>
                <InfoListItem title="Cover">
                  <Box>
                    <Link
                      target="_blank"
                      href={product.cover.url}
                      sx={{ display: 'block' }}
                    >
                      <Image
                        alt={product.title}
                        src={product.cover.url}
                        width={16}
                        height={9}
                        priority
                        layout="responsive"
                      />
                    </Link>
                  </Box>
                </InfoListItem>
                <InfoListItem title="Videos">
                  <InfoList sx={{ gap: 0 }}>
                    {product.videos.map((video) => (
                      <InfoListItem
                        key={video}
                        content={video}
                        contentTypographyProps={{
                          component: Link,
                          href: video,
                          target: '_blank',
                          underline: 'hover'
                        }}
                      />
                    ))}
                  </InfoList>
                </InfoListItem>
                <InfoListItem title="Images">
                  <Grid
                    container
                    spacing={3}
                  >
                    {product.selectedImages.map((image) => (
                      <Grid
                        item
                        key={image.public_id}
                        xs={12}
                        sm={6}
                        md={4}
                      >
                        <Link
                          target="_blank"
                          href={image.url}
                          sx={{ display: 'block' }}
                        >
                          <Image
                            alt={image.public_id}
                            src={image.url}
                            width={16}
                            height={9}
                            priority
                            layout="responsive"
                          />
                        </Link>
                      </Grid>
                    ))}
                  </Grid>
                </InfoListItem>
              </InfoList>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </>
  );
};
