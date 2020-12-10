import React from 'react';
import { render, cleanup, screen } from '@testing-library/react';

import ChannelCard from '../components/ChannelCard/ChannelCard';

afterEach(cleanup);

const dummyChannel = {
  id: '1',
  image: 'image-placeholder.jpg',
  members: ['u1', 'u2'],
  name: 'Dummy channel',
  description: 'Sample description',
  handleJoinButtonClick: () => {},
};

const channelMembersLength = dummyChannel.members.length.toString();

describe('ChannelCard', () => {
  test('render ChannelCard correctly', () => {
    render(<ChannelCard {...dummyChannel} />);
    expect(screen.getByText(dummyChannel.name)).toBeInTheDocument();
    expect(screen.getByText(dummyChannel.description)).toBeInTheDocument();
    expect(screen.getByText(channelMembersLength)).toBeInTheDocument();
    expect(screen.getByAltText(dummyChannel.name)).toBeInTheDocument();
  });
});
