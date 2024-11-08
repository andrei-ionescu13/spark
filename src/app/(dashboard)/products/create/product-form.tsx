'use client';
import { ToastItemCreated } from '@/components/toast-item-created';
import { Developer } from '@/types/developer';
import { Feature } from '@/types/feature';
import { buildFormData } from '@/utils/build-form-data';
import { Step, StepLabel, Stepper } from '@mui/material';
import { ProductFormGeneral } from 'app/(dashboard)/products/create/product-form-general';
import { ProductFormKeys } from 'app/(dashboard)/products/create/product-form-keys';
import { ProductFormMedia } from 'app/(dashboard)/products/create/product-form-media';
import { ProductFormMeta } from 'app/(dashboard)/products/create/product-form-meta';
import { useState, type FC } from 'react';
import { toast } from 'react-toastify';
import { useCreateProduct } from './api';

interface ProductFormProps {}

const steps = ['General', 'Media', 'Meta', 'Keys'];

export const ProductForm: FC<ProductFormProps> = () => {
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
        toast.success(ToastItemCreated('product', `/products/${id}`));
      },
    });
  };

  return (
    <div>
      <Stepper
        activeStep={activeStep}
        alternativeLabel
        sx={{ mb: 5 }}
      >
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      {activeStep === 0 && (
        <ProductFormGeneral
          product={values}
          onNext={handleNext}
        />
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
          isLoading={createProduct.isPending}
        />
      )}
    </div>
  );
};
