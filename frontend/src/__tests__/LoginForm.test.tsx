import React from 'react';
import {
  render,
  cleanup,
  screen,
  fireEvent,
  waitFor,
} from '@testing-library/react';

import LoginForm from '../components/LoginForm/LoginForm';

afterEach(cleanup);

describe('LoginForm', () => {
  test('renders correctly', () => {
    render(<LoginForm />);
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('Password')).toBeInTheDocument();
    expect(screen.getByText('Log in')).toBeInTheDocument();
  });

  test('renders with registration mode', () => {
    render(<LoginForm registrationForm />);
    expect(screen.getByText('Username')).toBeInTheDocument();
    expect(screen.getByText('Sign in')).toBeInTheDocument();
  });

  test('throws error when email filed is empty', async () => {
    render(<LoginForm />);
    fireEvent.click(screen.getByTestId('login-form-button'));
    const nodeText = await waitFor(() => screen.getByText('Email is required'));
    expect(nodeText).toBeInTheDocument();
  });
});
