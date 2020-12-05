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

const imagesUrl = `${process.env.REACT_APP_API_URL}/uploads/images`;

export interface ChannelCardProps {
  id: string;
  image: string;
  members: string[];
  name: string;
  description: string;
  handleJoinButtonClick: () => void;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    // root: {
    //   padding: '10px',
    // },
    cardActions: {
      justifyContent: 'space-between',
    },
    image: {
      height: '140px',
      width: '100%',
      objectFit: 'cover',
      objectPosition: 'center',
      [theme.breakpoints.up('md')]: {
        height: '180px',
      },
    },
  })
);

const ChannelCard: FC<ChannelCardProps> = ({
  id,
  image,
  members,
  name,
  description,
  handleJoinButtonClick,
}) => {
  const classes = useStyles();

  return (
    <Grid item xs={12} sm={6} md={4}>
      <Card>
        <img
          className={classes.image}
          alt={name}
          src={
            image
              ? `${imagesUrl}/${image}`
              : `${imagesUrl}/image-placeholder.jpg`
          }
        />
        <Box padding={2}>
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
        </Box>
      </Card>
    </Grid>
  );
};

export default ChannelCard;
