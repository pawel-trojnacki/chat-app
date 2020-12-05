import React, { FC, useState } from 'react';
import { object, string } from 'yup';

import FormikTextInput from '../FormikTextInput/FormikTextInput';
import FormikSelect from '../FormikSelect/FormikSelect';
import DropzoneField from '../DropzoneField/DropzoneField';
import { FormikStepper, FormikStep } from '../FormikStepper/FormikStepper';
import { categories } from '../../constants/categories';
import { FormikValues } from 'formik';

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

  const formCategories = categories.slice(1);
  return (
    <div>
      <FormikStepper
        initialValues={initialChannelFormValues}
        onSubmit={(values) => handleSubmit(values, file)}
      >
        <FormikStep
          label="Details"
          helperText="Choose a name and category for your channel"
          validationSchema={object().shape({
            name: string()
              .required('Channel name is required')
              .min(3, 'Name should to be at least 3 characters long')
              .max(24, 'Name should be up to 24 characters long'),
          })}
        >
          <FormikTextInput name="name" label="Channel name" disabled={false} />
          <FormikSelect
            name="category"
            label="Category"
            items={formCategories}
          />
        </FormikStep>
        <FormikStep
          label="Image"
          helperText="Upload an image. You can do it later as well"
        >
          <DropzoneField file={file} setFile={setFile} disabledButton={false} />
        </FormikStep>
        <FormikStep
          helperText="Let other users know what your channel is about"
          label="Description"
          validationSchema={object().shape({
            description: string()
              .required('Description is required')
              .min(8, 'Description should be at least 8 characters long')
              .max(100, 'Description should be up to 100 characters long'),
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
    </div>
  );
};

export default ChannelForm;
