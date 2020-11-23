import React, { useRef, useState, FormEvent } from 'react';
import { Formik, Field, Form } from 'formik';
import { TextField } from 'formik-material-ui';
import { Box, Button, CircularProgress } from '@material-ui/core';
import { CloudUpload } from '@material-ui/icons';
import Alert from '@material-ui/lab/Alert';
import { useAxios } from '../../hooks/useAxios';

export interface RegistrationFormValues {
  username: string;
  email: string;
  password: string;
}

const RegistrationForm = () => {
  const [error, isLoading, sendRequest] = useAxios();
  const fileInput = useRef<HTMLInputElement>(null);

  const [avatar, setAvatar] = useState<any>(null);

  const handleChange = (e: FormEvent) => {
    const target = e.target as HTMLInputElement;
    if (target.files && target.files.length === 1) {
      const pickedFile = target.files[0];
      setAvatar(pickedFile);
    }
  };

  const initialValues = {
    username: '',
    email: '',
    password: '',
  };

  const handleClick = () => {
    if (fileInput) {
      if (fileInput.current) {
        fileInput.current.click();
      }
    }
  };

  const handleSubmit = async (values: RegistrationFormValues) => {
    const { username, email, password } = values;
    const formData = new FormData();
    formData.append('username', username);
    formData.append('email', email);
    formData.append('password', password);
    formData.append('avatar', avatar);
    const response = await sendRequest(
      `${process.env.REACT_APP_API_URL}/api/user/signup`,
      'post',
      formData
    );
  };
  return (
    <Box paddingX={{ xs: 5, sm: 20, md: 5, lg: 10, xl: 24 }} paddingTop={7}>
      <Formik
        initialValues={initialValues}
        onSubmit={(values) => {
          handleSubmit(values);
        }}
      >
        <Form autoComplete="off">
          <Box paddingBottom={3}>
            <Field
              name="username"
              type="text"
              component={TextField}
              label="Username"
              disabled={isLoading}
              fullWidth
            />
          </Box>
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
          <Box paddingBottom={1} paddingTop={2}>
            <Button
              startIcon={<CloudUpload />}
              type="button"
              onClick={handleClick}
            >
              Upload avatar
            </Button>
            <input
              type="file"
              accept="image/*"
              id="avatar-input"
              name="avatar"
              onChange={handleChange}
              hidden
              ref={fileInput}
            />
          </Box>
          <Box marginY={3}>
            <Button fullWidth type="submit" variant="contained" color="primary">
              Sign up
            </Button>
          </Box>
        </Form>
      </Formik>
      {isLoading && <CircularProgress />}
      {!!error && <Alert severity="error">{error}</Alert>}
    </Box>
  );
};

export default RegistrationForm;
