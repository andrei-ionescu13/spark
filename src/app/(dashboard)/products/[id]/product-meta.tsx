"use client"
import type { FC } from 'react';
import { Card, CardContent, CardHeader, Divider } from '@mui/material';
import { InfoListItem } from '../../../components/info-list-item';
import { InfoList } from '../../../components/info-list';
import type { Product } from '../../../types/products';
import { ProductMetaForm } from './product-meta-form';
import { useDialog } from '../../../hooks/useDialog';
import { Button } from '../../../components/button';
import { useGetCollectionQuery, useGetProduct } from 'app/(dashboard)/products/api-calls-hooks';

interface ProductMetaProps {
  product: Product;
  isEditDisabled?: boolean;
}

export const ProductMeta: FC<ProductMetaProps> = (props) => {
  const { product, isEditDisabled = false } = props;
  const [dialogOpen, handleOpenDialog, handleCloseDialog] = useDialog();

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
          title="Meta"
        />
        <Divider />
        <CardContent>
          <InfoList>
            <InfoListItem
              title="Title"
              content={product.metaTitle}
            />
            <InfoListItem
              title="Description"
              content={product.metaDescription}
            />
            <InfoListItem
              title="Keywords"
              content={product.metaKeywords.join(', ')}
            />
          </InfoList>
        </CardContent>
      </Card>
      <ProductMetaForm
        open={dialogOpen}
        onClose={handleCloseDialog}
        product={product}
      />
    </>
  )
}
