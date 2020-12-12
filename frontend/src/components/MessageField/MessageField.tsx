import React, {
  FC,
  useState,
  useContext,
  useEffect,
  FormEvent,
  KeyboardEvent,
} from 'react';
import { TextField, IconButton, Grid, Box, Paper } from '@material-ui/core';
import { Alert, AlertTitle } from '@material-ui/lab/';

import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import {
  EmojiEmotions as PickerIcon,
  Send as SendIcon,
  Mic as MicIcon,
  MicOff as MicOffIcon,
} from '@material-ui/icons';
import { IEmojiData } from 'emoji-picker-react';
import { AnimatePresence } from 'framer-motion';
import SpeechRecognition, {
  useSpeechRecognition,
} from 'react-speech-recognition';

import { useAxios } from '../../hooks/useAxios';
import { AuthContext } from '../../context/AuthContext';
import EmojiPicker from '../EmojiPicker/EmojiPicker';

const drawerWidth = '240px';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      position: 'fixed',
      width: '100%',
      bottom: 0,
      right: 0,
      zIndex: 3,
      [theme.breakpoints.up('md')]: {
        width: `calc(100% - ${drawerWidth})`,
      },
    },
    buttons: {
      maxWidth: '110px',
      [theme.breakpoints.up('md')]: {
        paddingRight: '10px',
        maxWidth: '130px',
      },
      position: 'absolute',
      top: '50%',
      right: '0',
      transform: 'translateY(-50%)',
    },
    buttonIcon: {
      padding: '6px',
    },
    input: {
      fontSize: '12px',
      paddingRight: '105px',
      [theme.breakpoints.up('md')]: {
        fontSize: '14px',
        paddingRight: '130px',
      },
    },
    info: {
      position: 'fixed',
      right: '3%',
      bottom: '15%',
      zIndex: 1200,
    },
  })
);

interface MessageFieldProps {
  id: string;
}

const MessageField: FC<MessageFieldProps> = ({ id }) => {
  const { state } = useContext(AuthContext);
  const classes = useStyles();
  const { transcript, listening, resetTranscript } = useSpeechRecognition();
  // eslint-disable-next-line
  const [error, isLoading, sendRequest] = useAxios();
  const [message, setMessage] = useState('');
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [isSpeechRunning, setIsSpeechRunning] = useState(false);

  const handleRunSpeechRecognition = () => {
    if (isSpeechRunning) {
      SpeechRecognition.stopListening();
      setIsSpeechRunning(false);
    } else {
      SpeechRecognition.startListening({
        continuous: true,
        language: 'en-US',
      });
      setIsSpeechRunning(true);
    }
  };

  useEffect(() => {
    let mounted = true;
    if (mounted) {
      if (SpeechRecognition.browserSupportsSpeechRecognition()) {
        setMessage(transcript);
      }
    }
    return () => {
      mounted = false;
    };
  }, [listening, transcript]);

  const sendMessage = async () => {
    sendRequest(
      `${process.env.REACT_APP_API_URL}/api/send-message/${id}`,
      'patch',
      { content: message },
      { Authorization: 'Bearer ' + state.token }
    );
    setMessage('');
    if (isSpeechRunning) {
      SpeechRecognition.stopListening();
      setIsSpeechRunning(false);
    }
    resetTranscript();
  };

  const handleChange = (e: FormEvent) => {
    setMessage((e.target as HTMLInputElement).value);
    if (transcript && transcript !== '') {
      resetTranscript();
    }
  };

  const handleEmojiClick = (e: MouseEvent, emojiObject: IEmojiData) => {
    setMessage((prevMessage) => prevMessage + emojiObject.emoji);
  };

  const handlePickerClick = () => {
    setIsPickerOpen((prev) => !prev);
  };

  const handleEnter = (e: KeyboardEvent) => {
    if (e.key === 'Enter' && message.length > 0) {
      sendMessage();
    }
  };
  return (
    <>
      <Paper elevation={3} className={classes.root} data-testid="message-field">
        <Box paddingY={3} paddingX={{ xs: 2, sm: 3, md: 5 }}>
          <Box position="relative">
            <TextField
              fullWidth
              variant="outlined"
              label="Message"
              value={message}
              onChange={handleChange}
              onKeyPress={handleEnter}
              InputProps={{
                classes: {
                  input: classes.input,
                },
              }}
              inputProps={{ 'data-testid': 'message-field-input' }}
            />

            <Grid container className={classes.buttons} justify="flex-end">
              {SpeechRecognition.browserSupportsSpeechRecognition() && (
                <Grid item>
                  <IconButton
                    className={classes.buttonIcon}
                    color="primary"
                    onClick={handleRunSpeechRecognition}
                  >
                    {isSpeechRunning ? <MicOffIcon /> : <MicIcon />}
                  </IconButton>
                </Grid>
              )}

              <Grid item>
                <IconButton
                  className={classes.buttonIcon}
                  color="primary"
                  onClick={handlePickerClick}
                  data-testid="emoji-picker-button"
                >
                  <PickerIcon />
                </IconButton>
              </Grid>
              <Grid item>
                <IconButton
                  className={classes.buttonIcon}
                  color="primary"
                  onClick={sendMessage}
                >
                  <SendIcon />
                </IconButton>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Paper>

      {isSpeechRunning && (
        <div className={classes.info}>
          <Alert severity="info" variant="filled" elevation={6}>
            <AlertTitle>Voice recognition enabled</AlertTitle>
            <strong>Say something to enter a message!</strong>
          </Alert>
        </div>
      )}

      <AnimatePresence>
        {isPickerOpen && (
          <EmojiPicker
            handleEmojiClick={handleEmojiClick}
            closePicker={() => setIsPickerOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default MessageField;
