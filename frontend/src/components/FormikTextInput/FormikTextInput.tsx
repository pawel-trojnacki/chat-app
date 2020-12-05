import React, { FC } from 'react';
import { Field } from 'formik';
import { TextField } from 'formik-material-ui';
import { Box } from '@material-ui/core';

interface FormikTextInputProps {
  name: string;
  label: string;
  disabled: boolean;
  type?: string;
  multiline?: boolean;
  rows?: number | null;
}

const FormikTextInput: FC<FormikTextInputProps> = ({
  name,
  label,
  disabled,
  type,
  multiline,
  rows,
}) => {
  return (
    <Box paddingBottom={3}>
      <Field
        name={name}
        label={label}
        type={type || 'text'}
        component={TextField}
        disabled={disabled}
        fullWidth
        multiline={multiline}
        rows={rows}
      />
    </Box>
  );
};

export default FormikTextInput;
