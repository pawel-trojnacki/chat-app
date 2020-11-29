import React, {
  FC,
  useState,
  useContext,
  FormEvent,
  KeyboardEvent,
} from 'react';
import { TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import { useAxios } from '../../hooks/useAxios';
import { AuthContext } from '../../context/context';

const useStyles = makeStyles({
  root: {
    position: 'absolute',
    width: '98%',
    // bottom: '0',
    paddingBottom: '20px',
  },
});

interface MessageInputProps {
  id: string;
}

const MessageInput: FC<MessageInputProps> = ({ id }) => {
  const { state } = useContext(AuthContext);
  const [error, loding, sendRequest] = useAxios();
  const [message, setMessage] = useState('');
  const classes = useStyles();

  const handleChange = (e: FormEvent) => {
    setMessage((e.target as HTMLInputElement).value);
  };

  const handleEnter = (e: KeyboardEvent) => {
    if (e.key === 'Enter' && message.length > 0) {
      sendRequest(
        `${process.env.REACT_APP_API_URL}/api/send-message/${id}`,
        'patch',
        { content: message },
        { Authorization: 'Bearer ' + state.token }
      );
      setMessage('');
    }
  };
  return (
    <div className={classes.root}>
      <TextField
        fullWidth
        variant="filled"
        label="Message"
        value={message}
        onChange={handleChange}
        onKeyPress={handleEnter}
      />
    </div>
  );
};

export default MessageInput;
