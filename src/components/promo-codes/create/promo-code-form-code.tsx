import type { FC } from "react";
import { Box, Card, Grid, Typography } from "@mui/material";
import { useFormikContext } from "formik";
import { Button } from "@/components/button";
import type { PromoCodeFormValues } from "./promo-code-form";
import { TextInput } from "@/components/text-input";

export const PromoCodeFormCode: FC = () => {
  const formik = useFormikContext<PromoCodeFormValues>();

  return (
    <Card sx={{ p: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography color="textPrimary" variant="subtitle1">
              Discount code
            </Typography>
            <Button
              color="secondary"
              variant="text"
              onClick={() => {
                formik.setFieldValue(
                  "code",
                  Math.random().toString(36).slice(2).toUpperCase()
                );
              }}
            >
              Generate
            </Button>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <TextInput
            error={!!formik.touched.code && !!formik.errors.code}
            helperText={formik.touched.code && formik.errors.code}
            fullWidth
            id="code"
            label="Code"
            name="code"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            value={formik.values.code}
          />
        </Grid>
      </Grid>
    </Card>
  );
};
