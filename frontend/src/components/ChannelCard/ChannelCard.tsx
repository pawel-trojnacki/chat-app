import React, { FC } from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Badge,
} from '@material-ui/core';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import { People as PeopleIcon } from '@material-ui/icons';

export interface ChannelCardProps {
  id: string;
  members: string[];
  name: string;
  description: string;
  handleJoinButtonClick: () => void;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      margin: '2%',
      padding: '10px',
      width: '100%',
      [theme.breakpoints.up('sm')]: {
        width: '42%',
      },
      [theme.breakpoints.up('md')]: {
        width: '29%',
      },
    },
    cardActions: {
      justifyContent: 'space-between',
    },
  })
);

const ChannelCard: FC<ChannelCardProps> = ({
  id,
  members,
  name,
  description,
  handleJoinButtonClick,
}) => {
  const classes = useStyles();

  return (
    <Card className={classes.root}>
      <CardContent>
        <Typography variant="h4" component="h2">
          {name}
        </Typography>
        <Typography variant="body1">{description}</Typography>
      </CardContent>
      <CardActions className={classes.cardActions}>
        {/* <Typography variant="body2">{`Members: ${members.length}`}</Typography> */}
        <Badge badgeContent={members.length} color="primary" max={999}>
          <PeopleIcon />
        </Badge>
        <Button
          variant="contained"
          color="primary"
          onClick={handleJoinButtonClick}
        >
          Join
        </Button>
      </CardActions>
    </Card>
  );
};

export default ChannelCard;
