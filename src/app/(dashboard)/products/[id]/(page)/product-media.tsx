'use client';

import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
} from '@mui/material';
import Image from 'next/image';
import type { FC } from 'react';
import { Button } from '../../../../components/button';
import { InfoList } from '../../../../components/info-list';
import { InfoListItem } from '../../../../components/info-list-item';
import { Link } from '../../../../components/link';
import type { Product } from '../../../../types/products';

interface ProductMediaProps {
  product: Product;
  isEditDisabled?: boolean;
  onEdit: () => void;
}

export const ProductMedia: FC<ProductMediaProps> = (props) => {
  const { product, isEditDisabled = false, onEdit } = props;

  return (
    <Card>
      <CardHeader
        action={
          <Button
            variant="text"
            color="secondary"
            onClick={onEdit}
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
                        underline: 'hover',
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
  );
};
