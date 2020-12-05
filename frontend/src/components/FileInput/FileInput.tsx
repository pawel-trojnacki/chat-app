import React, { FC, RefObject, SetStateAction, FormEvent } from 'react';

import { Button } from '@material-ui/core';
import { CloudUpload } from '@material-ui/icons';

interface FileInputProps {
  label: string;
  fileInput: RefObject<HTMLInputElement>;
  disabledButton: boolean;
  setFile: (value: SetStateAction<any>) => void;
  uploadButtonText?: string;
}

const FileInput: FC<FileInputProps> = ({
  label,
  fileInput,
  setFile,
  disabledButton,
  uploadButtonText,
}) => {
  const loadFile = (
    e: FormEvent,
    setFile: (value: SetStateAction<any>) => void
  ) => {
    const target = e.target as HTMLInputElement;
    if (target.files && target.files.length === 1) {
      const pickedFile = target.files[0];
      setFile(pickedFile);
    }
  };

  const clickInput = (fileInput: RefObject<HTMLInputElement>) => {
    if (fileInput) {
      if (fileInput.current) {
        fileInput.current.click();
      }
    }
  };

  return (
    <>
      <Button
        disabled={disabledButton}
        startIcon={<CloudUpload />}
        type="button"
        variant="outlined"
        onClick={() => clickInput(fileInput)}
      >
        {uploadButtonText || 'Upload'}
      </Button>
      <input
        type="file"
        accept="image/*"
        id={`${label}-input`}
        name={label}
        onChange={(e) => loadFile(e, setFile)}
        hidden
        ref={fileInput}
      />
    </>
  );
};

export default FileInput;
