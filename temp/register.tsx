import { FC, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/navigation";
import type { GetServerSideProps } from "next";
import {
  Box,
  Card,
  Container,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Eye } from "../src/app/icons/eye";
import { Button } from "../src/app/components/button";
import { TextInput } from "../src/app/components/text-input";

const Register: FC = () => {
  const { push } = useRouter();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema: Yup.object({
      username: Yup.string().max(255).required(),
      password: Yup.string().max(255).required(),
    }),
    onSubmit: async (values) => {
      setSubmitError(null);

      try {
        const response = await fetch("/api/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: values.username,
            password: values.username,
          }),
        });

        const data = await response.json();

        if (response.ok) {
          push("/login");
        }

        setSubmitError(data.message);
      } catch (error) { }
    },
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleShowPasswordChange = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <>
      <Head>
        <title>User Auth</title>
      </Head>
      <Box sx={{ width: "100%" }}>
        <Container maxWidth="sm">
          <Card
            sx={{
              mt: 20,
              px: 5,
              py: 3,
            }}
          >
            <Typography color="textPrimary" variant="h4" sx={{ mb: 5 }}>
              Signup
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextInput
                  error={!!formik.touched.username && !!formik.errors.username}
                  fullWidth
                  helperText={formik.touched.username && formik.errors.username}
                  id="username"
                  label="Username"
                  name="username"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.username}
                />
              </Grid>
              <Grid item xs={12}>
                <TextInput
                  error={!!formik.touched.password && !!formik.errors.password}
                  fullWidth
                  helperText={formik.touched.password && formik.errors.password}
                  id="password"
                  type={showPassword ? "text" : "password"}
                  label="Password"
                  name="password"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.password}
                  variant="outlined"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          color="secondary"
                          onClick={handleShowPasswordChange}
                        >
                          <Eye />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  size="large"
                  fullWidth
                  color="primary"
                  variant="contained"
                  onClick={() => formik.handleSubmit()}
                  type="submit"
                  isLoading={formik.isSubmitting}
                >
                  Signup
                </Button>
              </Grid>
            </Grid>
            {!!submitError && (
              <FormHelperText error sx={{ mt: 1 }}>
                {submitError}
              </FormHelperText>
            )}
          </Card>
        </Container>
      </Box>
    </>
  );
};

export default Register;
