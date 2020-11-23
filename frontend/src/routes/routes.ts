import { truncateSync } from 'fs';
import { FC } from 'react';
import Auth from '../pages/Auth';
import UserPage from '../pages/UserPage';

export interface RouteProps {
  path: string;
  component: FC<any>;
  isPrivate: boolean;
}

export const routes: RouteProps[] = [
  {
    path: '/user',
    component: UserPage,
    isPrivate: true,
  },
  {
    path: '/',
    component: Auth,
    isPrivate: false,
  },
];
