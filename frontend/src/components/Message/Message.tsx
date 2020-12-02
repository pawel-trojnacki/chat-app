import React, { FC } from 'react';
import {
  ListItem,
  ListItemText,
  Box,
  Grid,
  Typography,
  Avatar,
} from '@material-ui/core';

import { useStyles } from './styles';

export interface MessageProps {
  id: string;
  createdAt: Date;
  content: string;
  creator: {
    id: string;
    username: string;
    avatar: string;
  };
}

const Message: FC<MessageProps> = ({ id, createdAt, content, creator }) => {
  const classes = useStyles();
  return (
    <ListItem className={classes.root}>
      <Grid container className={classes.rootGrid} spacing={2}>
        <Grid item>
          <Avatar
            src={`${process.env.REACT_APP_API_URL}/uploads/images/${creator.avatar}`}
          />
        </Grid>
        <Grid item>
          <Box>
            <Grid container className={classes.gridContainer}>
              <Grid item className={classes.gridItem}>
                <Typography variant="h5" component="h2">
                  {creator.username}
                </Typography>
              </Grid>
              <Grid item>
                <Typography
                  variant="body2"
                  color="secondary"
                  className={`${classes.grey} ${classes.date}`}
                >
                  {createdAt.toLocaleString()}
                </Typography>
              </Grid>
            </Grid>
            <ListItemText>{content}</ListItemText>
          </Box>
        </Grid>
      </Grid>
    </ListItem>
  );
};

export default Message;
