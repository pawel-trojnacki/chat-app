import React, { FC, useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';

import { RouteProps } from '../../routes/routes';
import { AuthContext } from '../../context/AuthContext';

const AppRoute: FC<RouteProps> = ({
  path,
  component: Component,
  isPrivate,
  ...rest
}) => {
  const { state } = useContext(AuthContext);
  return (
    <Route
      path={path}
      render={(props) =>
        isPrivate && !state.isAuthenticated ? (
          <Redirect to="/" />
        ) : (
          <Component {...props} />
        )
      }
      {...rest}
    />
  );
};

export default AppRoute;
