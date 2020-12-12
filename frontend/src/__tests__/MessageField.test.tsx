import React from 'react';
import { render, cleanup, screen, fireEvent } from '@testing-library/react';
import MessageField from '../components/MessageField/MessageField';

const userId = 'u1';
const message = 'hello there';

const renderMessageField = () => {
  return { ...render(<MessageField id={userId} />) };
};

afterEach(cleanup);

describe('MessageField', () => {
  test('renders MessageField', () => {
    renderMessageField();
    expect(screen.getByTestId('message-field')).toBeInTheDocument();
    expect(screen.getByTestId('message-field-input')).toBeInTheDocument();
  });

  test('changes input value', () => {
    renderMessageField();
    const input = screen.getByTestId('message-field-input');
    fireEvent.change(input, {
      target: { value: message },
    });
    expect(input).toHaveValue(message);
  });
});
