import React, { useEffect, useState, FC, useContext, useRef } from 'react';
import { useParams } from 'react-router-dom';
import openSocket from 'socket.io-client';
import { Box } from '@material-ui/core';

import { useAxios } from '../hooks/useAxios';
import { AuthContext } from '../context/context';
import MessageInput from '../components/Input/MessageInput';
import Loader from '../components/Lodader/Loader';

interface ParamType {
  id: string;
}

interface MessageType {
  id: string;
  createdAt: Date;
  content: string;
  creator: {
    id: string;
    username: string;
  };
}

const ChannelPage: FC = () => {
  const { state } = useContext(AuthContext);
  const [channel, setChannel] = useState<object | null>(null);
  const [messages, setMessages] = useState<[MessageType] | null>(null);
  const { id } = useParams<ParamType>();
  const [error, isLoading, sendRequest] = useAxios();
  const messagesEnd = useRef(null);

  const scrollToBottom = () => {
    (messagesEnd.current! as HTMLDivElement).scrollIntoView();
  };

  useEffect(() => {
    sendRequest(
      `${process.env.REACT_APP_API_URL}/api/channel/${id}`,
      'get',
      {},
      { Authorization: 'Bearer ' + state.token }
    )
      .then((response) => {
        if (response && response.channel) {
          setChannel(response.channel);
          setMessages(response.channel.messages);
        }
      })
      .then(() => {
        const socket = openSocket(`${process.env.REACT_APP_API_URL}`);
        socket.on('channel', (data: any) => {
          if (data.action === 'get-channel') {
            setMessages(data.messages);
          }
        });
      });
  }, [id, state.token, sendRequest]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  return (
    <div style={{ position: 'relative', minHeight: '80vh' }}>
      {(isLoading || error) && <Loader isLoading={isLoading} error={error} />}
      {messages && (
        <>
          <Box paddingBottom="60px">
            <h1>Channel</h1>
            <ul>
              {messages.map((message) => (
                <li key={message.id}>
                  <h5>{message.creator.username}</h5>
                  <h6>{message.createdAt}</h6>
                  <p>{message.content}</p>
                </li>
              ))}
            </ul>
          </Box>
          <MessageInput id={id} />
        </>
      )}
      <div ref={messagesEnd}></div>
    </div>
  );
};

export default ChannelPage;
