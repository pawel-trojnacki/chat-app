import React from 'react';
import { render, screen, cleanup, waitFor } from '@testing-library/react';

import Snackbar from '../components/Snackbar/Snackbar';

afterEach(cleanup);

const errorMessage = 'Something went wrong';
const successMessage = 'Done';

describe('Snackbar', () => {
  test('renders with success message', async () => {
    render(
      <Snackbar
        error={null}
        isSuccess={true}
        isError={false}
        message={successMessage}
      />
    );
    const successText = await waitFor(() => screen.getByText(successMessage));
    expect(successText).toBeInTheDocument();
  });
  test('renders with error', async () => {
    render(
      <Snackbar
        error={errorMessage}
        isSuccess={false}
        isError={true}
        message={successMessage}
      />
    );
    const errorText = await waitFor(() => screen.getByText(errorMessage));
    expect(errorText).toBeInTheDocument();
  });
});
