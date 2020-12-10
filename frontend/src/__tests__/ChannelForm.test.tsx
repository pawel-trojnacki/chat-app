import React from 'react';
import {
  render,
  cleanup,
  screen,
  fireEvent,
  waitFor,
} from '@testing-library/react';
import { FormikValues } from 'formik';

import ChannelForm from '../components/ChannelForm/ChannelForm';
import { ChannelFormValidation } from '../components/ChannelForm/validation';
import { HelperText } from '../components/ChannelForm/helperText';

const dummyFunction = async (values: FormikValues, file: any) => {};
const tooShortName = 'X';
const correctName = 'Sample channel name';

afterEach(cleanup);

describe('ChannelForm', () => {
  test('render ChannelForm with first step', async () => {
    render(<ChannelForm handleSubmit={dummyFunction} />);
    expect(screen.getByTestId('formik-stepper')).toBeInTheDocument();
    expect(screen.getByTestId('mui-stepper')).toBeInTheDocument();
    expect(screen.getByText(HelperText.Details)).toBeInTheDocument();
  });

  test('throw error when channel name is incorrect', async () => {
    render(<ChannelForm handleSubmit={dummyFunction} />);
    fireEvent.change(screen.getByTestId('formik-text-input'), {
      target: { value: tooShortName },
    });
    fireEvent.click(screen.getByTestId('channel-form-button'));
    const textNode = await waitFor(() =>
      screen.getByText(ChannelFormValidation.NameTooShort)
    );
    expect(textNode).toBeInTheDocument();
  });

  test('render second step when values are correct', async () => {
    render(<ChannelForm handleSubmit={dummyFunction} />);
    fireEvent.change(screen.getByTestId('formik-text-input'), {
      target: { value: correctName },
    });
    fireEvent.click(screen.getByTestId('channel-form-button'));
    const textNode = await waitFor(() => screen.getByText(HelperText.Image));
    expect(textNode).toBeInTheDocument();
  });
});
