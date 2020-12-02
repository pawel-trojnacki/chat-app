import React, { FC, FormEvent, useState, useRef, useEffect } from 'react';
import { Box, Button, ButtonGroup } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { CloudUpload } from '@material-ui/icons';

const imagesUrl = `${process.env.REACT_APP_API_URL}/uploads/images`;

const useStyles = makeStyles({
  image: {
    width: '100%',
    maxHeight: '55vh',
    objectFit: 'cover',
    objectPosition: 'center',
  },
});

interface FileInputProps {
  label: string;
  handleFileInputSubmit: (avatar: any) => Promise<void>;
  currentFile: string;
  disabledButton: boolean;
  uploadButtonText?: string;
}

const FileInput: FC<FileInputProps> = ({
  label,
  handleFileInputSubmit,
  disabledButton,
  currentFile,
  uploadButtonText,
}) => {
  const classes = useStyles();

  const fileInput = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<any>(null);
  const [previewFile, setPreviewFile] = useState<string>(
    `${imagesUrl}/${currentFile}`
  );

  const handleChange = (e: FormEvent) => {
    const target = e.target as HTMLInputElement;
    if (target.files && target.files.length === 1) {
      const pickedFile = target.files[0];
      setFile(pickedFile);
    }
  };

  const handleClick = () => {
    if (fileInput) {
      if (fileInput.current) {
        fileInput.current.click();
      }
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    handleFileInputSubmit(file);
  };

  useEffect(() => {
    if (!file) {
      return;
    }
    const fileReader = new FileReader();
    fileReader.onload = () => {
      if (typeof fileReader.result === 'string')
        setPreviewFile(fileReader.result);
    };
    fileReader.readAsDataURL(file);
  }, [file]);

  return (
    <Box>
      <img
        alt="user avatar"
        src={previewFile || undefined}
        className={classes.image}
      />
      {/* )} */}
      <Box paddingX={4} paddingY={5}>
        <form onSubmit={handleSubmit}>
          <Box paddingTop={3}>
            <ButtonGroup>
              <Button
                disabled={disabledButton}
                startIcon={<CloudUpload />}
                type="button"
                onClick={handleClick}
              >
                {uploadButtonText || 'Upload'}
              </Button>
              <input
                type="file"
                accept="image/*"
                id={`${label}-input`}
                name={label}
                onChange={handleChange}
                hidden
                ref={fileInput}
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

export default FileInput;
