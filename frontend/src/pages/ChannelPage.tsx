import React, { useEffect, useState, FC, useContext, useRef } from 'react';
import { useParams } from 'react-router-dom';
import openSocket from 'socket.io-client';
import { makeStyles } from '@material-ui/core/styles';
import { Edit as EditIcon } from '@material-ui/icons';

import { useAxios } from '../hooks/useAxios';
import { AuthContext } from '../context/context';
import PageTemplate from '../templates/PageTemplate/PageTemplate';
import MessageField from '../components/MessageField/MessageField';
import MessageList from '../components/MessageList/MessageList';
import Loader from '../components/Loader/Loader';
import { MessageProps } from '../components/Message/Message';
import FixedWrapper from '../components/FixedWrapper/FixedWrapper';
import FloatingButton from '../components/FloatingButton/FloatingButton';

interface ParamType {
  id: string;
}

const useStyles = makeStyles({
  root: {
    position: 'relative',
    minHeight: '80vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
  },
});

const ChannelPage: FC = () => {
  const { state } = useContext(AuthContext);
  const classes = useStyles();

  const [channel, setChannel] = useState<{
    id: string;
    name: string;
    admin: string;
  } | null>(null);
  const [messages, setMessages] = useState<MessageProps[]>([]);
  const { id } = useParams<ParamType>();
  const [error, isLoading, sendRequest] = useAxios();
  const messagesEnd = useRef(null);

  const scrollToBottom = () => {
    (messagesEnd.current! as HTMLDivElement).scrollIntoView();
  };

  useEffect(() => {
    let mounted = true;

    if (mounted) {
      const fetchMessages = async () => {
        const response = await sendRequest(
          `${process.env.REACT_APP_API_URL}/api/channel/${id}`,
          'get',
          {},
          { Authorization: 'Bearer ' + state.token }
        );

        if (response && response.channel) {
          setChannel(response.channel);
          setMessages(response.channel.messages);
        }
      };

      fetchMessages();
    }

    return () => {
      mounted = false;
    };
  }, [id, state.token, sendRequest]);

  useEffect(() => {
    let mounted = true;
    if (mounted) {
      const socket = openSocket(`${process.env.REACT_APP_API_URL}`);
      socket.on('channel', (data: any) => {
        if (data.action === 'get-channel') {
          setMessages((prevMessages) => [...prevMessages, data.message]);
        }
      });
    }

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <>
      {(isLoading || error) && (
        <FixedWrapper>
          <Loader isLoading={isLoading} error={error} height="100vh" />
        </FixedWrapper>
      )}
      {!error && !isLoading && (
        <PageTemplate pageTitle={channel ? channel.name : 'Channel'}>
          {channel && channel.admin === state.user && (
            <FloatingButton
              icon={EditIcon}
              link={`/dashboard/edit-channel/${channel.id}`}
            />
          )}
          <div className={classes.root}>
            <MessageList messages={messages} />
            <MessageField id={id} />
          </div>
        </PageTemplate>
      )}
      <div ref={messagesEnd}></div>
    </>
  );
};

export default ChannelPage;
