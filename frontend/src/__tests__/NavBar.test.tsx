import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { render, cleanup, screen } from '@testing-library/react';

import NavBar from '../components/NavBar/NavBar';

const dummyFunction = () => {};

afterEach(cleanup);

test('renders NavBar correctly', () => {
  render(
    <Router>
      <NavBar
        handleDrawerToggle={dummyFunction}
        handleLogoutButtonClick={dummyFunction}
      />
    </Router>
  );
  expect(screen.getByTestId('appbar')).toBeInTheDocument();
  expect(screen.getByTestId('menu-toolbar')).toBeInTheDocument();
  expect(screen.getByTestId('links-toolbar')).toBeInTheDocument();
});
