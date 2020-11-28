import React, { FC, ReactNode } from 'react';
import { Typography, Box, Link } from '@material-ui/core';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { motion } from 'framer-motion';

interface AuthBoxProps {
  children: ReactNode;
  handleModeButtonClick: () => void;
  title: string;
  text: string;
  buttonText: string;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      height: '100vh',
      backgroundColor: '#f5f4f5',
      [theme.breakpoints.up('md')]: {
        width: '40%',
      },
    },
  })
);

const AuthBox: FC<AuthBoxProps> = ({
  children,
  handleModeButtonClick,
  title,
  text,
  buttonText,
}) => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Box marginTop={{ xs: 10, md: 12, lg: 14 }}>
        <motion.div
          initial={{ opacity: 0, y: '25%' }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        >
          <Typography variant="h1">{title}</Typography>
        </motion.div>
      </Box>
      <motion.div
        initial={{ opacity: 0, y: '12px' }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5, ease: 'easeInOut' }}
      >
        {children}

        <Box textAlign="center" paddingY={1}>
          <Typography>
            {text}{' '}
            <Link href="#" onClick={handleModeButtonClick}>
              {buttonText}
            </Link>
          </Typography>
        </Box>
      </motion.div>
    </div>
  );
};

export default AuthBox;
