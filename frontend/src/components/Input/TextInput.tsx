import React, { FC } from 'react';
import { Formik, Form, Field } from 'formik';
import { TextField } from 'formik-material-ui';
import { Button, Box, Typography } from '@material-ui/core';
import { object, string } from 'yup';

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

const TextInput: FC<TextInputProps> = ({
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
    </Box>
  );
};

export default TextInput;
