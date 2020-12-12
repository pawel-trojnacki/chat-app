import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { FormikValues } from 'formik';

import PageTemplate from '../templates/PageTemplate/PageTemplate';
import ChannelForm from '../components/ChannelForm/ChannelForm';
import { useAxios } from '../hooks/useAxios';
import { AuthContext } from '../context/AuthContext';

const CreateChannelPage = () => {
  const { state } = useContext(AuthContext);
  const [error, isLoading, sendRequest] = useAxios();
  const history = useHistory();

  const handleSubmit = async (values: FormikValues, file: any) => {
    const { name, description, category } = values;
    const formData = new FormData();
    formData.append('name', name);
    formData.append('category', category);
    formData.append('description', description);
    formData.append('image', file);

    const response = await sendRequest(
      `${process.env.REACT_APP_API_URL}/api/channel/new`,
      'post',
      formData,
      { Authorization: 'Bearer ' + state.token }
    );

    if (response && response.url && response.url !== '') {
      await sendRequest(response.url, 'put', file, {
        'Content-type': file.mimetype,
      });
    }

    if (response.channel && response.channel.id) {
      history.push(`/dashboard/channels/${response.channel.id}`);
    }
  };

  return (
    <PageTemplate pageTitle="Create channel">
      <ChannelForm handleSubmit={handleSubmit} />
      {error && <p>{error}</p>}
    </PageTemplate>
  );
};

export default CreateChannelPage;
