import React, { FC } from 'react';
import { Link } from 'react-router-dom';
import { Fab } from '@material-ui/core';
import { SvgIconComponent } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  root: {
    position: 'fixed',
    right: '3%',
    top: '10vh',
    zIndex: 100,
  },
});

interface FloatingButtonProps {
  icon: SvgIconComponent;
  link: string;
}

const FloatingButton: FC<FloatingButtonProps> = ({ icon: Icon, link }) => {
  const classes = useStyles();
  return (
    <Link to={link} className={classes.root}>
      <Fab size="medium" component="div" color="primary">
        <Icon />
      </Fab>
    </Link>
  );
};

export default FloatingButton;
