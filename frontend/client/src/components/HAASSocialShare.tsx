import React from 'react';
import { Flex, Div } from '@haas/ui';
import { Instagram, Facebook, Twitter, Linkedin } from 'react-feather';
import styled from 'styled-components';

const ShareItem = styled(Div)`
  border-radius: 100%;
  padding: 16px;
  display: flex;
  margin: 5px;

  svg {
    height: 50px;
    width: 50px;
  }
`;


export const HAASSocialShare = () => {
  return (
    <>
      <Flex justifyContent="center" alignItems="center">

        <ShareItem backgroundColor="#1da1f2">
          <Twitter stroke="none" fill="white" />
        </ShareItem >

        <ShareItem backgroundColor="#1877f2">
          <Facebook stroke="none" fill="white"/>
        </ShareItem>

        <ShareItem bg="#c32aa3">
          <Instagram stroke="white"/>
        </ShareItem>

        <ShareItem bg="#007bb5">
          <Linkedin stroke="none" fill="white"/>
        </ShareItem>
      </Flex>

    </>
  )
}
