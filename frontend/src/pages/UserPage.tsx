import React, { FC, useContext, useState } from 'react';
import { AuthContext, AuthActionTypes } from '../context/context';
import { useAxios } from '../hooks/useAxios';
import TextInput from '../components/Input/TextInput';

const UserPage: FC = () => {
  const { state, dispatch } = useContext(AuthContext);
  const [error, isLoading, sendRequest] = useAxios();
  const [success, setSuccess] = useState(false);
  const handleTextInputSubmit = (values: { username: string }) => {
    setSuccess(false);
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
        setSuccess(true);
      }
    });
  };
  return (
    <div>
      <TextInput
        title="Username"
        label="username"
        handleTextInputSubmit={handleTextInputSubmit}
        minLength={3}
        maxLength={20}
        disabledButton={isLoading}
        error={error}
        success={success}
        successMessage="Username changed"
        initialValue={state.userData.username}
      />
    </div>
  );
};

export default UserPage;
