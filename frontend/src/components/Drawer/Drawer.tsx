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
import { Link } from 'react-router-dom';
import { Urls } from '../../constants/urls';
import { useStyles } from './styles';

import { ChannelInfoType } from '../../constants/channel';

interface DrawerProps {
  userChannels: ChannelInfoType[] | null;
  handleCloseDrawer: () => void;
}
const Drawer: FC<DrawerProps> = ({ userChannels, handleCloseDrawer }) => {
  const classes = useStyles();
  return (
    <div>
      <Divider />
      <List>
        <Link
          to={Urls.Explore}
          className={classes.linkElement}
          onClick={handleCloseDrawer}
        >
          <ListItem button>
            <ListItemIcon className={classes.icon}>
              <Explore />
            </ListItemIcon>
            <Typography variant="h5" component="span">
              Explore channels
            </Typography>
          </ListItem>
        </Link>
        <Link
          to={Urls.CreateChannel}
          className={classes.linkElement}
          onClick={handleCloseDrawer}
        >
          <ListItem button className={classes.linkElement}>
            <ListItemIcon className={classes.icon}>
              <AddCircle />
            </ListItemIcon>
            <Typography variant="h5" component="span">
              Create channel
            </Typography>
          </ListItem>
        </Link>
      </List>
      <Divider />
      <Box paddingTop={2}>
        <Typography variant="h4" component="h2" className={classes.subtitle}>
          Your channels
        </Typography>
      </Box>

      {userChannels && userChannels.length > 0 && (
        <List>
          {userChannels.map((channel) => (
            <Link
              key={channel._id}
              to={`/dashboard/channels/${channel._id}`}
              className={classes.linkElement}
              onClick={handleCloseDrawer}
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
    </div>
  );
};

export default Drawer;
