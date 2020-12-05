import React, { FC, FormEvent, useState, useRef, useEffect } from 'react';
import { Box, Button, ButtonGroup } from '@material-ui/core';

import ImagePreview from '../ImagePreview/ImagePreview';
import FileInput from '../FileInput/FileInput';
import { useReadFile } from '../../hooks/useReadFile';

const imagesUrl = `${process.env.REACT_APP_API_URL}/uploads/images`;

interface FileInputProps {
  label: string;
  handleFileInputSubmit: (avatar: any) => Promise<void>;
  currentFile: string;
  disabledButton: boolean;
  uploadButtonText?: string;
}

const FileField: FC<FileInputProps> = ({
  label,
  handleFileInputSubmit,
  disabledButton,
  currentFile,
  uploadButtonText,
}) => {
  const readFile = useReadFile();
  const fileInput = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<any>(null);
  const [previewFile, setPreviewFile] = useState<string>(
    `${imagesUrl}/${currentFile}`
  );

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    handleFileInputSubmit(file);
  };

  useEffect(() => {
    if (!file) {
      return;
    }
    readFile(setPreviewFile, file);
  }, [file, readFile]);

  return (
    <Box>
      <ImagePreview file={previewFile} />
      <Box paddingX={4} paddingY={5}>
        <form onSubmit={handleSubmit}>
          <Box paddingTop={3}>
            <ButtonGroup>
              <FileInput
                label={label}
                setFile={setFile}
                fileInput={fileInput}
                disabledButton={disabledButton}
                uploadButtonText={uploadButtonText}
              />
              <Button
                disabled={disabledButton}
                type="submit"
                variant="contained"
                color="primary"
              >
                Save
              </Button>
            </ButtonGroup>
          </Box>
        </form>
      </Box>
    </Box>
  );
};

export default FileField;
