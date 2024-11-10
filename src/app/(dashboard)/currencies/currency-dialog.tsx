import { Button } from '@/components/button';
import { TextInput } from '@/components/text-input';
import {
  Autocomplete,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
} from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { useFormik } from 'formik';
import type { FC, SyntheticEvent } from 'react';
import * as Yup from 'yup';
import { useCreateCurrency } from './api';
import currencyOptions from './currencies.json';

type CurrencyOptionKey = keyof typeof currencyOptions;

const currencyOptionKeys = Object.keys(currencyOptions);
const isCurrencyOptionKey = (x: any): x is CurrencyOptionKey =>
  currencyOptionKeys.includes(x);

interface CurrencyDialogProps {
  open: boolean;
  onClose: any;
}

export const CurrencyDialog: FC<CurrencyDialogProps> = (props) => {
  const { open, onClose } = props;
  const queryClient = useQueryClient();
  const createCurrency = useCreateCurrency(() =>
    queryClient.invalidateQueries({ queryKey: ['currencies'] })
  );
  const formik = useFormik({
    initialValues: {
      code: '',
      name: '',
      symbol: '',
    },
    validationSchema: Yup.object({
      code: Yup.string().required('Required'),
      name: Yup.string().required('Required'),
      symbol: Yup.string().required('Required'),
    }),
    onSubmit: (values) => {
      createCurrency.mutate(values, {
        onSuccess: () => {
          onClose();
        },
      });
    },
  });

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>Add currency</DialogTitle>
      <DialogContent sx={{ py: '24px !important' }}>
        <Grid
          container
          spacing={2}
        >
          <Grid
            item
            xs={12}
          >
            <Autocomplete
              autoHighlight
              value={formik.values.code}
              filterSelectedOptions
              id="code"
              onChange={(event: SyntheticEvent, newValue: string | null) => {
                if (!isCurrencyOptionKey(newValue)) return;

                const selectedCurrency = currencyOptions[newValue];
                const { code, name, symbol } = selectedCurrency;
                formik.setValues({ code, name, symbol });
              }}
              getOptionLabel={(option: string) => {
                if (!isCurrencyOptionKey(option)) return '';

                return currencyOptions?.[option]?.name;
              }}
              options={currencyOptionKeys}
              renderInput={(params) => (
                <TextInput
                  {...params}
                  size="small"
                  label="Currency"
                  name="code"
                  onBlur={formik.handleBlur}
                  error={!!formik.touched.code && !!formik.errors.code}
                  helperText={formik.touched.code && formik.errors.code}
                />
              )}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button
          variant="text"
          color="secondary"
          onClick={onClose}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() => formik.handleSubmit()}
          isLoading={createCurrency.isPending}
        >
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
};
