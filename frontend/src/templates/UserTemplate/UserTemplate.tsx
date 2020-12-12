import React, { FC, ReactNode, useEffect, useContext, useState } from 'react';
import { Redirect } from 'react-router-dom';
import openSocket from 'socket.io-client';
import {
  CssBaseline,
  Drawer,
  Hidden,
  Typography,
  Box,
  CircularProgress,
} from '@material-ui/core/';
import { useTheme } from '@material-ui/core/styles';

import AppDrawer from '../../components/Drawer/Drawer';
import NavBar from '../../components/NavBar/NavBar';
import { AuthContext, AuthActionTypes } from '../../context/AuthContext';
import { useAxios } from '../../hooks/useAxios';
import { useStyles } from './styles';

interface UserTemplateProps {
  window?: () => Window;
  children: ReactNode;
}

const UserTemplate: FC<UserTemplateProps> = (props: UserTemplateProps) => {
  const { window } = props;
  const classes = useStyles();
  const theme = useTheme();
  const { state, dispatch } = useContext(AuthContext);
  const [error, isLoading, sendRequest] = useAxios();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userChannels, setUserChannels] = useState<any>(null);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleCloseDrawer = () => {
    setMobileOpen(false);
  };

  const container =
    window !== undefined ? () => window().document.body : undefined;

  const handleLogoutButtonClick = () => {
    dispatch({
      type: AuthActionTypes.Logout,
    });
  };

  useEffect(() => {
    let mounted = true;

    if (mounted) {
      if (state.isAuthenticated) {
        sendRequest(
          `${process.env.REACT_APP_API_URL}/api/user`,
          'get',
          {},
          { Authorization: 'Bearer ' + state.token }
        ).then((response) => {
          if (response && response.user) {
            dispatch({
              type: AuthActionTypes.SetUserData,
              payload: {
                userData: response.user,
              },
            });
          }
        });
      }
    }
    return () => {
      mounted = false;
    };
  }, [sendRequest, state.token, dispatch, state.isAuthenticated]);

  useEffect(() => {
    let mounted = true;

    if (mounted) {
      if (state.isAuthenticated) {
        sendRequest(
          `${process.env.REACT_APP_API_URL}/api/user-channels`,
          'get',
          {},
          { Authorization: 'Bearer ' + state.token }
        ).then((response) => {
          if (response && response.channels) {
            setUserChannels(response.channels);
          }
        });
      }
    }

    return () => {
      mounted = false;
    };
  }, [sendRequest, state.isAuthenticated, state.token]);

  useEffect(() => {
    let mounted = true;

    if (mounted) {
      const socket = openSocket(`${process.env.REACT_APP_API_URL}`);
      socket.on('channel-info', (data: any) => {
        if (data.action === 'join-channel') {
          setUserChannels((prevChannels: []) => [
            ...prevChannels,
            data.channel,
          ]);
        } else if (data.action === 'edit-channel') {
          setUserChannels(data.channels);
        }
      });
    }

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (state.isAuthenticated) {
      const expiration = localStorage.getItem('expiration');
      if (expiration) {
        const expirationDate = new Date(JSON.parse(expiration));
        if (expirationDate < new Date()) {
          dispatch({
            type: AuthActionTypes.Logout,
          });
        }
      }
    }
  }, [state.isAuthenticated, dispatch]);

  if (!state.isAuthenticated) {
    return <Redirect to="/" />;
  }

  return (
    <>
      {(isLoading || error) && (
        <Box
          width="100%"
          height="100vh"
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          {isLoading && <CircularProgress />}
          {error && <Typography variant="h2">{error}</Typography>}
        </Box>
      )}

      {!isLoading && (
        <div className={classes.root} data-testid="user-template">
          <CssBaseline />
          <NavBar
            handleDrawerToggle={handleDrawerToggle}
            handleLogoutButtonClick={handleLogoutButtonClick}
          />
          <nav className={classes.drawer} aria-label="menu">
            <Hidden mdUp implementation="css">
              <Drawer
                container={container}
                variant="temporary"
                anchor={theme.direction === 'rtl' ? 'right' : 'left'}
                open={mobileOpen}
                onClose={handleDrawerToggle}
                classes={{
                  paper: classes.drawerPaper,
                }}
                ModalProps={{
                  keepMounted: true,
                }}
              >
                <div>
                  <div className={classes.toolbar} />
                  <AppDrawer
                    userChannels={userChannels}
                    handleCloseDrawer={handleCloseDrawer}
                  />
                </div>
              </Drawer>
            </Hidden>
            <Hidden smDown implementation="css">
              <Drawer
                classes={{
                  paper: classes.drawerPaper,
                }}
                variant="permanent"
                open
              >
                <div>
                  <div className={classes.toolbar} />
                  <AppDrawer
                    userChannels={userChannels}
                    handleCloseDrawer={handleCloseDrawer}
                  />
                </div>
              </Drawer>
            </Hidden>
          </nav>
          <div className={classes.content}>
            <div className={classes.toolbar} />
            {props.children}
          </div>
        </div>
      )}
    </>
  );
};

export default UserTemplate;
