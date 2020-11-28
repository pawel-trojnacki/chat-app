import React, { FC } from 'react';
import { CircularProgress, Box, Typography } from '@material-ui/core';

const Loader: FC<{
  isLoading: boolean;
  error: null | string;
  height?: string;
}> = ({ isLoading, error, height }) => {
  return (
    <Box
      width="100%"
      height={height || '100%'}
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      {isLoading && <CircularProgress />}
      {error && !isLoading && <Typography variant="h2">{error}</Typography>}
    </Box>
  );
};

export default Loader;
