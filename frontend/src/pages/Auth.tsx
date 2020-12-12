import React, { useState, useContext } from 'react';
import { Redirect } from 'react-router-dom';
import { Box, Grid, Hidden } from '@material-ui/core';

import { AuthContext } from '../context/AuthContext';
import LoginForm from '../components/LoginForm/LoginForm';
import AnimatedSvg from '../components/AnimatedSvg/AnimatedSvg';
import AuthBox from '../components/AuthBox/AuthBox';
import { Urls } from '../constants/urls';

const Auth = () => {
  const { state } = useContext(AuthContext);
  const [isLoginMode, setIsLoginMode] = useState(true);

  if (state.isAuthenticated) {
    return <Redirect to={Urls.Explore} />;
  }

  return (
    <>
      <Box>
        <Grid container>
          <Hidden smDown>
            <Box width="60%">
              <AnimatedSvg />
            </Box>
          </Hidden>
          {isLoginMode && (
            <AuthBox
              handleModeButtonClick={() => setIsLoginMode(false)}
              title="Welcome again"
              text="Don't have an account?"
              buttonText="Sign up"
            >
              <LoginForm />
            </AuthBox>
          )}

          {!isLoginMode && (
            <AuthBox
              handleModeButtonClick={() => setIsLoginMode(true)}
              title="Nice to meet you"
              text="Already have an account?"
              buttonText="Log in"
            >
              <LoginForm registrationForm />
            </AuthBox>
          )}
        </Grid>
      </Box>
    </>
  );
};

export default Auth;
