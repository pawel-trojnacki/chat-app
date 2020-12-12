import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

import {
  AuthProvider,
  AuthContext,
  AuthActionTypes,
} from '../context/AuthContext';

const response = {
  userId: 'u1',
  token: '1234',
};

describe('AuthContext', () => {
  test('returns isAuthenticated as false by default', () => {
    render(
      <AuthProvider>
        <AuthContext.Consumer>
          {({ state }) => <pre>{JSON.stringify(state.isAuthenticated)}</pre>}
        </AuthContext.Consumer>
      </AuthProvider>
    );

    expect(screen.getByText('false')).toBeInTheDocument();
  });

  test('dispatches log in funcion', () => {
    render(
      <AuthProvider>
        <AuthContext.Consumer>
          {({ state, dispatch }) => (
            <>
              {' '}
              <button
                onClick={() =>
                  dispatch({
                    type: AuthActionTypes.Login,
                    payload: {
                      isAuthenticated: true,
                      user: response.userId,
                      token: response.token,
                    },
                  })
                }
              >
                Log in
              </button>
              <pre>{state.user?.toString()}</pre>
            </>
          )}
        </AuthContext.Consumer>
      </AuthProvider>
    );

    fireEvent.click(screen.getByText('Log in'));

    expect(screen.getByText(response.userId)).toBeInTheDocument();
  });
});
