import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import { TextField } from 'formik-material-ui';
import { Box, Button, CircularProgress } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import { object, string } from 'yup';

import { useAxios } from '../../hooks/useAxios';
import { AuthContext, AuthActionTypes } from '../../context/context';
import { Urls } from '../../constants/urls';

export interface loginValuesModel {
  email: string;
  password: string;
}

const LoginForm = () => {
  const [error, isLoading, sendRequest] = useAxios();
  const { dispatch } = useContext(AuthContext);
  const history = useHistory();

  const initialValues = {
    email: '',
    password: '',
  };

  const handleSubmit = async (values: loginValuesModel) => {
    const { email, password } = values;
    const response = await sendRequest(
      `${process.env.REACT_APP_API_URL}/api/user/login`,
      'post',
      {
        email,
        password,
      }
    );
    if (response) {
      if (response.userId && response.token) {
        dispatch({
          type: AuthActionTypes.Login,
          payload: {
            isAuthenticated: true,
            user: response.userId,
            token: response.token,
          },
        });
        history.push(Urls.Explore);
      }
    }
  };

  return (
    <Box paddingX={{ xs: 5, sm: 20, md: 5, lg: 10, xl: 24 }} paddingTop={7}>
      <Formik
        initialValues={initialValues}
        onSubmit={(values) => {
          handleSubmit(values);
        }}
        validationSchema={object().shape({
          email: string().required('Email is required'),
          password: string().required('Password is required'),
        })}
      >
        <Form autoComplete="off">
          <Box paddingBottom={3}>
            <Field
              name="email"
              type="text"
              component={TextField}
              label="Email"
              disabled={isLoading}
              fullWidth
            />
          </Box>
          <Box paddingBottom={3}>
            <Field
              name="password"
              type="password"
              component={TextField}
              label="Password"
              disabled={isLoading}
              fullWidth
            />
          </Box>
          <Box marginY={3}>
            <Button fullWidth type="submit" variant="contained" color="primary">
              Log in
            </Button>
          </Box>
        </Form>
      </Formik>
      {isLoading && <CircularProgress />}
      {!!error && <Alert severity="error">{error}</Alert>}
    </Box>
  );
};

export default LoginForm;
