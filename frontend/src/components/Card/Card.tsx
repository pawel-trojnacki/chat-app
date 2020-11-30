import React, { FC, ReactNode } from 'react';
import { Card as MaterialCard, Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  root: {
    // margin: '20px',
  },
});

const Card: FC<{ children: ReactNode; withoutPadding?: boolean }> = ({
  children,
  withoutPadding,
}) => {
  const classes = useStyles();
  return (
    <MaterialCard className={classes.root}>
      <Box paddingX={withoutPadding ? 0 : 4} paddingY={withoutPadding ? 0 : 5}>
        {children}
      </Box>
    </MaterialCard>
  );
};

export default Card;
