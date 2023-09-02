import { FC, useState } from "react";
import Head from "next/head";
import type { GetServerSideProps } from "next";
import {
  Box,
  Container,
  Step,
  StepLabel,
  Stepper,
  Typography,
} from "@mui/material";
import { PageHeader } from "@/components/page-header";
import { ProductFormGeneral } from "@/components/products/create/product-form-general";
import { ProductFormMedia } from "@/components/products/create/product-form-media";
import { ProductFormMeta } from "@/components/products/create/product-form-meta";
import { ProductFormKeys } from "@/components/products/create/product-form-keys";
import { useCreateProduct } from "@/api/products";
import { appFetch } from "@/utils/app-fetch";
import { dehydrate, QueryClient, useQuery } from "react-query";
import { buildFormData } from "@/utils/build-form-data";
import { toast } from "react-toastify";
import type { Genre } from "@/types/genres";
import type { Publisher } from "@/types/publishers";
import type { Platform } from "@/types/platforms";
import { ToastItemCreated } from "@/components/toast-item-created";
import { ParsedUrlQuery } from "querystring";
import { Developer } from "@/types/developer";
import { Feature } from "@/types/feature";

const steps = ["General", "Media", "Meta", "Keys"];

const ProductCreate: FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [values, setValues] = useState<Record<string, any>>({});

  const createProduct = useCreateProduct();

  const handleBack = (): void => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleNext = (newValues: Record<string, any>): void => {
    setValues((prevValues) => ({
      ...prevValues,
      ...newValues,
    }));
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleSubmit = (newValues: Record<string, any>) => {
    const allValues = {
      ...values,
      ...newValues,
    };
    const formData = buildFormData({
      ...allValues,
      developers: allValues.developers.map(
        (developer: Developer) => developer._id
      ),
      features: allValues.features.map((feature: Feature) => feature._id),
    });

    createProduct.mutate(formData, {
      onSuccess: ({ id }) => {
        toast.success(ToastItemCreated("product", `/products/${id}`));
      },
    });
  };

  return (
    <>
      <Head>
        <title>Create product</title>
      </Head>
      <Box sx={{ py: 3 }}>
        <Container maxWidth="md">
          <PageHeader title="Create Product" />
          <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 5 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          {activeStep === 0 && (
            <ProductFormGeneral product={values} onNext={handleNext} />
          )}
          {activeStep === 1 && (
            <ProductFormMedia
              product={values}
              onBack={handleBack}
              onSubmit={handleNext}
            />
          )}
          {activeStep === 2 && (
            <ProductFormMeta
              product={values}
              onBack={handleBack}
              onNext={handleNext}
            />
          )}
          {activeStep === 3 && (
            <ProductFormKeys
              values={values}
              onBack={handleBack}
              onSubmit={handleSubmit}
              isLoading={createProduct.isLoading}
            />
          )}
        </Container>
      </Box>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  locale,
  req,
  res,
}) => {
  return {
    props: {},
  };
};

export default ProductCreate;
