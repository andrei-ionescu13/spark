import { AddProductsDialog } from '@/components/add-products-dialog';
import Link from '@/components/link';
import { TextInput } from '@/components/text-input';
import { useDialog } from '@/hooks/useDialog';
import { Trash } from '@/icons/trash';
import { Product } from '@/types/products';
import {
  Button,
  ButtonGroup,
  Card,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  Typography,
} from '@mui/material';
import { useFormikContext } from 'formik';
import type { FC } from 'react';

const typeOptions = [
  {
    label: 'Fixed amount',
    value: 'amount',
  },
  {
    label: 'Percentage',
    value: 'percentage',
  },
];

export const DiscountFormValue: FC = () => {
  const [dialogOpen, handleOpenDialog, handleCloseDialog] = useDialog();
  const formik = useFormikContext<DiscountFormValues>();

  return (
    <>
      {dialogOpen && (
        <AddProductsDialog
          open
          onClose={() => {
            handleCloseDialog();
          }}
          onAdd={(products: Product[]) => {
            formik.setFieldValue('products', products);
          }}
          selectedProducts={formik.values.products}
        />
      )}
      <Card sx={{ p: 2 }}>
        <Grid
          container
          spacing={2}
        >
          <Grid
            item
            xs={12}
          >
            <Typography
              color="textPrimary"
              variant="subtitle1"
            >
              Value
            </Typography>
          </Grid>
          <Grid
            item
            xs={12}
          >
            <ButtonGroup variant="outlined">
              {typeOptions.map((option) => (
                <Button
                  key={option.value}
                  onClick={() => {
                    formik.setFieldValue('type', option.value);
                  }}
                  variant={
                    formik.values.type === option.value
                      ? 'contained'
                      : 'outlined'
                  }
                >
                  {option.label}
                </Button>
              ))}
            </ButtonGroup>
          </Grid>
          <Grid
            item
            xs={12}
          >
            <TextInput
              error={!!formik.touched.value && !!formik.errors.value}
              helperText={formik.touched.value && formik.errors.value}
              fullWidth
              id="value"
              label="Discount value"
              name="value"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.value}
              InputProps={{
                startAdornment:
                  formik.values.type === 'amount' ? (
                    <InputAdornment position="start">$</InputAdornment>
                  ) : null,
                endAdornment:
                  formik.values.type === 'percentage' ? (
                    <InputAdornment position="end">%</InputAdornment>
                  ) : null,
              }}
            />
          </Grid>
          <Grid
            item
            xs={12}
          >
            <Typography
              color="textPrimary"
              variant="subtitle2"
            >
              Applies to
            </Typography>
          </Grid>
          <Grid
            item
            xs={12}
          >
            <Button
              onClick={handleOpenDialog}
              color="primary"
              variant="contained"
            >
              Browse
            </Button>
          </Grid>
          {formik.touched.products && formik.errors.products && (
            <Grid
              item
              xs={12}
            >
              <FormHelperText error>
                {formik.errors.products as string}
              </FormHelperText>
            </Grid>
          )}
          <Grid
            item
            xs={12}
          >
            <List disablePadding>
              {formik.values.products.map((product) => (
                <ListItem
                  key={product._id}
                  disableGutters
                  divider
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <Link
                    color="textPrimary"
                    variant="body1"
                    underline="hover"
                    href={`/products/${product._id}`}
                  >
                    {product.title}
                  </Link>
                  <IconButton
                    color="error"
                    onClick={() => {
                      formik.setFieldValue(
                        'products',
                        formik.values.products.filter(
                          (_product) => _product._id !== product._id
                        )
                      );
                    }}
                  >
                    <Trash />
                  </IconButton>
                </ListItem>
              ))}
            </List>
          </Grid>
        </Grid>
      </Card>
    </>
  );
};
