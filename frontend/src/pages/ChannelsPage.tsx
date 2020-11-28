import React, { FC, useEffect, useContext, useState } from 'react';
import { GridList } from '@material-ui/core';
import { AuthContext } from '../context/context';
import { useAxios } from '../hooks/useAxios';
import Loader from '../components/Lodader/Loader';
import ChannelCard from '../components/ChannelCard/ChannelCard';
import CategoryTabs from '../components/CategoryTabs/CategoryTabs';
import { ChannelModel } from '../constants/channelModel';

const ChannelsPage: FC = () => {
  const [channels, setChannels] = useState<ChannelModel[]>([]);
  const { state } = useContext(AuthContext);
  const [error, isLoading, sendRequest] = useAxios();

  const handleJoinButtonClick: (id: string) => void = (id) => {
    sendRequest(
      `${process.env.REACT_APP_API_URL}/api/join-channel/${id}`,
      'patch',
      {},
      {
        authorization: 'Bearer ' + state.token,
      }
    );
  };

  const handleClick: (req: string | null) => void = (req) => {
    setChannels([]);
    const url = req
      ? `${process.env.REACT_APP_API_URL}/api/channels/${req}`
      : `${process.env.REACT_APP_API_URL}/api/channels/`;

    sendRequest(
      url,
      'get',
      {},
      {
        authorization: 'Bearer ' + state.token,
      }
    )
      .then((response) => {
        if (response) {
          setChannels(response.channels);
        }
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    let mounted = true;
    sendRequest(
      `${process.env.REACT_APP_API_URL}/api/channels`,
      'get',
      {},
      {
        authorization: 'Bearer ' + state.token,
      }
    )
      .then((response) => {
        setChannels(response.channels);
      })
      .catch((err) => console.log(err));

    return () => {
      mounted = false;
    };
  }, [sendRequest, state.token]);

  return (
    <>
      <CategoryTabs handleClick={handleClick} />
      {(isLoading || error) && (
        <Loader isLoading={isLoading} error={error} height="80%" />
      )}
      {channels && channels.length > 0 && !error && (
        <GridList>
          {channels.map((channel: ChannelModel) => (
            <ChannelCard
              key={channel.id}
              id={channel.id}
              members={channel.members}
              name={channel.name}
              description={channel.description}
              handleJoinButtonClick={() => handleJoinButtonClick(channel.id)}
            />
          ))}
        </GridList>
      )}
    </>
  );
};

export default ChannelsPage;
