import { Button } from '@/components/button';
import { FormInterval } from '@/components/form-interval';
import { ToastItemCreated } from '@/components/toast-item-created';
import { Product } from '@/types/products';
import { User } from '@/types/user';
import { Grid } from '@mui/material';
import { Formik } from 'formik';
import type { ChangeEvent, FC } from 'react';
import { useState } from 'react';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import { PromoCodeFormCode } from '../promo-code-form-code';
import { PromoCodeFormCustomers } from '../promo-code-form-customers';
import { PromoCodeFormValue } from '../promo-code-form-value';
import { PromoCodeSummary } from '../promo-code-summary';
import { useCreatePromoCode } from './api';

export interface PromoCodeFormValues {
  products: Product[];
  startDate: string | null;
  type: 'amount' | 'percentage';
  value: string | number;
  code: string;
  endDate: string | null;
  productSelection: 'general' | 'selected';
  users: User[];
  userSelection: 'general' | 'selected';
}

interface CreatePromoCodeFormProps {
  promoCodeIsRefetching?: boolean;
}

export const CreatePromoCodeForm: FC<CreatePromoCodeFormProps> = (props) => {
  const [shouldSetEndDate, setShouldSetEndDate] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const createPromoCode = useCreatePromoCode();

  const initialValues: PromoCodeFormValues = {
    products: [],
    users: [],
    startDate: null,
    type: 'amount',
    value: '',
    code: '',
    endDate: null,
    productSelection: 'selected',
    userSelection: 'selected',
  };

  const onShouldSetEndDateChange = (event: ChangeEvent<HTMLInputElement>) => {
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
          startDate: Yup.date().required(),
          type: Yup.string().oneOf(['percentage', 'amount']).required(),
          productSelection: Yup.string()
            .oneOf(['general', 'selected'])
            .required(),
          userSelection: Yup.string().oneOf(['general', 'selected']).required(),
          value: Yup.string().required(),
          code: Yup.string().required(),
          products: Yup.array().when('productSelection', {
            is: 'selected',
            then: () => Yup.array().of(Yup.mixed()).min(1).required(),
          }),
          users: Yup.array().when('userSelection', {
            is: 'selected',
            then: () => Yup.array().of(Yup.mixed()).min(1).required(),
          }),
          ...(shouldSetEndDate && { endDate: Yup.date().required() }),
        })}
        onSubmit={(values, { resetForm }) => {
          const formValues: Record<string, any> = { ...values };
          formValues.users =
            values.userSelection === 'selected'
              ? values.users.map((user) => user._id)
              : null;
          formValues.products =
            values.productSelection === 'selected'
              ? values.products.map((product) => product._id)
              : null;
          formValues.endDate = shouldSetEndDate ? values.endDate : null;

          createPromoCode.mutate(formValues, {
            onSuccess: (promoCode) => {
              resetForm();
              toast.success(
                ToastItemCreated('promo code', `/promo-codes/${promoCode._id}`)
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
                <PromoCodeFormCode />
              </Grid>
              <Grid
                item
                xs={12}
              >
                <PromoCodeFormValue />
              </Grid>
              <Grid
                item
                xs={12}
              >
                <PromoCodeFormCustomers />
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
                <PromoCodeSummary
                  {...formik.values}
                  endDate={shouldSetEndDate ? formik.values.endDate : null}
                />
              </Grid>
              <Grid
                item
                xs={12}
              >
                <Button
                  isLoading={createPromoCode.isPending}
                  color="primary"
                  fullWidth
                  size="large"
                  variant="contained"
                  onClick={() => {
                    formik.handleSubmit();
                  }}
                >
                  Create
                </Button>
              </Grid>
            </Grid>
          </>
        )}
      </Formik>
    </Grid>
  );
};
