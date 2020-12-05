import React, { FC } from 'react';
import { Formik, Form } from 'formik';
import { Button, Box, Typography } from '@material-ui/core';
import { object, string } from 'yup';

import FormikTextInput from '../FormikTextInput/FormikTextInput';

export interface TextInputProps {
  title: string;
  label: string;
  handleTextInputSubmit: (values: any) => void;
  minLength: number;
  maxLength: number;
  disabledButton: boolean;
  initialValue?: string;
  buttonText?: string;
}

const TextField: FC<TextInputProps> = ({
  title,
  label,
  handleTextInputSubmit,
  minLength,
  maxLength,
  disabledButton,
  initialValue,
  buttonText,
}) => {
  return (
    <Box>
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
          <FormikTextInput
            name={label}
            label={label}
            disabled={disabledButton}
          />
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
    </Box>
  );
};

export default TextField;
