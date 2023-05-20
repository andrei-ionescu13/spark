import type { ChangeEvent, FC } from "react";
import {
  Card,
  Checkbox,
  FormControlLabel,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";

interface FormIntervalProps {
  formik: any;
  shouldSetEndDate: boolean;
  onShouldSetEndDateChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

export const FormInterval: FC<FormIntervalProps> = (props) => {
  const { formik, shouldSetEndDate, onShouldSetEndDateChange } = props;

  return (
    <Card sx={{ p: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography color="textPrimary" variant="subtitle1">
            Active dates
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <DateTimePicker
            sx={{ width: "100%" }}
            disablePast
            label="Start date"
            value={
              formik.values.startDate ? new Date(formik.values.startDate) : null
            }
            onChange={(newValue: Date | null) => {
              formik.setFieldValue("startDate", newValue);
            }}
            slotProps={{
              textField: {
                helperText: formik.touched.startDate && formik.errors.startDate,
              },
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Checkbox
                checked={shouldSetEndDate}
                onChange={onShouldSetEndDateChange}
              />
            }
            label="Set end date"
          />
        </Grid>
        {shouldSetEndDate && (
          <Grid item xs={12}>
            <DateTimePicker
              sx={{ width: "100%" }}
              disablePast
              label="End date"
              value={
                formik.values.endDate ? new Date(formik.values.endDate) : null
              }
              onChange={(newValue: Date | null) => {
                formik.setFieldValue("endDate", newValue);
              }}
              slotProps={{
                textField: {
                  helperText: formik.touched.endDate && formik.errors.endDate,
                },
              }}
            />
          </Grid>
        )}
      </Grid>
    </Card>
  );
};
