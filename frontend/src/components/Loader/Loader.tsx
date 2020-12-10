import React, { FC } from 'react';
import { CircularProgress, Box, Typography } from '@material-ui/core';

interface LoaderProps {
  isLoading: boolean;
  error: null | string;
  height?: string;
}

const Loader: FC<LoaderProps> = ({ isLoading, error, height }) => {
  return (
    <Box
      width="100%"
      height={height || '80vh'}
      display="flex"
      justifyContent="center"
      alignItems="center"
      data-testid="loader"
    >
      {isLoading && <CircularProgress />}
      {error && !isLoading && <Typography variant="h2">{error}</Typography>}
    </Box>
  );
};

export default Loader;
