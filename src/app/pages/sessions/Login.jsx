import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Card,
  Checkbox,
  Snackbar,
  Alert,
  Grid,
  TextField,
  Box,
  styled,
  useTheme
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { Formik } from "formik";
import * as Yup from "yup";

import useStore from "../../hooks/useStore";
import { H1, Paragraph } from "../../components/Typography";
import { observer } from "mobx-react-lite";
import withAlert from "../../../hoc/withAlert";
import { authRoles } from "../../auth/authRoles";

// STYLED COMPONENTS
const FlexBox = styled(Box)(() => ({
  display: "flex"
}));

const ContentBox = styled("div")(() => ({
  height: "100%",
  padding: "20px",
  position: "relative",
  background: "rgba(0, 0, 0, 0.01)"
}));

const StyledRoot = styled("div")(() => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "#1A2038",
  minHeight: "100% !important",
  "& .card": {
    maxWidth: 800,
    minHeight: 400,
    margin: "1rem",
    display: "flex",
    borderRadius: 12,
    alignItems: "center"
  },

  ".img-wrapper": {
    height: "100%",
    minWidth: 320,
    display: "flex",
    padding: "2rem",
    alignItems: "center",
    justifyContent: "center"
  }
}));

// initial login credentials
const initialValues = {
  email: "",
  password: "",
  remember: true
};

// form field validation schema
const validationSchema = Yup.object().shape({
  password: Yup.string()
    .min(6, "Password must be 6 character length")
    .required("Password is required!"),
  email: Yup.string().email("Invalid Email address").required("Email is required!")
});

function JwtLogin({ alertError, alertSuccess }) {
  const theme = useTheme();
  const navigate = useNavigate();
  const authStore = useStore();
  const { isSubmitting } = authStore;

  const handleFormSubmit = async (values) => {
    await authStore.login(values.email, values.password);
    if (authStore.error) {
      alertError(authStore.error);
      return;
    }
    if (authStore.isAuthenticated) {
      alertSuccess("Logged in successfully");
      setTimeout(() => {
        authStore.user.role==authRoles.admin?
        navigate("/dashboard"):
        navigate("/shop")
      }, 1000);
    }
  };

  return (
    <StyledRoot>
      <Card className="card">
        <Grid container>
          <Grid item sm={6} xs={12}>
            <div className="img-wrapper">
              <img src="./src/assets/logo_box.png" width={"60%"} style={{ scale: "1.2" }} alt="" />
            </div>
          </Grid>

          <Grid item sm={6} xs={12}>
            <H1 mt={4} textAlign={"center"}>
              Login
            </H1>
            <ContentBox>
              <Formik
                onSubmit={handleFormSubmit}
                initialValues={initialValues}
                validationSchema={validationSchema}
              >
                {({ values, errors, touched, handleChange, handleBlur, handleSubmit }) => (
                  <form onSubmit={handleSubmit} style={{ marginRight: "20px" }}>
                    <TextField
                      fullWidth
                      size="small"
                      type="email"
                      name="email"
                      label="Email"
                      variant="outlined"
                      onBlur={handleBlur}
                      value={values.email}
                      onChange={handleChange}
                      helperText={touched.email && errors.email}
                      error={Boolean(errors.email && touched.email)}
                      sx={{ mb: 3 }}
                    />

                    <TextField
                      fullWidth
                      size="small"
                      name="password"
                      type="password"
                      label="Password"
                      variant="outlined"
                      onBlur={handleBlur}
                      value={values.password}
                      onChange={handleChange}
                      helperText={touched.password && errors.password}
                      error={Boolean(errors.password && touched.password)}
                      sx={{ mb: 1.5 }}
                    />

                    <FlexBox justifyContent="space-between">
                      <FlexBox gap={1}>
                        <Checkbox
                          size="small"
                          name="remember"
                          onChange={handleChange}
                          checked={values.remember}
                          sx={{ padding: 0 }}
                        />

                        <Paragraph>Remember Me</Paragraph>
                      </FlexBox>

                      <NavLink
                        to="/session/forgot-password"
                        style={{ color: theme.palette.primary.main }}
                      >
                        Forgot password?
                      </NavLink>
                    </FlexBox>

                    <LoadingButton
                      type="submit"
                      color="primary"
                      loading={isSubmitting}
                      variant="contained"
                      style={{ width: "100%", backgroundColor: "orangered" }}
                      sx={{ my: 2 }}
                    >
                      Login
                    </LoadingButton>

                    <Paragraph>
                      New to site ?{" "}
                      <NavLink
                        to="/register"
                        style={{ color: theme.palette.primary.main, marginLeft: 5 }}
                      >
                        Register Here
                      </NavLink>
                    </Paragraph>
                  </form>
                )}
              </Formik>
            </ContentBox>
          </Grid>
        </Grid>
      </Card>
    </StyledRoot>
  );
}

export default withAlert(observer(JwtLogin));
