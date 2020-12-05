import React, { useEffect, useState, FC, useContext, useRef } from 'react';
import { useParams } from 'react-router-dom';
import openSocket from 'socket.io-client';
import { Box, List } from '@material-ui/core';

import { useAxios } from '../hooks/useAxios';
import { AuthContext } from '../context/context';
import MessageField from '../components/MessageField/MessageField';
// import Loader from '../components/Lodader/Loader';
import Message, { MessageProps } from '../components/Message/Message';

interface ParamType {
  id: string;
}

const ChannelPage: FC = () => {
  const { state } = useContext(AuthContext);
  const [channel, setChannel] = useState<object | null>(null);
  const [messages, setMessages] = useState<[MessageProps] | null>(null);
  const { id } = useParams<ParamType>();
  const [error, isLoading, sendRequest] = useAxios();
  const messagesEnd = useRef(null);

  const scrollToBottom = () => {
    (messagesEnd.current! as HTMLDivElement).scrollIntoView();
  };

  useEffect(() => {
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

      const socket = openSocket(`${process.env.REACT_APP_API_URL}`);
      socket.on('channel', (data: any) => {
        if (data.action === 'get-channel') {
          setMessages(data.messages);
        }
      });
    };

    fetchMessages();
  }, [id, state.token, sendRequest]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  return (
    <div
      style={{
        position: 'relative',
        minHeight: '80vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
      }}
    >
      {/* {(isLoading || error) && <Loader isLoading={isLoading} error={error} />} */}
      {messages && (
        <>
          <Box paddingBottom="100px">
            <List>
              {messages.map((message) => (
                <Message
                  key={message.id}
                  id={message.id}
                  createdAt={new Date(message.createdAt)}
                  creator={message.creator}
                  content={message.content}
                />
              ))}
            </List>
          </Box>
          <MessageField id={id} />
        </>
      )}
      <div ref={messagesEnd}></div>
    </div>
  );
};

export default ChannelPage;
