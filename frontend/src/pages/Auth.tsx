import React, { useState } from 'react';
import { Typography, Box, Grid, Hidden, Link } from '@material-ui/core';

import LoginForm from '../components/LoginForm/LoginForm';
import RegistationForm from '../components/RegistrationForm/RegistrationForm';
import AnimatedSvg from '../components/AnimatedSvg/AnimatedSvg';

const Auth = () => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  return (
    <Box>
      <Grid container>
        <Hidden smDown>
          <Box width="60%">
            <AnimatedSvg />
          </Box>
        </Hidden>

        <Box
          width={{ xs: '100%', md: '40%' }}
          height="100vh"
          bgcolor="grey.100"
        >
          <Box marginTop={{ xs: 10, md: 12, lg: 14 }}>
            <Typography variant="h1">
              {isLoginMode ? 'Welcome again' : 'Nice to meet you'}
            </Typography>
          </Box>
          {isLoginMode ? <LoginForm /> : <RegistationForm />}
          <Box textAlign="center" paddingY={1}>
            {isLoginMode && (
              <Typography>
                Don't have an account?{' '}
                <Link href="#" onClick={() => setIsLoginMode(false)}>
                  Sign up
                </Link>
              </Typography>
            )}
            {!isLoginMode && (
              <Typography>
                Already have an account?{' '}
                <Link href="#" onClick={() => setIsLoginMode(true)}>
                  Log in
                </Link>
              </Typography>
            )}
          </Box>
        </Box>
      </Grid>
    </Box>
  );
};

export default Auth;
