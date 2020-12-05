import React, { FC, SetStateAction, useState, useEffect, useRef } from 'react';
import { DropzoneArea } from 'material-ui-dropzone';
import { Box } from '@material-ui/core';

import FileInput from '../FileInput/FileInput';
import ImagePreview from '../ImagePreview/ImagePreview';
import { useReadFile } from '../../hooks/useReadFile';

interface DropzoneFieldProps {
  file: any;
  setFile: (value: SetStateAction<any>) => void;
  disabledButton: boolean;
}

const DropzoneField: FC<DropzoneFieldProps> = ({
  file,
  setFile,
  disabledButton,
}) => {
  const readFile = useReadFile();
  const fileInput = useRef<HTMLInputElement>(null);

  const [previewFile, setPreviewFile] = useState('');

  useEffect(() => {
    if (!file) {
      return;
    }
    readFile(setPreviewFile, file);
  }, [file, readFile]);
  return (
    <Box paddingBottom={3}>
      {!file && (
        <DropzoneArea
          filesLimit={1}
          acceptedFiles={['image/*']}
          onChange={(files) => setFile(files[0])}
        />
      )}
      {file && (
        <>
          <Box paddingBottom={3}>
            <ImagePreview file={previewFile} />
          </Box>
          <FileInput
            label="Channel image"
            setFile={setFile}
            fileInput={fileInput}
            disabledButton={disabledButton}
            uploadButtonText="Change image"
          />
        </>
      )}
    </Box>
  );
};

export default DropzoneField;
