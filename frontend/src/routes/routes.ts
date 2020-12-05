import { FC } from 'react';
import { Urls } from '../constants/urls';
import UserPage from '../pages/UserPage';
import ChannelsPage from '../pages/ChannelsPage';
import ChannelPage from '../pages/ChannelPage';
import CreateChannelPage from '../pages/CreateChannelPage';

export interface RouteProps {
  path: string;
  component: FC<any>;
  isPrivate: boolean;
  exact?: boolean;
}

export const routes: RouteProps[] = [
  {
    path: Urls.Channel,
    component: ChannelPage,
    isPrivate: true,
  },
  {
    path: Urls.Explore,
    component: ChannelsPage,
    isPrivate: true,
  },
  {
    path: Urls.UserAccount,
    component: UserPage,
    isPrivate: true,
  },
  {
    path: Urls.CreateChannel,
    component: CreateChannelPage,
    isPrivate: true,
  },
];
