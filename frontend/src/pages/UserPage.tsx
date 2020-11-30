import React, { FC, useContext, useState } from 'react';
import { Snackbar, Grid } from '@material-ui/core';
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';

import { AuthContext, AuthActionTypes } from '../context/context';
import { useAxios } from '../hooks/useAxios';
import Card from '../components/Card/Card';
import TextInput from '../components/Input/TextInput';
import FileInput from '../components/Input/FileInput';

const Alert = (props: AlertProps) => {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
};

const UserPage: FC = () => {
  const { state, dispatch } = useContext(AuthContext);
  const [error, isLoading, sendRequest] = useAxios();
  // const [success, setSuccess] = useState(false);

  const [successOpen, setSuccessOpen] = useState(false);
  const [errorOpen, setErrorOpen] = useState(!!error);

  const handleCloseError = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setErrorOpen(false);
  };

  const handleCloseSuccess = (
    event?: React.SyntheticEvent,
    reason?: string
  ) => {
    if (reason === 'clickaway') {
      return;
    }

    setSuccessOpen(false);
  };

  const handleTextInputSubmit = (values: { username: string }) => {
    setSuccessOpen(false);

    sendRequest(
      `${process.env.REACT_APP_API_URL}/api/edit-username`,
      'patch',
      {
        username: values.username,
      },
      { Authorization: 'Bearer ' + state.token }
    ).then((response) => {
      if (response && response.user) {
        dispatch({
          type: AuthActionTypes.SetUserData,
          payload: {
            userData: response.user,
          },
        });
        setSuccessOpen(true);
      } else {
        setErrorOpen(true);
      }
    });
  };

  const handleFileInputSubmit = async (avatar: any) => {
    setSuccessOpen(false);
    const formData = new FormData();
    formData.append('avatar', avatar);
    sendRequest(
      `${process.env.REACT_APP_API_URL}/api/upload-avatar`,
      'patch',
      formData,
      { Authorization: 'Bearer ' + state.token }
    ).then((response) => {
      if (response && response.user) {
        dispatch({
          type: AuthActionTypes.SetUserData,
          payload: {
            userData: response.user,
          },
        });
        setSuccessOpen(true);
      } else {
        setErrorOpen(true);
      }
    });
  };

  return (
    <div>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card withoutPadding>
            <FileInput
              label="avatar"
              handleFileInputSubmit={handleFileInputSubmit}
              currentFile={state.userData.avatar}
              disabledButton={isLoading}
              uploadButtonText="Upload avatar"
            />
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <TextInput
              title="Username"
              label="username"
              handleTextInputSubmit={handleTextInputSubmit}
              minLength={3}
              maxLength={20}
              disabledButton={isLoading}
              initialValue={state.userData.username}
            />
          </Card>
        </Grid>
      </Grid>

      <Snackbar
        open={successOpen}
        autoHideDuration={5000}
        onClose={handleCloseSuccess}
      >
        <Alert onClose={handleCloseSuccess} severity="success">
          Profile updated
        </Alert>
      </Snackbar>

      <Snackbar
        open={errorOpen}
        autoHideDuration={5000}
        onClose={handleCloseError}
      >
        <Alert onClose={handleCloseError} severity="error">
          {error}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default UserPage;
