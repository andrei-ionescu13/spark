import type { FC } from 'react';
import {
  Box,
  Checkbox,
  colors,
  ListItem,
  Typography,
  useTheme,
  alpha
} from '@mui/material'
import type { Product } from '../types/products';
import { Label } from './label';

interface AddProductsDialogItemProps {
  product: Product;
  selected?: boolean;
  onSelect: any;
}

export const AddProductsDialogItem: FC<AddProductsDialogItemProps> = (props) => {
  const { product, selected = false, onSelect } = props;
  const theme = useTheme()

  const mappedColors = {
    draft: colors.grey[500],
    published: theme.palette.success.main,
    archived: theme.palette.error.main
  }

  return (
    <ListItem
      onClick={() => { onSelect(product) }}
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        p: 2,
        borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
        cursor: 'pointer',
        backgroundColor: (theme) => selected ? alpha(theme.palette.primary.main, 0.12) : undefined,
        '&:hover': {
          backgroundColor: (theme) => selected ? alpha(theme.palette.primary.main, 0.12) : (theme.palette.mode === 'light' ? 'rgba(0, 0, 0, 0.04)' : 'rgba(255, 255, 255, 0.04)')
        }
      }}
    >
      <Checkbox
        color="primary"
        checked={selected}
        disableRipple
      />
      <Box>
        <Typography
          color="textPrimary"
          variant="body1"
        >
          {product.title}
        </Typography>
        <Label color={mappedColors[product.status]}>
          {product.status}
        </Label>
      </Box>
      <Box sx={{ flexGrow: 1 }} />
      <Typography
        color="textPrimary"
        variant="body1"
      >
        $
        {product.price}
      </Typography>
    </ListItem>
  )
}