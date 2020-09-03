import { Spinner } from '@chakra-ui/core';
import { useDropzone } from 'react-dropzone';
import { useTranslation } from 'react-i18next';
import React from 'react';
import styled from 'styled-components/macro';

const getDropColor = (props: any) => {
  if (props.isDragAccept) {
    return '#00e676';
  }
  if (props.isDragReject) {
    return '#ff1744';
  }
  if (props.isDragActive) {
    return '#2196f3';
  }
  return '#eeeeee';
};

const DropContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  border-width: 2px;
  border-radius: 2px;
  border-color: ${(props) => getDropColor(props)};
  border-style: dashed;
  background-color: #fafafa;
  color: #bdbdbd;
  outline: none;
  transition: border .24s ease-in-out;
`;

const FileDropInput = (props: any) => {
  const { onDrop, isLoading } = props;

  const {
    acceptedFiles,
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
  } = useDropzone({
    accept: 'image/*',
    onDrop,
  });

  const acceptedFile = acceptedFiles?.[0] || undefined;

  const { t } = useTranslation();

  return (
    <section className="container">
      <DropContainer {...getRootProps({ isDragActive, isDragAccept, isDragReject })}>
        {isLoading ? (
          <Spinner />
        ) : (
          <>
            <input {...getInputProps()} />
            {acceptedFile ? (
              <p>
                {acceptedFile?.name}
                {' '}
                -
                {' '}
                {acceptedFile?.size}
                {' '}
                bytes
              </p>
            ) : (
              <p>{t('upload_zone')}</p>
            )}
          </>
        )}
      </DropContainer>
    </section>
  );
};

export default FileDropInput;
