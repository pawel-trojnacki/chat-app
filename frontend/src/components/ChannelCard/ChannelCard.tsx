import React, { FC } from 'react';
import {
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Badge,
  Box,
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
      padding: '10px',
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
    <Grid item xs={12} sm={6} md={4}>
      <Card className={classes.root}>
        <CardContent>
          <Typography variant="h4" component="h2">
            {name}
          </Typography>
          <Box minHeight={{ xs: 'auto', md: '50px' }}>
            <Typography variant="body1">{description}</Typography>
          </Box>
        </CardContent>
        <CardActions className={classes.cardActions}>
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
    </Grid>
  );
};

export default ChannelCard;
