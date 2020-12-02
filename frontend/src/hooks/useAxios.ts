import { useCallback, useState } from 'react';
import axios from 'axios';

type methodType = 'get' | 'post' | 'patch' | 'delete';

export const useAxios = () => {
  const [error, setError] = useState<null | string>(null);
  const [isLoading, setIsLoading] = useState(false);

  const sendRequest = useCallback(
    async (url: string, method: methodType = 'get', data?, headers?) => {
      setIsLoading(true);
      try {
        setError(null);
        const response = await axios.request({
          method,
          url,
          data,
          headers,
        });
        setIsLoading(false);
        return response.data;
      } catch (err) {
        if (err.response) {
          setError(err.response.data.error);
          setIsLoading(false);
        } else {
          setError('Something went wrong. Please try again.');
          setIsLoading(false);
        }
      }
    },
    []
  );

  return [error, isLoading, sendRequest] as const;
};
