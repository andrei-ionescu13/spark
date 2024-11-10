import { Button } from '@/components/button';
import { FormInterval } from '@/components/form-interval';
import { TextInput } from '@/components/text-input';
import { ToastItemCreated } from '@/components/toast-item-created';
import { Product } from '@/types/products';
import { Card, FormHelperText, Grid, Typography } from '@mui/material';
import { Formik } from 'formik';
import type { ChangeEvent, FC } from 'react';
import { useState } from 'react';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import { DiscountFormValue } from '../discount-form-value';
import { DiscountSummary } from '../discount-summary';
import { useCreateDiscount } from './api';

export interface CreateDiscountFormProps {}

interface FormValues {
  products: Product[];
  startDate: Date | null;
  type: string;
  value: string | number;
  title: string;
  endDate: Date | null;
}

export const CreateDiscountForm: FC<CreateDiscountFormProps> = (props) => {
  const [shouldSetEndDate, setShouldSetEndDate] = useState(false);
  const createDiscount = useCreateDiscount();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const initialValues: FormValues = {
    products: [],
    startDate: null,
    type: 'amount',
    value: '',
    title: '',
    endDate: null,
  };

  const onShouldSetEndDateChange = (
    event: ChangeEvent<HTMLInputElement>
  ): void => {
    setShouldSetEndDate(event.target.checked);
  };

  return (
    <Grid
      container
      spacing={3}
    >
      <Formik
        initialValues={initialValues}
        validationSchema={Yup.object({
          products: Yup.array().of(Yup.mixed()).min(1).required(),
          startDate: Yup.date().required(),
          type: Yup.string().oneOf(['percentage', 'amount']).required(),
          value: Yup.number().required(),
          title: Yup.string().required(),
          ...(shouldSetEndDate && { endDate: Yup.date().required() }),
        })}
        onSubmit={(values, { resetForm }) => {
          const formValues: Record<string, any> = { ...values };
          formValues.products = values.products.map((product) => product?._id);
          formValues.endDate = shouldSetEndDate ? values.endDate : null;

          setSubmitError(null);

          createDiscount.mutate(formValues, {
            onSuccess: (discount) => {
              resetForm();
              toast.success(
                ToastItemCreated('discount', `/discounts/${discount._id}`)
              );
            },
            onError: (error) => {
              setSubmitError(error.message);
            },
          });
        }}
      >
        {(formik) => (
          <>
            <Grid
              item
              xs={8}
              container
              spacing={3}
            >
              <Grid
                item
                xs={12}
              >
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
                        Discount title
                      </Typography>
                    </Grid>
                    <Grid
                      item
                      xs={12}
                    >
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
              <Grid
                item
                xs={12}
              >
                <DiscountFormValue />
              </Grid>
              <Grid
                item
                xs={12}
              >
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
              sx={{ height: 'fit-content' }}
              spacing={3}
            >
              <Grid
                item
                xs={12}
              >
                <DiscountSummary
                  {...formik.values}
                  endDate={shouldSetEndDate ? formik.values.endDate : null}
                />
              </Grid>
              <Grid
                item
                xs={12}
              >
                <Button
                  color="primary"
                  fullWidth
                  size="large"
                  variant="contained"
                  isLoading={createDiscount.isPending}
                  onClick={() => {
                    formik.handleSubmit();
                  }}
                >
                  Add
                </Button>
              </Grid>
              {!!submitError && (
                <Grid
                  item
                  xs={12}
                >
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
