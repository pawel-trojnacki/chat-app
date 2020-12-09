import React, { FC } from 'react';
import { Box, List } from '@material-ui/core';
import Message, { MessageProps } from '../Message/Message';

interface MessageListProps {
  messages: MessageProps[];
}

const MessageList: FC<MessageListProps> = ({ messages }) => {
  return (
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
  );
};

export default MessageList;
