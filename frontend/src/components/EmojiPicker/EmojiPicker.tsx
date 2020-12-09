import React, { FC } from 'react';
import Picker, { IEmojiData } from 'emoji-picker-react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { Box, IconButton } from '@material-ui/core';
import { Cancel as CancelIcon } from '@material-ui/icons';
import { motion } from 'framer-motion';

import FixedWrapper from '../FixedWrapper/FixedWrapper';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    pickerWrapper: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: theme.spacing(3),
      backgroundColor: theme.palette.common.white,
    },
  })
);

interface EmojiPickerProps {
  handleEmojiClick: (e: MouseEvent, emojiObject: IEmojiData) => void;
  closePicker: () => void;
}

const EmojiPicker: FC<EmojiPickerProps> = ({
  handleEmojiClick,
  closePicker,
}) => {
  const classes = useStyles();
  return (
    <FixedWrapper
      bg="transparent"
      top="50%"
      left="50%"
      transform="translate(-50%, -50%)"
      width="auto"
      height="auto"
    >
      <motion.div
        className={classes.pickerWrapper}
        initial={{ opacity: 0, y: '100%', x: '50vw', scale: 0 }}
        animate={{ opacity: 1, y: 0, x: 0, scale: 1 }}
        exit={{ opacity: 0, y: '100%', x: '50vw', scale: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Box width="100%" textAlign="right" paddingBottom={2}>
          <IconButton size="small" onClick={closePicker}>
            <CancelIcon />
          </IconButton>
        </Box>
        <Picker onEmojiClick={handleEmojiClick} />
      </motion.div>
    </FixedWrapper>
  );
};

export default EmojiPicker;
