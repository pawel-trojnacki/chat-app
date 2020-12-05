import React, { FC, ReactNode } from 'react';
import { Field, FieldInputProps } from 'formik';
import {
  Box,
  MenuItem,
  InputLabel,
  FormControl,
  Select,
} from '@material-ui/core';

interface SelectFieldProps extends FieldInputProps<string> {
  label: string;
  children: ReactNode;
}

interface FormikSelectProps {
  name: string;
  label: string;
  items: ({ name: string; req: null } | { name: string; req: string })[];
}

const SelectField: FC<SelectFieldProps> = ({
  label,
  children,
  value,
  name,
  onChange,
  onBlur,
}) => {
  return (
    <FormControl fullWidth>
      <InputLabel>{label}</InputLabel>
      <Select value={value} name={name} onChange={onChange} onBlur={onBlur}>
        {children}
      </Select>
    </FormControl>
  );
};

const FormikSelect: FC<FormikSelectProps> = ({ name, label, items }) => {
  return (
    <Box paddingBottom={3}>
      <Field name={name} as={SelectField} label={label}>
        {items.map((item) => (
          <MenuItem key={item.name} value={item.name}>
            {item.name}
          </MenuItem>
        ))}
      </Field>
    </Box>
  );
};

export default FormikSelect;
