import React, { FC, ReactNode } from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

const drawerWidth = '240px';

interface FixedWrapperProps {
  children: ReactNode;
  bg?: string;
  width?: string;
  height?: string;
  top?: string | number;
  left?: string | number;
  transform?: string;
  zIndex?: number;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: (props: FixedWrapperProps) => ({
      position: 'fixed',
      top: props.top || 0,
      left: props.left || 0,
      width: props.width || '100%',
      height: props.height || '100vh',
      transform: props.transform || 'none',
      zIndex: props.zIndex || 2,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: props.bg || theme.palette.grey[100],
      [theme.breakpoints.up('md')]: {
        paddingLeft: drawerWidth,
      },
    }),
  })
);

const FixedWrapper: FC<FixedWrapperProps> = (props) => {
  const classes = useStyles(props);
  return <div className={classes.root}>{props.children}</div>;
};

export default FixedWrapper;
