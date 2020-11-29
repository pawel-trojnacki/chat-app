import React, { FC, ReactNode, useEffect, useContext, useState } from 'react';
import { Redirect, useHistory, Link } from 'react-router-dom';
import openSocket from 'socket.io-client';
import {
  AppBar,
  CssBaseline,
  Drawer,
  Hidden,
  IconButton,
  Toolbar,
  Typography,
  Box,
  CircularProgress,
} from '@material-ui/core/';
import { Menu as MenuIcon, AccountCircle, ExitToApp } from '@material-ui/icons';
import { useTheme } from '@material-ui/core/styles';

import AppDrawer from '../components/Drawer/Drawer';
import { AuthContext, AuthActionTypes } from '../context/context';
import { useAxios } from '../hooks/useAxios';
import { useStyles } from './styles';
import { Urls } from '../constants/urls';

interface UserTemplateProps {
  window?: () => Window;
  children: ReactNode;
}

const UserTemplate: FC<UserTemplateProps> = (props: UserTemplateProps) => {
  const history = useHistory();
  const { window } = props;
  const classes = useStyles();
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [pageTitle, setPageTitle] = useState<string>('Dashboard');
  const [userChannels, setUserChannels] = useState<any>(null);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const container =
    window !== undefined ? () => window().document.body : undefined;

  const { state, dispatch } = useContext(AuthContext);
  const [error, isLoading, sendRequest] = useAxios();

  const handleLogoutButtonClick = () => {
    dispatch({
      type: AuthActionTypes.Logout,
    });
  };

  useEffect(() => {
    return history.listen((location) => {
      switch (location.pathname as any) {
        case Urls.Explore:
          setPageTitle('Explore');
          break;
        case Urls.UserAccount:
          setPageTitle('Account');
          break;
        // case Urls.Explore + '/5fbc1867dc33cf0321cbcc6a':
        //   setPageTitle('Channel');
        //   break;
        default:
          setPageTitle('Dashboard');
          break;
      }
    });
  }, [history, pageTitle]);

  useEffect(() => {
    let mounted = true;

    if (state.isAuthenticated) {
      sendRequest(
        `${process.env.REACT_APP_API_URL}/api/user`,
        'get',
        {},
        { Authorization: 'Bearer ' + state.token }
      )
        .then((response) => {
          if (response && response.user) {
            dispatch({
              type: AuthActionTypes.SetUserData,
              payload: {
                userData: response.user,
              },
            });
            setUserChannels(response.user.channels);
          }
        })
        .then(() => {
          const socket = openSocket(`${process.env.REACT_APP_API_URL}`);
          socket.on('channel-info', (data: any) => {
            if (data.action === 'join-channel') {
              setUserChannels((prevChannels: []) => [
                ...prevChannels,
                { channel: { name: data.channel.name, id: data.channel._id } },
              ]);
              console.log(data);
            }
          });
        });
    }
    return () => {
      mounted = false;
    };
  }, [sendRequest, state.token, dispatch, state.isAuthenticated]);

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
        <div className={classes.root}>
          <CssBaseline />
          <AppBar position="fixed" className={classes.appBar}>
            <Toolbar>
              <IconButton
                color="inherit"
                aria-label="open menu"
                edge="start"
                onClick={handleDrawerToggle}
                className={classes.menuButton}
              >
                <MenuIcon />
              </IconButton>
              <Typography variant="h2" component="h1" noWrap>
                {pageTitle}
              </Typography>
            </Toolbar>
            <Toolbar className={classes.iconsWrapper}>
              <Link to={Urls.UserAccount} className={classes.link}>
                <IconButton color="inherit" aria-label="user account">
                  <AccountCircle />
                </IconButton>
              </Link>
              <IconButton
                color="inherit"
                aria-label="log out"
                onClick={handleLogoutButtonClick}
              >
                <ExitToApp />
              </IconButton>
            </Toolbar>
          </AppBar>
          <nav className={classes.drawer} aria-label="mailbox folders">
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
                  <AppDrawer userChannels={userChannels} />
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
                  <AppDrawer userChannels={userChannels} />
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
