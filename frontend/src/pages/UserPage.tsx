import React, { FC, useContext, useState } from 'react';
import { Box } from '@material-ui/core';

import { AuthContext, AuthActionTypes } from '../context/AuthContext';
import { useAxios } from '../hooks/useAxios';
import PageTemplate from '../templates/PageTemplate/PageTemplate';
import Card from '../components/Card/Card';
import TextField from '../components/TextField/TextField';
import FileField from '../components/FileField/FileField';
import Snackbar from '../components/Snackbar/Snackbar';

const UserPage: FC = () => {
  const { state, dispatch } = useContext(AuthContext);
  const [error, isLoading, sendRequest] = useAxios();

  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(!!error);

  const handleTextInputSubmit = async (values: { username: string }) => {
    setIsSuccess(false);

    const response = await sendRequest(
      `${process.env.REACT_APP_API_URL}/api/edit-username`,
      'patch',
      {
        username: values.username,
      },
      { Authorization: 'Bearer ' + state.token }
    );

    if (response && response.user) {
      dispatch({
        type: AuthActionTypes.SetUserData,
        payload: {
          userData: response.user,
        },
      });
      setIsSuccess(true);
    } else {
      setIsError(true);
    }
  };

  const handleFileInputSubmit = async (avatar: any) => {
    setIsSuccess(false);

    const formData = new FormData();
    formData.append('avatar', avatar);

    const response = await sendRequest(
      `${process.env.REACT_APP_API_URL}/api/upload-avatar`,
      'patch',
      formData,
      { Authorization: 'Bearer ' + state.token }
    );

    if (response && response.url) {
      await sendRequest(response.url, 'put', avatar, {
        'Content-type': avatar.mimetype,
      });
    }

    if (response && response.user) {
      dispatch({
        type: AuthActionTypes.SetUserData,
        payload: {
          userData: response.user,
        },
      });
      setIsSuccess(true);
    } else {
      setIsError(true);
    }
  };

  return (
    <PageTemplate pageTitle="Account details">
      <Box
        marginY={3}
        marginX="auto"
        maxWidth={{ xs: '100%', md: '70%', lg: '60%' }}
      >
        <Card withoutPadding>
          <FileField
            label="avatar"
            handleFileInputSubmit={handleFileInputSubmit}
            currentFile={state.userData.avatar}
            disabledButton={isLoading}
            uploadButtonText="Upload avatar"
          />
        </Card>
        <Card>
          <TextField
            title="Username"
            label="username"
            handleTextInputSubmit={handleTextInputSubmit}
            minLength={3}
            maxLength={20}
            disabledButton={isLoading}
            initialValue={state.userData.username}
          />
        </Card>
      </Box>

      <Snackbar
        error={error}
        isSuccess={isSuccess}
        isError={isError}
        message="Profile updated"
      />
    </PageTemplate>
  );
};

export default UserPage;
