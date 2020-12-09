import React, { FC, ReactNode } from 'react';
import { Typography } from '@material-ui/core';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    title: {
      position: 'fixed',
      top: '0',
      zIndex: 1200,
      marginLeft: '44px',
      marginTop: '16px',
      color: theme.palette.common.white,
      [theme.breakpoints.up('md')]: {
        marginLeft: 0,
        marginTop: '20px',
      },
    },
  })
);

interface PageTemplateProps {
  children: ReactNode;
  pageTitle: string;
}

const PageTemplate: FC<PageTemplateProps> = ({ children, pageTitle }) => {
  const classes = useStyles();
  return (
    <div>
      <Typography className={classes.title} variant="h2" component="h1" noWrap>
        {pageTitle}
      </Typography>
      {children}
    </div>
  );
};

export default PageTemplate;
