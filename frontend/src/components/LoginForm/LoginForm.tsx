import React, { FC, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { Formik, Form } from 'formik';
import { Box, Button, CircularProgress } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import { object, string } from 'yup';

import { useAxios } from '../../hooks/useAxios';
import { AuthContext, AuthActionTypes } from '../../context/AuthContext';
import { Urls } from '../../constants/urls';
import FormikTextInput from '../FormikTextInput/FormikTextInput';

export interface loginValuesModel {
  username?: string;
  email: string;
  password: string;
}

const LoginForm: FC<{ registrationForm?: boolean }> = ({
  registrationForm,
}) => {
  const [error, isLoading, sendRequest] = useAxios();
  const { dispatch } = useContext(AuthContext);
  const history = useHistory();

  const initialValues = registrationForm
    ? {
        username: '',
        email: '',
        password: '',
      }
    : {
        email: '',
        password: '',
      };

  const handleSubmit = async (values: loginValuesModel) => {
    let response;
    if (registrationForm) {
      const { username, email, password } = values;
      response = await sendRequest(
        `${process.env.REACT_APP_API_URL}/api/user/signup`,
        'post',
        {
          username,
          email,
          password,
        }
      );
    } else {
      const { email, password } = values;
      response = await sendRequest(
        `${process.env.REACT_APP_API_URL}/api/user/login`,
        'post',
        {
          email,
          password,
        }
      );
    }
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

  const validation = registrationForm
    ? {
        username: string()
          .required('Username is required')
          .min(3, 'Username is tog short')
          .max(20, 'Username ist too long'),
        email: string().required('Email is required').email('Invalid email'),
        password: string()
          .required('Password is required')
          .min(6, 'Password has to be at least 6 characters long'),
      }
    : {
        email: string().required('Email is required'),
        password: string().required('Password is required'),
      };

  return (
    <Box
      paddingX={{ xs: 5, sm: 20, md: 5, lg: 10, xl: 24 }}
      paddingTop={7}
      data-testid="login-form"
    >
      <Formik
        initialValues={initialValues}
        onSubmit={(values) => {
          handleSubmit(values);
        }}
        validationSchema={object().shape(validation)}
      >
        <Form autoComplete="off">
          {registrationForm && (
            <FormikTextInput
              name="username"
              label="Username"
              disabled={isLoading}
            />
          )}
          <FormikTextInput name="email" label="Email" disabled={isLoading} />
          <FormikTextInput
            name="password"
            label="Password"
            disabled={isLoading}
            type="password"
          />
          <Box marginY={3}>
            <Button
              fullWidth
              type="submit"
              variant="contained"
              color="primary"
              data-testid="login-form-button"
            >
              {registrationForm ? 'Sign in' : 'Log in'}
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
