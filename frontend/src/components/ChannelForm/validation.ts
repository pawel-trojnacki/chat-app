import { string } from 'yup';

export const validation = {
  name: string()
    .required('Channel name is required')
    .min(3, 'Name should to be at least 3 characters long')
    .max(24, 'Name should be up to 24 characters long'),
  description: string()
    .required('Description is required')
    .min(8, 'Description should be at least 8 characters long')
    .max(100, 'Description should be up to 100 characters long'),
};
