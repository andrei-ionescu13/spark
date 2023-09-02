import type { FC, ChangeEvent } from "react";
import {
  ButtonGroup,
  Card,
  Grid,
  InputAdornment,
  List,
  ListItem,
  TextField,
  Typography,
  IconButton,
  FormHelperText,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import type { Product } from "@/types/products";
import { useDialog } from "@/hooks/useDialog";
import { AddProductsDialog } from "@/components/add-products-dialog";
import { Trash as TrashIcon } from "@/icons/trash";
import { Link } from "@/components/link";
import { useFormikContext } from "formik";
import type { PromoCodeFormValues } from "./promo-code-form";
import { Button } from "@/components/button";
import { TextInput } from "@/components/text-input";

const typeOptions = [
  {
    label: "Fixed amount",
    value: "amount",
  },
  {
    label: "Percentage",
    value: "percentage",
  },
];

export const PromoCodeFormValue: FC = () => {
  const formik = useFormikContext<PromoCodeFormValues>();
  const [dialogOpen, handleOpenDialog, handleCloseDialog] = useDialog();

  return (
    <>
      {dialogOpen && (
        <AddProductsDialog
          open
          onClose={() => {
            handleCloseDialog();
          }}
          onAdd={(products: Product[]) => {
            formik.setFieldValue("products", products);
          }}
          selectedProducts={formik.values.products}
        />
      )}
      <Card sx={{ p: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography color="textPrimary" variant="subtitle1">
              Value
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <ButtonGroup variant="outlined">
              {typeOptions.map((option) => (
                <Button
                  key={option.value}
                  onClick={() => {
                    formik.setFieldValue("type", option.value);
                  }}
                  variant={
                    formik.values.type === option.value
                      ? "contained"
                      : "outlined"
                  }
                >
                  {option.label}
                </Button>
              ))}
            </ButtonGroup>
          </Grid>
          <Grid item xs={12}>
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
                  formik.values.type === "amount" ? (
                    <InputAdornment position="start">$</InputAdornment>
                  ) : null,
                endAdornment:
                  formik.values.type === "percentage" ? (
                    <InputAdornment position="end">%</InputAdornment>
                  ) : null,
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography color="textPrimary" variant="subtitle2">
              Applies to
            </Typography>
            <RadioGroup
              value={formik.values.productSelection}
              onChange={(event: ChangeEvent<HTMLInputElement>) => {
                formik.setFieldTouched("products", false, false);
                formik.setFieldValue(
                  "productSelection",
                  (event.target as HTMLInputElement).value
                );
              }}
            >
              <FormControlLabel
                value="general"
                control={<Radio />}
                label="General"
              />
              <FormControlLabel
                value="selected"
                control={<Radio />}
                label="Selected products"
              />
            </RadioGroup>
          </Grid>
          <Grid item xs={12}>
            <Button
              disabled={formik.values.productSelection !== "selected"}
              onClick={handleOpenDialog}
              color="primary"
              variant="contained"
            >
              Browse
            </Button>
          </Grid>
          {formik.touched.products && formik.errors.products && (
            <Grid item xs={12}>
              <FormHelperText error>
                {formik.errors.products as string}
              </FormHelperText>
            </Grid>
          )}
          {formik.values.productSelection === "selected" &&
            !!formik.values.products.length && (
              <Grid item xs={12}>
                <List disablePadding>
                  {formik.values.products.map((product) => (
                    <ListItem
                      key={product._id}
                      disableGutters
                      divider
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
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
                            "products",
                            formik.values.products.filter(
                              (_product) => _product._id !== product._id
                            )
                          );
                        }}
                      >
                        <TrashIcon />
                      </IconButton>
                    </ListItem>
                  ))}
                </List>
              </Grid>
            )}
        </Grid>
      </Card>
    </>
  );
};
