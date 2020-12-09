import React, { FC, SyntheticEvent, useState, useEffect } from 'react';
import { Snackbar as MaterialSnackbar } from '@material-ui/core';
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';

const Alert = (props: AlertProps) => {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
};

interface SnackbarProps {
  error: string | null;
  isSuccess: boolean;
  isError: boolean;
  message?: string;
}

type handleCloseType = (
  event?: SyntheticEvent<Element, Event> | undefined,
  reason?: string | undefined
) => void;

const Snackbar: FC<SnackbarProps> = ({
  error,
  isSuccess,
  isError,
  message,
}) => {
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(!!error);

  useEffect(() => {
    setIsSuccessOpen(isSuccess);
  }, [isSuccess]);

  useEffect(() => {
    setIsErrorOpen(isError);
  }, [isError]);

  const handleCloseError: handleCloseType = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setIsErrorOpen(false);
  };

  const handleCloseSuccess: handleCloseType = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setIsSuccessOpen(false);
  };

  return (
    <>
      <MaterialSnackbar
        open={isSuccessOpen}
        autoHideDuration={5000}
        onClose={handleCloseSuccess}
      >
        <Alert onClose={handleCloseSuccess} severity="success">
          {message || 'Updated'}
        </Alert>
      </MaterialSnackbar>

      <MaterialSnackbar
        open={isErrorOpen}
        autoHideDuration={5000}
        onClose={handleCloseError}
      >
        <Alert onClose={handleCloseError} severity="error">
          {error}
        </Alert>
      </MaterialSnackbar>
    </>
  );
};

export default Snackbar;
