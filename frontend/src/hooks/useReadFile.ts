import { SetStateAction } from 'react';

export const useReadFile = () => {
  const readFile = (
    setFile: (value: SetStateAction<any>) => void,
    file: any
  ) => {
    const fileReader = new FileReader();
    fileReader.onload = () => {
      if (typeof fileReader.result === 'string') setFile(fileReader.result);
    };
    fileReader.readAsDataURL(file);
  };
  return readFile;
};
