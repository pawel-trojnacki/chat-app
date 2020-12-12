import React, { FC } from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  root: {
    width: '100%',
    maxHeight: '55vh',
    objectFit: 'cover',
    objectPosition: 'center',
  },
});

interface ImagePreviewProps {
  file: string;
}

const ImagePreview: FC<ImagePreviewProps> = ({ file }) => {
  const classes = useStyles();
  return <img alt="" src={file || undefined} className={classes.root} />;
};

export default ImagePreview;
