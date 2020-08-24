import React, { useContext, useRef } from 'react';

import { Activity, BarChart, Clipboard, Download, List, Mail, MapPin, Settings, Share, Triangle, User, Zap } from 'react-feather';
import { Button, Icon, IconButton, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useClipboard, useDisclosure } from '@chakra-ui/core';
import { ColumnFlex, Div, ExtLink, Flex, Grid, H2, Hr, Input, Span, StyledExtLink, Text } from '@haas/ui';
import { Link, NavLink } from 'react-router-dom';
import { ReactComponent as UrlIcon } from 'assets/icons/icon-link.svg';
import { useParams } from 'react-router';
import QRCode from 'qrcode.react';

import { useQuery } from '@apollo/react-hooks';
import { useTranslation } from 'react-i18next';
import Placeholder from 'components/Placeholder';
import SliderNodeIcon from 'components/Icons/SliderNodeIcon';
import Tabbar, { Tab } from 'components/Tabbar/Tabbar';
import gql from 'graphql-tag';
import styled, { ThemeContext, css } from 'styled-components/macro';

interface DialogueLayoutProps {
  children: React.ReactNode;
  dialogueTitle?: string;
}

const getSharedDialogueLayoutQuery = gql`
  query sharedDialogueLayoutProps($customerSlug: String!, $dialogueSlug: String!) {
    customer(slug: $customerSlug) {
      id
      dialogue(where: { slug: $dialogueSlug }) {
        title
        tags {
          type
        }
      }
    }
  }
`;

const TagIconContainer = styled.span`
  ${({ theme }) => css`
    background: ${theme.colors.primary};
    display: inline-block;
    text-align: center;
    padding: 8px;
    border-radius: ${theme.borderRadiuses.somewhatRounded};

    svg {
      fill: white;
      stroke: transparent;
    }
  `}
`;

const DialogueSubHeaderContainer = styled(Flex)`
  ${({ theme }) => css`
    color: ${theme.colors.app.mutedAltOnDefault};

    svg {
      width: 18px;
      margin-right: ${theme.gutter / 4}px;
      fill: currentColor;
    }
  `}
`;

const TagIcon = ({ type }: { type: any }) => (
  <TagIconContainer>
    {type === 'LOCATION' && (
      <MapPin />
    )}

    {type === 'AGENT' && (
      <User />
    )}

    {type === 'DEFAULT' && (
      <SliderNodeIcon color="black" />
    )}
  </TagIconContainer>
);

const DialogueNavBarContainer = styled(Div)`
  ${({ theme }) => css`
    height: 100%;
    background: ${theme.colors.primaries[600]};
    position: fixed;
    width: 250px;
    top: 0;
    bottom: 0;
    padding: ${theme.gutter}px ${theme.gutter}px;

    ${StyledExtLink} {
      padding: 0;
      font-size: 0.7rem;
    }

    ${Hr} {
      border-color: ${theme.isDarkColor ? theme.colors.primaries['400'] : theme.colors.primaries['300']};
      padding: ${theme.gutter / 4}px;
    }

    a {
      color: ${theme.isDarkColor ? theme.colors.primaries['100'] : theme.colors.primaries['300']};
      font-weight: 600;
      padding: 10px 8px;
      display: flex;
      align-items: center;
      vertical-align: middle;

      &.active {
        background: ${theme.isDarkColor ? theme.colors.primaries['400'] : theme.colors.primaries['800']};
        border-radius: 5px;
        color: white;
      }
    }
  `}
`;

const DialogueNavBarContextHeading = styled(Text)`
  ${({ theme }) => css`
    color: ${theme.isDarkColor ? theme.colors.primaries['100'] : theme.colors.primaries['300']};
    font-size: 1.4rem;
  `}
`;

const DialogueNavBarHeading = styled(Text)`
  ${({ theme }) => css`
    font-size: 0.8rem;
    color: ${theme.isDarkColor ? theme.colors.primaries['200'] : theme.colors.primaries['300']};
    font-weight: 800;
  `}
`;

interface DialogueNavBarProps {
  dialogue: any;
  customerSlug: string;
  dialogueSlug: string;
}

const ShareDialogueModal = ({ shareUrl, onClose }: { shareUrl: string, onClose: any }) => {
  const themeContext = useContext(ThemeContext);

  const qrColor = themeContext.colors.primary || '#FFFFFF';
  // const qrRef = useRef<HTMLCanvasElement>();

  const { onCopy, hasCopied } = useClipboard(shareUrl);

  const { t } = useTranslation();

  return (
    <ModalContent>
      <ModalHeader>Share</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <Div mb={4}>
          <Text fontWeight={600} fontSize="1.3rem" color="gray.700">Method one: Share QR Code</Text>
          <Hr />
          <Grid pt={2} gridTemplateColumns="1fr 1fr">
            <Div>
              <Text color="gray.500" fontSize="0.8rem">
                {t('dialogue:qr_download_helper')}
              </Text>
            </Div>
            <ColumnFlex alignItems="flex-end">
              <QRCode fgColor={qrColor} value={shareUrl} />
              <Button variantColor="teal" mt={1} size="sm" leftIcon={Download}>Download</Button>
            </ColumnFlex>
          </Grid>
        </Div>
        <Div mb={4}>
          <Text fontWeight={600} fontSize="1.3rem" color="gray.700">Method two: Share URL to link</Text>
          <Hr />

          <Flex>
            <Div flexGrow={1} pt={2}>
              <Input
                rightEl={(
                  <Button width="auto" size="sm" onClick={onCopy} leftIcon={Clipboard}>
                    {hasCopied ? 'Copied' : 'Copy'}
                  </Button>
)}

                value={shareUrl}
                isReadOnly
              />
            </Div>

          </Flex>
        </Div>
      </ModalBody>

      <ModalFooter>
        <Button variant="outline" mr={3} onClick={onClose}>
          Close
        </Button>
      </ModalFooter>
    </ModalContent>
  );
};

const DialogueNavBar = ({ dialogue, customerSlug, dialogueSlug }: DialogueNavBarProps) => {
  const { t } = useTranslation();
  const { onClose, onOpen, isOpen } = useDisclosure();

  const shareUrl = `https://client.haas.live/${customerSlug}/${dialogueSlug}`;

  return (
    <DialogueNavBarContainer>
      <Div mb={4}>
        <DialogueNavBarContextHeading fontWeight={700}>
          {dialogue.title}
        </DialogueNavBarContextHeading>
        <Flex justifyContent="space-between">
          {/* <ExtLink to={`https://client.haas.live/${customerSlug}/${dialogueSlug}`}>
            {shareUrl}
          </ExtLink> */}

          <Div color="primaries.200" flexGrow={0}>
            <Button size="xs" variant="ghost" onClick={onOpen}>
              <Share size={14} />
              <Text ml={1}>Share</Text>
            </Button>
            <Modal isOpen={isOpen} onClose={onClose}>
              <ModalOverlay />
              <ShareDialogueModal onClose={onClose} shareUrl={shareUrl} />
            </Modal>
          </Div>

        </Flex>
      </Div>
      <Text />

      <ColumnFlex>
        <Div mb={4}>
          <DialogueNavBarHeading mb={1} mt={2} fontWeight="400" color="primaries.100">Analytics</DialogueNavBarHeading>
          <Hr />
          <NavLink exact to={`/dashboard/b/${customerSlug}/d/${dialogueSlug}`}>
            <Icon mr={2} as={BarChart} />
            {t('views:dialogue_view')}
          </NavLink>
          <NavLink to={`/dashboard/b/${customerSlug}/d/${dialogueSlug}/interactions`}>
            <Icon mr={2} as={Activity} />
            {t('views:interactions_view')}
          </NavLink>
        </Div>
        <Div>
          <DialogueNavBarHeading mb={1} mt={2} fontWeight="400" color="primaries.100">Customize</DialogueNavBarHeading>
          <Hr />
          <NavLink to={`/dashboard/b/${customerSlug}/d/${dialogueSlug}/actions`}>
            <Icon mr={2} as={Mail} />
            {t('views:cta_view')}
          </NavLink>
          <NavLink to={`/dashboard/b/${customerSlug}/d/${dialogueSlug}/builder`}>
            <Icon mr={2} as={Zap} />
            {t('views:builder_view')}
          </NavLink>
        </Div>
      </ColumnFlex>
    </DialogueNavBarContainer>
  );
};

const DialogueLayout = ({ children }: DialogueLayoutProps) => {
  const { customerSlug, dialogueSlug } = useParams<{customerSlug: string, dialogueSlug: string}>();

  const { data, loading } = useQuery(getSharedDialogueLayoutQuery, {
    variables: {
      customerSlug,
      dialogueSlug,
    },
  });

  const dialogue = data?.customer?.dialogue;

  if (loading || !dialogue) return <p>Loading!</p>;

  return (
    <>
      <Grid gridTemplateColumns="250px 1fr">
        <Div>
          <DialogueNavBar customerSlug={customerSlug} dialogueSlug={dialogueSlug} dialogue={dialogue} />
        </Div>
        <Div overflow="hidden">
          {children}
        </Div>
      </Grid>
      {/* <Tabbar data-cy="DialogueTabbar">
        <Tab to={`/dashboard/b/${customerSlug}/d/${dialogueSlug}`} exact>General</Tab>
        <Tab to={`/dashboard/b/${customerSlug}/d/${dialogueSlug}/interactions`}>Interactions</Tab>
        <Tab to={`/dashboard/b/${customerSlug}/d/${dialogueSlug}/actions`}>Actions</Tab>
        <Tab to={`/dashboard/b/${customerSlug}/d/${dialogueSlug}/builder`}>Builder</Tab>
        <Tab to={`/dashboard/b/${customerSlug}/d/${dialogueSlug}/edit`}>Settings</Tab>
      </Tabbar> */}
    </>
  );
};

export default DialogueLayout;
