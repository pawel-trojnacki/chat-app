import React, { FC, useState, useEffect } from 'react';
import { Formik, Form, Field } from 'formik';
import { TextField } from 'formik-material-ui';
import { Button, Snackbar, Box, Typography } from '@material-ui/core';
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';
import { object, string } from 'yup';

export interface TextInputProps {
  title: string;
  label: string;
  handleTextInputSubmit: (values: any) => void;
  minLength: number;
  maxLength: number;
  disabledButton: boolean;
  error: string | null;
  success: boolean;
  successMessage: string;
  initialValue?: string;
  buttonText?: string;
}

const Alert = (props: AlertProps) => {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
};

const TextInput: FC<TextInputProps> = ({
  title,
  label,
  handleTextInputSubmit,
  minLength,
  maxLength,
  disabledButton,
  error,
  success,
  successMessage,
  initialValue,
  buttonText,
}) => {
  const [successOpen, setSuccessOpen] = useState(success);
  const [errorOpen, setErrorOpen] = useState(!!error);

  useEffect(() => {
    setErrorOpen(!!error);
  }, [error]);

  useEffect(() => {
    setSuccessOpen(success);
  }, [success]);

  const handleCloseError = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setErrorOpen(false);
  };

  const handleCloseSuccess = (
    event?: React.SyntheticEvent,
    reason?: string
  ) => {
    if (reason === 'clickaway') {
      return;
    }

    setSuccessOpen(false);
  };

  return (
    <Box
      marginY={5}
      marginRight={{ xs: 0, sm: '30%', md: '45%', lg: '50%' }}
      marginLeft={{ xs: 0, sm: '5%' }}
    >
      <Box paddingBottom={3}>
        <Typography variant="h3" component="h2">
          {title}
        </Typography>
      </Box>
      <Formik
        initialValues={{ [label]: initialValue }}
        onSubmit={(values) => {
          handleTextInputSubmit(values);
        }}
        validationSchema={object().shape({
          [label]: string()
            .required('Field is required')
            .min(minLength, 'Field is too short')
            .max(maxLength, 'Field is too long'),
        })}
      >
        <Form autoComplete="off">
          <Box paddingBottom={3}>
            <Field
              name={label}
              label={label}
              type="text"
              component={TextField}
              disabled={disabledButton}
              fullWidth
            />
          </Box>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={disabledButton}
          >
            {buttonText || 'Save'}
          </Button>
        </Form>
      </Formik>
      <Snackbar
        open={successOpen}
        autoHideDuration={5000}
        onClose={handleCloseSuccess}
      >
        <Alert onClose={handleCloseSuccess} severity="success">
          {successMessage}
        </Alert>
      </Snackbar>

      <Snackbar
        open={errorOpen}
        autoHideDuration={5000}
        onClose={handleCloseError}
      >
        <Alert onClose={handleCloseError} severity="error">
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default TextInput;
