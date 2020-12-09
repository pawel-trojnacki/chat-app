import React, { FC } from 'react';
import { Link } from 'react-router-dom';
import { AppBar, Toolbar, IconButton } from '@material-ui/core';
import {
  Menu as MenuIcon,
  AccountCircle as AccountIcon,
  ExitToApp as LogoutIcon,
} from '@material-ui/icons';

import { useStyles } from './styles';
import { Urls } from '../../constants/urls';

interface NavBarProps {
  handleDrawerToggle: () => void;
  handleLogoutButtonClick: () => void;
}

const NavBar: FC<NavBarProps> = ({
  handleDrawerToggle,
  handleLogoutButtonClick,
}) => {
  const classes = useStyles();
  return (
    <AppBar position="fixed" className={classes.root}>
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
      </Toolbar>
      <Toolbar className={classes.iconsWrapper}>
        <Link to={Urls.UserAccount} className={classes.link}>
          <IconButton color="inherit" aria-label="user account">
            <AccountIcon />
          </IconButton>
        </Link>
        <IconButton
          color="inherit"
          aria-label="log out"
          onClick={handleLogoutButtonClick}
        >
          <LogoutIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
