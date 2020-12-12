import React, { FC, ReactNode, useReducer } from 'react';
import { MemoryRouter, Switch } from 'react-router-dom';
import { render, screen, cleanup } from '@testing-library/react';

import AppRoute from '../components/AppRoute/AppRoute';
import { AuthContext, AuthReducer } from '../context/AuthContext';

const publicComponent: FC = () => <div>Public</div>;
const privateComponent: FC = () => <div>Private</div>;

const AppRouter = () => (
  <Switch>
    <AppRoute path="/private" component={privateComponent} isPrivate={true} />
    <AppRoute path="/" component={publicComponent} isPrivate={false} />
  </Switch>
);

const dummyState = {
  user: 'u1',
  isAuthenticated: true,
  userData: '',
};

interface DummyProviderProps {
  children: ReactNode;
}

const DummyProvider: FC<DummyProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(AuthReducer, dummyState);
  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};

afterEach(cleanup);

describe('AppRoute', () => {
  test('redirects to public path and render only public component when is not authenticated', () => {
    render(
      <MemoryRouter initialEntries={['/private']}>
        <AppRouter />
      </MemoryRouter>
    );
    expect(screen.getByText('Public')).toBeInTheDocument();
  });

  test('displays private component when is authenticated', () => {
    render(
      <MemoryRouter initialEntries={['/private']}>
        <DummyProvider>
          <AppRouter />
        </DummyProvider>
      </MemoryRouter>
    );
    expect(screen.getByText('Private')).toBeInTheDocument();
  });
});
