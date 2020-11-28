import React, { FC } from 'react';
import {
  Divider,
  List,
  ListItem,
  ListItemIcon,
  Typography,
  Box,
} from '@material-ui/core';
import { AddCircle, Explore } from '@material-ui/icons';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';

import { Urls } from '../../constants/urls';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    linkElement: {
      textTransform: 'none',
      textDecoration: 'none',
      color: theme.palette.text.primary,
      display: 'flex',
      alignItems: 'center',
    },
    icon: {
      color: theme.palette.text.primary,
    },
    subtitle: {
      textAlign: 'center',
      margin: '20px auto',
    },
    channelTitle: {
      textAlign: 'center',
      width: '100%',
    },
  })
);

const Drawer: FC<{
  userChannels: [{ id: string; channel: { name: string } }] | null;
}> = ({ userChannels }) => {
  const classes = useStyles();
  return (
    <div>
      <Divider />
      <List>
        <ListItem button>
          <Link to={Urls.Explore} className={classes.linkElement}>
            <ListItemIcon className={classes.icon}>
              <Explore />
            </ListItemIcon>
            <Typography variant="h5" component="span">
              Explore channels
            </Typography>
          </Link>
        </ListItem>
        <ListItem button className={classes.linkElement}>
          <Link to="/dashboard/channels" className={classes.linkElement}>
            <ListItemIcon className={classes.icon}>
              <AddCircle />
            </ListItemIcon>
            <Typography variant="h5" component="span">
              Create channel
            </Typography>
          </Link>
        </ListItem>
      </List>
      <Divider />
      <Box paddingTop={2}>
        <Typography variant="h4" component="h2" className={classes.subtitle}>
          Your channels
        </Typography>
      </Box>

      {userChannels && userChannels.length > 0 && (
        <List>
          {userChannels.map(({ id, channel }: { id: string; channel: any }) => (
            <Link
              key={id}
              to={`/dashboard/channels/${id}`}
              className={classes.linkElement}
            >
              <ListItem button>
                <Typography
                  variant="h5"
                  component="p"
                  className={classes.channelTitle}
                >
                  {channel.name}
                </Typography>
              </ListItem>
            </Link>
          ))}
        </List>
      )}

      {/* {state.userData &&
        state.userData.channels &&
        state.userData.channels.length > 0 && (
          <List>
            {state.userData.channels.map(
              ({ id, channel }: { id: string; channel: any }) => (
                <Link
                  key={id}
                  to={`/dashboard/channels/${id}`}
                  className={classes.linkElement}
                >
                  <ListItem button>
                    <Typography
                      variant="h5"
                      component="p"
                      className={classes.channelTitle}
                    >
                      {channel.name}
                    </Typography>
                  </ListItem>
                </Link>
              )
            )}
          </List>
        )} */}
    </div>
  );
};

export default Drawer;
