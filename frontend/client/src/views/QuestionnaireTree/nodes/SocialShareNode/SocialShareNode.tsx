import React, { useEffect } from 'react';
import { Flex } from '@haas/ui';
import { Instagram, Facebook, Twitter, Linkedin } from 'react-feather';
import { useMutation } from '@apollo/react-hooks';
import uploadEntryMutation from 'mutations/UploadEntryMutation';
import useHAASTree from 'hooks/use-haas-tree';
import { ShareItem } from './SocialShareNodeStyles';
import { GenericNodeProps } from '../Node';

type SocialShareNodeProps = GenericNodeProps;

const SocialShareNode = ({ isLeaf }: SocialShareNodeProps) => {
  const [submitForm] = useMutation(uploadEntryMutation, {});
  const { entryHistoryStack } = useHAASTree();

  useEffect(() => {
    if (entryHistoryStack && submitForm && isLeaf) {
      submitForm({
        variables: {
          uploadUserSessionInput: { entries: entryHistoryStack }
        }
      });
    }
  }, [entryHistoryStack, submitForm, isLeaf]);

  return (
    <>
      <Flex justifyContent="center" alignItems="center">
        <ShareItem backgroundColor="#1da1f2">
          <Twitter stroke="none" fill="white" />
        </ShareItem>

        <ShareItem backgroundColor="#1877f2">
          <Facebook stroke="none" fill="white" />
        </ShareItem>

        <ShareItem bg="#c32aa3">
          <Instagram stroke="white" />
        </ShareItem>

        <ShareItem bg="#007bb5">
          <Linkedin stroke="none" fill="white" />
        </ShareItem>
      </Flex>
    </>
  );
};

export default SocialShareNode;
