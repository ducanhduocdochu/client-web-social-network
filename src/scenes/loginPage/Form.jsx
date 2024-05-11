import { useEffect, useState } from "react";
import {
  Box,
  Button,
  TextField,
  useMediaQuery,
  Typography,
  useTheme,
} from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLogin } from "state";
import { showToast } from "utils/showToast";

const registerSchema = yup.object().shape({
  username: yup.string().min(8, "Username must be at least 8 characters").max(24, "Username must be at most 24 characters").required("Username is not empty"),
  email: yup.string().email("Invalid email").required("Email is not empty"),
  password: yup.string().required("Password is not empty").min(8, "Password must be at least 8 characters").matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"),
  confirmPassword: yup.string()
    .oneOf([yup.ref('password'), null], 'Passwords must match')
    .required("ConfirmPassword is not empty"),
});

const loginSchema = yup.object().shape({
  username: yup.string().required("Username is not empty"),
  password: yup.string().required("Password is not empty"),
});

const initialValuesRegister = {
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
};

const initialValuesLogin = {
  username: "",
  password: "",
};

const Form = () => {
  const [pageType, setPageType] = useState("login");
  const { palette } = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const isLogin = pageType === "login";
  const isRegister = pageType === "register";

  const register = async (values, onSubmitProps) => {
    const savedUserResponse = await fetch(
      "http://localhost:3001/v1/api/auth/register",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body:  JSON.stringify(values),
      }
    );
    
    const savedUser = await savedUserResponse.json();
    // onSubmitProps.resetForm();
    console.log(savedUser)

    if (savedUser.metadata) {
      showToast('success', 'SUCCESSFUL', 'Successful register', 3000, dispatch)
      showToast('info', 'Redirector', 'Route to login', 3000, dispatch)
      setTimeout(() =>setPageType("login"), 3000);
    } else {
      showToast('error', 'Register fail', savedUser.message, 3000, dispatch)
    }
  };

  const login = async (values, onSubmitProps) => {
    const loggedInResponse = await fetch("http://localhost:3001/v1/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const loggedIn = await loggedInResponse.json();
   
    if (loggedIn.code == 403){
      showToast('error', 'Login Fail', loggedIn.message, 3000, dispatch)
    }
    else if (loggedIn.metadata.metadata) {
      dispatch(
        setLogin({
          user: loggedIn.metadata.metadata.user,
          token: loggedIn.metadata.metadata.tokens,
        })
      );
      onSubmitProps.resetForm();
      showToast('success', 'SUCCESSFUL', 'Successful login', 3000, dispatch)
      showToast('info', 'Redirector', 'Route to home', 3000, dispatch)
      setTimeout(() =>navigate("/home"), 3000);
    } else {
      showToast('info', 'Info', 'Loading page', 3000, dispatch)
    }
  };

  const handleFormSubmit = async (values, onSubmitProps) => {
    if (isLogin) await login(values, onSubmitProps);
    if (isRegister) await register(values, onSubmitProps);
  };

  useEffect(() => {
    document.title = `${pageType}`;
  }, [pageType]);

  return (
    <Formik
      onSubmit={handleFormSubmit}
      initialValues={isLogin ? initialValuesLogin : initialValuesRegister}
      validationSchema={isLogin ? loginSchema : registerSchema}
    >
      {({
        values,
        errors,
        touched,
        handleBlur,
        handleChange,
        handleSubmit,
        setFieldValue,
        resetForm,
      }) => (
        <form onSubmit={handleSubmit}>
          <Box
            display="grid"
            gap="30px"
            gridTemplateColumns="repeat(4, minmax(0, 1fr))"
            sx={{
              "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
            }}
          >
            {isRegister ? (
              <>
                <TextField
                  label="UserName"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.username}
                  name="username"
                  error={Boolean(touched.username) && Boolean(errors.username)}
                  helperText={touched.username && errors.username}
                  sx={{ gridColumn: "span 4" }}
                />
                <TextField
                  label="Email"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.email}
                  name="email"
                  error={Boolean(touched.email) && Boolean(errors.email)}
                  helperText={touched.email && errors.email}
                  sx={{ gridColumn: "span 4" }}
                />
                <TextField
                  label="Password"
                  type="password"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.password}
                  name="password"
                  error={Boolean(touched.password) && Boolean(errors.password)}
                  helperText={touched.password && errors.password}
                  sx={{ gridColumn: "span 4" }}
                />
                <TextField
                  label="ConfirmPassword"
                  type="password"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.confirmPassword}
                  name="confirmPassword"
                  error={
                    Boolean(touched.confirmPassword) &&
                    Boolean(errors.confirmPassword)
                  }
                  helperText={touched.confirmPassword && errors.confirmPassword}
                  sx={{ gridColumn: "span 4" }}
                />
              </>
            ) : (
              <>
                {" "}
                <TextField
                  label="UserName"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.username}
                  name="username"
                  error={Boolean(touched.username) && Boolean(errors.username)}
                  helperText={touched.username && errors.username}
                  sx={{ gridColumn: "span 4" }}
                />
                <TextField
                  label="Password"
                  type="password"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.password}
                  name="password"
                  error={Boolean(touched.password) && Boolean(errors.password)}
                  helperText={touched.password && errors.password}
                  sx={{ gridColumn: "span 4" }}
                />
              </>
            )}
          </Box>

          {/* BUTTONS */}
          <Box>
            <Button
              fullWidth
              type="submit"
              sx={{
                m: "2rem 0",
                p: "1rem",
                backgroundColor: palette.primary.main,
                color: palette.background.alt,
                "&:hover": { color: palette.primary.main },
              }}
            >
              {isLogin ? "LOGIN" : "REGISTER"}
            </Button>
            <Typography
              onClick={() => {
                setPageType(isLogin ? "register" : "login");
                resetForm();
              }}
              sx={{
                textDecoration: "underline",
                color: palette.primary.main,
                "&:hover": {
                  cursor: "pointer",
                  color: palette.primary.light,
                },
              }}
            >
              {isLogin
                ? "Don't have an account? Sign Up here."
                : "Already have an account? Login here."}
            </Typography>
          </Box>
        </form>
      )}
    </Formik>
  );
};

export default Form;
