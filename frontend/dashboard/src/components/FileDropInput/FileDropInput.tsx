import { Div } from '@haas/ui';
import { Spinner } from '@chakra-ui/core';
import { useDropzone } from 'react-dropzone';
import { useTranslation } from 'react-i18next';
import React from 'react';
import styled, { css } from 'styled-components';

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

const UploadPreviewContainer = styled(Div)`
  ${({ theme }) => css`
    border-radius: 10px;
    box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 12px;
    height: 100%;
    display: flex;
    background: ${theme.colors.primaries[500]};
    padding: ${theme.gutter / 2}px;
    
    img {
      max-width: 800px;
      max-height: 400px;
      border-radius: 10px;
      height: 100%;
      width: 100%;
      object-fit: contain;
    }
  `}
`;

const FileDropInput = (props: any) => {
  const { onDrop, isLoading, value } = props;

  const {
    acceptedFiles,
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
  } = useDropzone({
    // TODO: Bring it back (temporarily disabled)
    // accept: 'image/*',
    onDrop,
  });

  const acceptedFile = acceptedFiles?.[0] || undefined;

  const { t } = useTranslation();

  return (
    <section className="container">
      {/* @ts-ignore */}
      <DropContainer {...getRootProps({ isDragActive, isDragAccept, isDragReject })}>
        {value && (
          <UploadPreviewContainer mb={2}>
            <Div>
              <img src={value} alt="" />
            </Div>
          </UploadPreviewContainer>
        )}
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
              <>
                {value ? (
                  <p>{t('upload_zone_replace')}</p>
                ) : (
                  <p>{t('upload_zone')}</p>
                )}
              </>
            )}
          </>
        )}
      </DropContainer>
    </section>
  );
};

export default FileDropInput;
