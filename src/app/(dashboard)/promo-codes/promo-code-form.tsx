import { useEffect, useState } from "react";
import type { ChangeEvent, FC } from "react";
import { Box, Grid, Typography } from "@mui/material";
import { Formik } from "formik";
import * as Yup from "yup";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { PromoCodeFormCode } from "./promo-code-form-code";
import { PromoCodeFormValue } from "./promo-code-form-value";
import { PromoCodeFormCustomers } from "./promo-code-form-customers";
import { PromoCodeSummary } from "./promo-code-summary";
import { useCreatePromoCode, useUpdatePromoCode } from "@/api/promo-codes";
import Link from "@/components/link";
import { Button } from "@/components/button";
import { FormInterval } from "@/components/form-interval";
import { ToastItemCreated } from "@/components/toast-item-created";
import { Product } from "@/types/products";
import { PromoCode } from "@/types/promo-code";
import { User } from "@/types/user";

const ToastSuccess = (id: string) => (
  <Box>
    <Typography variant="body1" color="textPrimary">
      Discount created
    </Typography>
    <Link
      color="textPrimary"
      href={`/promo-codes/${id}`}
      underline="hover"
      variant="body1"
    >
      Go to the created discount
    </Link>
  </Box>
);

export interface PromoCodeFormValues {
  products: Product[];
  startDate: string | null;
  type: "amount" | "percentage";
  value: string | number;
  code: string;
  endDate: string | null;
  productSelection: "general" | "selected";
  users: User[];
  userSelection: "general" | "selected";
}

interface PromoCodeFormProps {
  promoCode?: PromoCode;
  mode: "create" | "update";
  promoCodeIsRefetching?: boolean;
}

export const PromoCodeForm: FC<PromoCodeFormProps> = (props) => {
  const { promoCode, mode } = props;
  const queryClient = useQueryClient();
  const [shouldSetEndDate, setShouldSetEndDate] = useState(
    !!promoCode?.endDate
  );
  const [submitError, setSubmitError] = useState<string | null>(null);
  const createPromoCode = useCreatePromoCode();
  const updatePromoCode = useUpdatePromoCode(() =>
    queryClient.invalidateQueries({ queryKey: ["promo-code", promoCode?._id] })
  );
  const initialValues: PromoCodeFormValues = {
    products: promoCode?.products || [],
    users: promoCode?.users || [],
    startDate: promoCode?.startDate || null,
    type: promoCode?.type || "amount",
    value: promoCode?.value || "",
    code: promoCode?.code || "",
    endDate: promoCode?.endDate || null,
    productSelection: promoCode?.productSelection || "selected",
    userSelection: promoCode?.userSelection || "selected",
  };

  const onShouldSetEndDateChange = (
    event: ChangeEvent<HTMLInputElement>
  ): void => {
    setShouldSetEndDate(event.target.checked);
  };

  useEffect(() => {
    setShouldSetEndDate(!!promoCode?.endDate);
  }, [promoCode?.endDate]);

  const isPending = createPromoCode.isPending || updatePromoCode.isPending;

  return (
    <Grid container spacing={3}>
      <Formik
        initialValues={initialValues}
        validationSchema={Yup.object({
          startDate: Yup.date().required(),
          type: Yup.string().oneOf(["percentage", "amount"]).required(),
          productSelection: Yup.string()
            .oneOf(["general", "selected"])
            .required(),
          userSelection: Yup.string().oneOf(["general", "selected"]).required(),
          value: Yup.string().required(),
          code: Yup.string().required(),
          products: Yup.array().when("productSelection", {
            is: "selected",
            then: () => Yup.array().of(Yup.mixed()).min(1).required(),
          }),
          users: Yup.array().when("userSelection", {
            is: "selected",
            then: () => Yup.array().of(Yup.mixed()).min(1).required(),
          }),
          ...(shouldSetEndDate && { endDate: Yup.date().required() }),
        })}
        onSubmit={(values, { resetForm }) => {
          const formValues: Record<string, any> = { ...values };
          formValues.users =
            values.userSelection === "selected"
              ? values.users.map((user) => user._id)
              : null;
          formValues.products =
            values.productSelection === "selected"
              ? values.products.map((product) => product._id)
              : null;
          formValues.endDate = shouldSetEndDate ? values.endDate : null;

          if (mode === "create") {
            createPromoCode.mutate(formValues, {
              onSuccess: (promoCode) => {
                resetForm();
                toast.success(
                  ToastItemCreated(
                    "promo code",
                    `/promo-codes/${promoCode._id}`
                  )
                );
              },
              onError: (error) => {
                setSubmitError(error.message);
              },
            });
            return;
          }

          if (promoCode) {
            updatePromoCode.mutate(
              { id: promoCode._id, body: formValues },
              {
                onSuccess: async (data) => { },
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
                <PromoCodeFormCode />
              </Grid>
              <Grid item xs={12}>
                <PromoCodeFormValue />
              </Grid>
              <Grid item xs={12}>
                <PromoCodeFormCustomers />
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
                <PromoCodeSummary
                  {...formik.values}
                  endDate={shouldSetEndDate ? formik.values.endDate : null}
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  isLoading={isPending}
                  color="primary"
                  fullWidth
                  size="large"
                  variant="contained"
                  onClick={() => {
                    formik.handleSubmit();
                  }}
                >
                  {mode === "create" ? "Create" : "Update"}
                </Button>
              </Grid>
            </Grid>
          </>
        )}
      </Formik>
    </Grid>
  );
};
