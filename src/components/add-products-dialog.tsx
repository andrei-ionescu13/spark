import { useState } from 'react'
import type { FC, ChangeEvent, ReactNode } from 'react'
import {
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  List,
  Typography,
} from '@mui/material'
import type { Product } from '@/types/products';
import { appFetch } from '@/utils/app-fetch';
import { Button } from '@/components/button';
import { useQuery } from 'react-query';
import { SearchInput } from '@/components/search-input';
import { Box } from '@mui/system';
import { AddProductsDialogItem } from './add-products-dialog-item';

interface GetProductsData {
  products: Product[];
  count: number;
}

const getProducts = (query: Record<string, any>) => () => appFetch<GetProductsData>({
  url: '/products',
  query,
  withAuth: true
})

interface AddProductsDialogProps {
  open: boolean;
  onClose: any;
  onAdd: any;
  selectedProducts: Product[];
}

export const AddProductsDialog: FC<AddProductsDialogProps> = (props) => {
  const { open, onClose, onAdd, selectedProducts: selectedProductsProp = [] } = props;
  const [keyword, setKeyword] = useState('');
  const { error, data, isLoading } = useQuery(['products', { keyword }], getProducts({ keyword }), { keepPreviousData: true });
  const products = data?.products || [];
  const [selectedProducts, setSelectedProducts] = useState<Product[]>(selectedProductsProp);

  const handleKeywordChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setKeyword(event.target.value)
  }

  const handleProductSelect = (product: Product): void => {
    if (selectedProducts.map((product) => product._id).includes(product._id)) {
      setSelectedProducts((prevProducts) => prevProducts.filter((_product) => _product._id !== product._id))
      return;
    }

    setSelectedProducts((prevProducts) => ([...prevProducts, product]))
  }

  const getContent = (): ReactNode => {
    if (isLoading) {
      return (
        <Box sx={{ display: 'grid', placeItems: 'center', p: 5 }}>
          <CircularProgress />
        </Box>
      )
    }

    if (!!products.length) {
      return (
        <List disablePadding>
          {products.map((product) => (
            <AddProductsDialogItem
              key={product._id}
              product={product}
              onSelect={handleProductSelect}
              selected={selectedProducts.map((product) => product._id).includes(product._id)}
            />
          ))}
        </List>
      )
    }

    return (
      <Box sx={{ p: 2 }}>
        <Typography
          color="textSecondary"
          variant="body2"
        >
          No results found for &quot;
          {keyword}
          &quot;
        </Typography>
      </Box>
    )
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        Add products
      </DialogTitle>
      <DialogContent sx={{ px: 0 }}>
        <Box sx={{ px: 2, pb: 2 }}>
          <form onSubmit={() => { }}>
            <SearchInput
              onChange={handleKeywordChange}
              placeholder="Search products..."
              value={keyword}
            />
          </form>
        </Box>
        <Divider />
        {getContent()}
      </DialogContent>
      <DialogActions>
        <Button
          color="secondary"
          onClick={onClose}
          variant="text"
        >
          Cancel
        </Button>
        <Button
          autoFocus
          color="primary"
          onClick={() => { onAdd(selectedProducts); onClose(); }}
          variant="contained"
        >
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
};