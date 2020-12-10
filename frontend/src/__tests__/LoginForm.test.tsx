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
  test('render login form', () => {
    render(<LoginForm />);
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('Password')).toBeInTheDocument();
    expect(screen.getByText('Log in')).toBeInTheDocument();
  });

  test('render login form with registration mode', () => {
    render(<LoginForm registrationForm />);
    expect(screen.getByText('Username')).toBeInTheDocument();
    expect(screen.getByText('Sign in')).toBeInTheDocument();
  });

  test('throw error when email filed is empty', async () => {
    render(<LoginForm />);
    fireEvent.click(screen.getByTestId('login-form-button'));
    const nodeText = await waitFor(() => screen.getByText('Email is required'));
    expect(nodeText).toBeInTheDocument();
  });
});
