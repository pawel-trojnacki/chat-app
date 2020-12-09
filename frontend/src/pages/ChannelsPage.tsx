import React, { FC, useEffect, useContext, useState, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { Grid, Box } from '@material-ui/core';

import { AuthContext } from '../context/context';
import { useAxios } from '../hooks/useAxios';
import PageTemplate from '../templates/PageTemplate/PageTemplate';
import Loader from '../components/Lodader/Loader';
import ChannelCard from '../components/ChannelCard/ChannelCard';
import CategoryTabs from '../components/CategoryTabs/CategoryTabs';
import { ChannelModel } from '../constants/channel';
import { compareChannels } from '../utils/compare';

const ChannelsPage: FC = () => {
  let history = useHistory();
  const [channels, setChannels] = useState<ChannelModel[]>([]);
  const { state } = useContext(AuthContext);
  const [error, isLoading, sendRequest] = useAxios();

  const sortedChannels = channels.sort(compareChannels);

  const joinChannel: (id: string) => void = async (id) => {
    await sendRequest(
      `${process.env.REACT_APP_API_URL}/api/join-channel/${id}`,
      'patch',
      {},
      {
        authorization: 'Bearer ' + state.token,
      }
    );
    history.push(`/dashboard/channels/${id}`);
  };

  const fetchChannels = useCallback(
    async (req: string | null) => {
      setChannels([]);
      const url = req
        ? `${process.env.REACT_APP_API_URL}/api/channels/${req}`
        : `${process.env.REACT_APP_API_URL}/api/channels/`;

      const response = await sendRequest(
        url,
        'get',
        {},
        {
          authorization: 'Bearer ' + state.token,
        }
      );

      if (response) {
        setChannels(response.channels);
      }
    },
    [sendRequest, state.token]
  );

  useEffect(() => {
    let mounted = true;
    if (mounted) {
      fetchChannels(null);
    }
    return () => {
      mounted = false;
    };
  }, [fetchChannels]);

  return (
    <PageTemplate pageTitle="Explore">
      <CategoryTabs handleClick={fetchChannels} />
      {(isLoading || error) && (
        <Loader isLoading={isLoading} error={error} height="70vh" />
      )}
      {channels && channels.length > 0 && !error && !isLoading && (
        <Box width={{ xs: '80vw', sm: '70vw', lg: '76vw' }} margin="40px auto">
          <Grid container spacing={3}>
            {sortedChannels.map((channel: ChannelModel) => (
              <ChannelCard
                key={channel.id}
                id={channel.id}
                image={channel.image}
                members={channel.members}
                name={channel.name}
                description={channel.description}
                handleJoinButtonClick={() => joinChannel(channel.id)}
              />
            ))}
          </Grid>
        </Box>
      )}
    </PageTemplate>
  );
};

export default ChannelsPage;
