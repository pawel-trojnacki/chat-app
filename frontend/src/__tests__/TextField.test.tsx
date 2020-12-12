import React from 'react';
import {
  render,
  screen,
  cleanup,
  fireEvent,
  waitFor,
} from '@testing-library/react';

import TextField from '../components/TextField/TextField';
import { TextFieldValidation } from '../components/TextField/validation';

const dummyFunction = async (values: any) => {};
const tooShortValue = 'X';
const tooLongValue = 'XXXXXXXXXXX';

const renderTextField = () => {
  return {
    ...render(
      <TextField
        title="your name"
        label="name"
        handleTextInputSubmit={dummyFunction}
        minLength={3}
        maxLength={10}
        disabledButton={false}
      />
    ),
  };
};

afterEach(cleanup);

describe('TextField', () => {
  test('renders correctly', () => {
    renderTextField();
    expect(screen.getByTestId('text-field')).toBeInTheDocument();
    expect(screen.getByTestId('text-field-title')).toHaveTextContent(
      'your name'
    );
  });

  test('throws error when field is too short', async () => {
    renderTextField();
    fireEvent.change(screen.getByTestId('formik-text-input'), {
      target: { value: tooShortValue },
    });
    fireEvent.click(screen.getByTestId('text-field-button'));
    const nodeText = await waitFor(() =>
      screen.getByText(TextFieldValidation.TooShort)
    );
    expect(nodeText).toBeInTheDocument();
  });

  test('throws error when field is too long', async () => {
    renderTextField();
    fireEvent.change(screen.getByTestId('formik-text-input'), {
      target: { value: tooLongValue },
    });
    fireEvent.click(screen.getByTestId('text-field-button'));
    const nodeText = await waitFor(() =>
      screen.getByText(TextFieldValidation.TooLong)
    );
    expect(nodeText).toBeInTheDocument();
  });
});
