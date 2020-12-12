import React, { FC } from 'react';
import { Formik, Form, FormikValues } from 'formik';
import { Button, Box, Typography } from '@material-ui/core';
import { object, string } from 'yup';

import FormikTextInput from '../FormikTextInput/FormikTextInput';
import { TextFieldValidation } from './validation';

export interface TextFieldProps {
  title: string;
  label: string;
  handleTextInputSubmit: (values: any) => Promise<void>;
  minLength: number;
  maxLength: number;
  disabledButton: boolean;
  initialValue?: string;
  buttonText?: string;
  multiline?: boolean;
}

const TextField: FC<TextFieldProps> = ({
  title,
  label,
  handleTextInputSubmit,
  minLength,
  maxLength,
  disabledButton,
  initialValue,
  buttonText,
  multiline,
}) => {
  const { Required, TooShort, TooLong } = TextFieldValidation;
  return (
    <Box data-testid="text-field">
      <Box paddingBottom={3}>
        <Typography variant="h3" component="h2" data-testid="text-field-title">
          {title}
        </Typography>
      </Box>
      <Formik
        initialValues={{ [label]: initialValue || '' }}
        onSubmit={(values) => {
          handleTextInputSubmit(values);
        }}
        validationSchema={object().shape({
          [label]: string()
            .required(Required)
            .min(minLength, TooShort)
            .max(maxLength, TooLong),
        })}
      >
        <Form autoComplete="off">
          <FormikTextInput
            name={label}
            label={label}
            disabled={disabledButton}
            multiline={multiline}
          />
          <Box textAlign="right">
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={disabledButton}
              data-testid="text-field-button"
            >
              {buttonText || 'Save'}
            </Button>
          </Box>
        </Form>
      </Formik>
    </Box>
  );
};

export default TextField;
