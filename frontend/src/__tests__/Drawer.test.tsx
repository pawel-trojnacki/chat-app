import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { render, cleanup, screen } from '@testing-library/react';

import Drawer from '../components/Drawer/Drawer';

const dummyChannels = [
  {
    _id: '1',
    admin: 'u1',
    image: 'image-placeholder.jpg',
    members: ['u1', 'u2'],
    name: 'Channel 1',
    description: 'Sample description',
  },
  {
    _id: '2',
    admin: 'u2',
    image: 'image-placeholder.jpg',
    members: ['u1', 'u2'],
    name: 'Channel 2',
    description: 'Sample description',
  },
];

const dummyFunction = () => {};

afterEach(cleanup);

describe('Drawer', () => {
  test('render Drawer with user channels', () => {
    render(
      <Router>
        <Drawer
          userChannels={dummyChannels}
          handleCloseDrawer={dummyFunction}
        />
      </Router>
    );
    expect(screen.getByTestId('action-links')).toBeInTheDocument();
    expect(screen.getByTestId('user-channels')).toBeInTheDocument();
    expect(screen.getByTestId('user-channels')).not.toBeEmptyDOMElement();
  });
});
