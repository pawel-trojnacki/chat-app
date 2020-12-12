import React, { FC, useState } from 'react';
import { object, string } from 'yup';
import { FormikValues } from 'formik';
import { motion } from 'framer-motion';

import FormikTextInput from '../FormikTextInput/FormikTextInput';
import FormikSelect from '../FormikSelect/FormikSelect';
import DropzoneField from '../DropzoneField/DropzoneField';
import { FormikStepper, FormikStep } from '../FormikStepper/FormikStepper';
import { categories } from '../../constants/categories';

import { ChannelFormValidation } from './validation';
import { HelperText } from './helperText';

const initialChannelFormValues = {
  name: '',
  description: '',
  category: 'gaming',
};

export interface ChannelFormProps {
  handleSubmit: (values: FormikValues, file: any) => Promise<void>;
}

const ChannelForm: FC<ChannelFormProps> = ({ handleSubmit }) => {
  const [file, setFile] = useState<any>(null);
  const {
    NameRequired,
    NameTooShort,
    NameTooLong,
    DescRequired,
    DescTooShort,
    DescTooLong,
  } = ChannelFormValidation;

  const formCategories = categories.slice(1);
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <FormikStepper
        initialValues={initialChannelFormValues}
        onSubmit={(values) => handleSubmit(values, file)}
      >
        <FormikStep
          label="Details"
          helperText={HelperText.Details}
          validationSchema={object().shape({
            name: string()
              .required(NameRequired)
              .min(3, NameTooShort)
              .max(24, NameTooLong),
          })}
        >
          <FormikTextInput name="name" label="Channel name" disabled={false} />
          <FormikSelect
            name="category"
            label="Category"
            items={formCategories}
          />
        </FormikStep>
        <FormikStep label="Image" helperText={HelperText.Image}>
          <DropzoneField file={file} setFile={setFile} disabledButton={false} />
        </FormikStep>
        <FormikStep
          helperText={HelperText.Desc}
          label="Description"
          validationSchema={object().shape({
            description: string()
              .required(DescRequired)
              .min(8, DescTooShort)
              .max(100, DescTooLong),
          })}
        >
          <FormikTextInput
            name="description"
            label="Description"
            disabled={false}
            multiline
            rows={3}
          />
        </FormikStep>
      </FormikStepper>
    </motion.div>
  );
};

export default ChannelForm;
