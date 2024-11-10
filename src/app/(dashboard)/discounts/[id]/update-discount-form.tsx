import { Button } from '@/components/button';
import { FormInterval } from '@/components/form-interval';
import { TextInput } from '@/components/text-input';
import { Discount } from '@/types/discounts';
import { Product } from '@/types/products';
import { Card, FormHelperText, Grid, Typography } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { Formik } from 'formik';
import type { ChangeEvent, FC } from 'react';
import { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { DiscountFormValue } from '../discount-form-value';
import { DiscountSummary } from '../discount-summary';
import { useUpdateDiscount } from './api';

interface UpdateDiscountFormProps {
  discount: Discount;
}

export interface FormValues {
  products: Product[];
  startDate: Date | null;
  type: string;
  value: string | number;
  title: string;
  endDate: Date | null;
}

export const UpdateDiscountForm: FC<UpdateDiscountFormProps> = (props) => {
  const { discount } = props;
  const queryClient = useQueryClient();
  const [shouldSetEndDate, setShouldSetEndDate] = useState(!!discount?.endDate);
  const updateDiscount = useUpdateDiscount(() =>
    queryClient.invalidateQueries({ queryKey: ['discount', discount?._id] })
  );
  const [submitError, setSubmitError] = useState<string | null>(null);

  const initialValues: FormValues = {
    products: discount?.products || [],
    startDate: discount?.startDate || null,
    type: discount?.type || 'amount',
    value: discount?.value || '',
    title: discount?.title || '',
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

          updateDiscount.mutate(
            { id: discount._id, body: formValues },
            {
              onSuccess: async () => {
                queryClient.invalidateQueries({
                  queryKey: ['discount', discount?._id],
                });
              },
              onError: (error) => {
                setSubmitError(error.message);
              },
            }
          );
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
                  isLoading={updateDiscount.isPending}
                  onClick={() => {
                    formik.handleSubmit();
                  }}
                >
                  Update
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
