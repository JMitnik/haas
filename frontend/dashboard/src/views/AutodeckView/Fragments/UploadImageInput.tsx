import { useToast } from '@chakra-ui/react';
import { useUploadJobImageMutation } from 'types/generated-types';
import FileDropInput from 'components/FileDropInput';
import React, { useEffect } from 'react';

const UploadImageInput = ({ onChange, value, jobId, imageType, isInEditing, isDisapproved }: any) => {
  const toast = useToast();

  const [uploadFile, { loading }] = useUploadJobImageMutation({
    onCompleted: (result) => {
      toast({
        title: 'Uploaded!',
        description: 'File has been uploaded.',
        status: 'success',
        position: 'bottom-right',
        isClosable: true,
      });
      onChange(result.uploadJobImage?.url);
    },
    onError: () => {
      toast({
        title: 'Something went wrong',
        description: 'We were unable to upload file. Try again',
        status: 'error',
        position: 'bottom-right',
        isClosable: true,
      });
    },
  });

  const onDrop = (files: File[]) => {
    if (!files.length) return;
    onChange('');
    const [file] = files;
    const disapproved: boolean = isDisapproved || false;
    uploadFile({ variables: { file, jobId, type: imageType, disapproved } });
  };

  useEffect(() => {
    if (value) {
      onChange(value);
    }
  }, [value, onChange]);

  return (
    <>
      <FileDropInput isInEditing={isInEditing} value={value} onDrop={onDrop} isLoading={loading} />
    </>
  );
};

export default UploadImageInput;
