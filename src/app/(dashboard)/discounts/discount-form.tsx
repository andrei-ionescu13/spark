import { useEffect, useState } from "react";
import type { ChangeEvent, FC } from "react";
import { Box, Button, Card, FormHelperText, Grid, Typography } from "@mui/material";
import { Formik } from "formik";
import * as Yup from "yup";
import { useCreateDiscount, useUpdateDiscount } from "@/api/discounts";
import { DiscountFormValue } from "./discount-form-value";
import Link from "@/components/link";
import { FormInterval } from "@/components/form-interval";
import { TextInput } from "@/components/text-input";
import { ToastItemCreated } from "@/components/toast-item-created";
import { Discount } from "@/types/discounts";
import { Product } from "@/types/products";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { DiscountSummary } from "./discount-summary";

const ToastSuccess = (id: string) => (
  <Box>
    <Typography variant="body1" color="textPrimary">
      Discount created
    </Typography>
    <Link
      color="textPrimary"
      href={`/discounts/${id}`}
      underline="hover"
      variant="body1"
    >
      Go to the created discount
    </Link>
  </Box>
);

interface DiscountFormProps {
  discount?: Discount;
  mode: "create" | "update";
  discountIsRefetching?: boolean;
}

export interface DiscountFormValues {
  products: Product[];
  startDate: Date | null;
  type: string;
  value: string | number;
  title: string;
  endDate: Date | null;
}

export const DiscountForm: FC<DiscountFormProps> = (props) => {
  const { discount, mode } = props;
  const queryClient = useQueryClient();
  const [shouldSetEndDate, setShouldSetEndDate] = useState(!!discount?.endDate);
  const createDiscount = useCreateDiscount();
  const updateDiscount = useUpdateDiscount(() =>
    queryClient.invalidateQueries({ queryKey: ["discount", discount?._id] })
  );
  const [submitError, setSubmitError] = useState<string | null>(null);

  const initialValues: DiscountFormValues = {
    products: discount?.products || [],
    startDate: discount?.startDate || null,
    type: discount?.type || "amount",
    value: discount?.value || "",
    title: discount?.title || "",
    endDate: discount?.endDate || null,
  };

  const onShouldSetEndDateChange = (
    event: ChangeEvent<HTMLInputElement>
  ): void => {
    setShouldSetEndDate(event.target.checked);
  };

  useEffect(() => {
    setShouldSetEndDate(!!discount?.endDate);
  }, [discount?.endDate]);

  const isPending = createDiscount.isPending || updateDiscount.isPending;

  return (
    <Grid container spacing={3}>
      <Formik
        initialValues={initialValues}
        validationSchema={Yup.object({
          products: Yup.array().of(Yup.mixed()).min(1).required(),
          startDate: Yup.date().required(),
          type: Yup.string().oneOf(["percentage", "amount"]).required(),
          value: Yup.number().required(),
          title: Yup.string().required(),
          ...(shouldSetEndDate && { endDate: Yup.date().required() }),
        })}
        onSubmit={(values, { resetForm }) => {
          const formValues: Record<string, any> = { ...values };
          formValues.products = values.products.map((product) => product?._id);
          formValues.endDate = shouldSetEndDate ? values.endDate : null;

          setSubmitError(null);

          if (mode === "create") {
            createDiscount.mutate(formValues, {
              onSuccess: (discount) => {
                resetForm();
                toast.success(
                  ToastItemCreated("discount", `/discounts/${discount._id}`)
                );
              },
              onError: (error) => {
                setSubmitError(error.message);
              },
            });
            return;
          }

          if (discount) {
            updateDiscount.mutate(
              { id: discount._id, body: formValues },
              {
                onSuccess: async () => {
                  queryClient.invalidateQueries({ queryKey: ["discount", discount?._id] });
                },
                onError: (error) => {
                  setSubmitError(error.message);
                },
              }
            );
          }
        }}
      >
        {(formik) => (
          <>
            <Grid item xs={8} container spacing={3}>
              <Grid item xs={12}>
                <Card sx={{ p: 2 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Typography color="textPrimary" variant="subtitle1">
                        Discount title
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <TextInput
                        error={!!formik.touched.title && !!formik.errors.title}
                        helperText={formik.touched.title && formik.errors.title}
                        fullWidth
                        id="title"
                        label="Discount title"
                        name="title"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        value={formik.values.title}
                      />
                    </Grid>
                  </Grid>
                </Card>
              </Grid>
              <Grid item xs={12}>
                <DiscountFormValue />
              </Grid>
              <Grid item xs={12}>
                <FormInterval
                  formik={formik}
                  onShouldSetEndDateChange={onShouldSetEndDateChange}
                  shouldSetEndDate={shouldSetEndDate}
                />
              </Grid>
            </Grid>
            <Grid
              item
              xs={4}
              container
              sx={{ height: "fit-content" }}
              spacing={3}
            >
              <Grid item xs={12}>
                <DiscountSummary
                  {...formik.values}
                  endDate={shouldSetEndDate ? formik.values.endDate : null}
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  color="primary"
                  fullWidth
                  size="large"
                  variant="contained"
                  isLoading={isPending}
                  onClick={() => {
                    formik.handleSubmit();
                  }}
                >
                  {mode === "create" ? "Create" : "Update"}
                </Button>
              </Grid>
              {!!submitError && (
                <Grid item xs={12}>
                  <FormHelperText error>{submitError}</FormHelperText>
                </Grid>
              )}
            </Grid>
          </>
        )}
      </Formik>
    </Grid>
  );
};
