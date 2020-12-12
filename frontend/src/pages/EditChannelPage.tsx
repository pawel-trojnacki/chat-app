import React, { FC, useContext, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Box } from '@material-ui/core';

import { AuthContext } from '../context/AuthContext';
import { useAxios } from '../hooks/useAxios';
import PageTemplate from '../templates/PageTemplate/PageTemplate';
import Card from '../components/Card/Card';
import TextField from '../components/TextField/TextField';
import FileField from '../components/FileField/FileField';
import Snackbar from '../components/Snackbar/Snackbar';
import { ChannelInfoType } from '../constants/channel';

interface ParamType {
  id: string;
}

const EditChannelPage: FC = () => {
  const { id } = useParams<ParamType>();
  const { state } = useContext(AuthContext);
  const [error, isLoading, sendRequest] = useAxios();

  const [channel, setChannel] = useState<ChannelInfoType>();

  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(!!error);

  const handleFileInputSubmit = async (image: any) => {
    setIsSuccess(false);

    const formData = new FormData();
    formData.append('image', image);

    const response = await sendRequest(
      `${process.env.REACT_APP_API_URL}/api/edit-channel/${id}`,
      'patch',
      formData,
      { Authorization: 'Bearer ' + state.token }
    );

    if (response && response.url && response.url !== '') {
      await sendRequest(response.url, 'put', image, {
        'Content-type': image.mimetype,
      });
    }

    if (response && response.channel) {
      setIsSuccess(true);
    } else {
      setIsError(true);
    }
  };

  const handleTextInputSubmit = async (values: {
    name?: string;
    description?: string;
  }) => {
    setIsSuccess(false);

    const response = await sendRequest(
      `${process.env.REACT_APP_API_URL}/api/edit-channel/${id}`,
      'patch',
      {
        name: values.name || null,
        description: values.description || null,
      },
      {
        Authorization: 'Bearer ' + state.token,
      }
    );

    if (response && response.channel) {
      setChannel(response.channel);
      setIsSuccess(true);
    } else {
      setIsError(true);
    }
  };

  useEffect(() => {
    const getChannelInfo = async () => {
      const response = await sendRequest(
        `${process.env.REACT_APP_API_URL}/api/channel-info/${id}`,
        'get',
        {},
        {
          Authorization: 'Bearer ' + state.token,
        }
      );
      if (response && response.channel) {
        setChannel(response.channel);
      }
    };
    getChannelInfo();
  }, [state.token, id, sendRequest]);

  return (
    <PageTemplate pageTitle="Edit channel">
      {channel && (
        <Box
          marginY={3}
          marginX="auto"
          maxWidth={{ xs: '100%', sm: '70%', md: '60%' }}
        >
          <Card withoutPadding>
            <FileField
              label="image"
              handleFileInputSubmit={handleFileInputSubmit}
              currentFile={channel.image}
              disabledButton={isLoading}
              uploadButtonText="Upload image"
            />
          </Card>

          <Card>
            <TextField
              title="Channel name"
              label="name"
              handleTextInputSubmit={handleTextInputSubmit}
              minLength={3}
              maxLength={24}
              disabledButton={isLoading}
              initialValue={channel.name}
            />
          </Card>
          <Card>
            <TextField
              title="Description"
              label="description"
              multiline
              handleTextInputSubmit={handleTextInputSubmit}
              minLength={8}
              maxLength={100}
              disabledButton={isLoading}
              initialValue={channel.description}
            />
          </Card>
        </Box>
      )}
      <Snackbar
        error={error}
        isSuccess={isSuccess}
        isError={isError}
        message="Channel updated"
      />
    </PageTemplate>
  );
};

export default EditChannelPage;
