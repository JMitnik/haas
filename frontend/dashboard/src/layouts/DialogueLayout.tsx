import React, { useContext, useRef, useState } from 'react';

import { Activity, BarChart, Clipboard, Download, Mail, Menu, Share, Sliders, Zap } from 'react-feather';
import { Button, Icon, IconButton, Modal, ModalBody,
  ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useClipboard, useDisclosure } from '@chakra-ui/core';
import { ColumnFlex, Div, Flex, Grid, Hr, Input, StyledExtLink, Text, ViewContainer } from '@haas/ui';
import { NavLink } from 'react-router-dom';
import { Variants, motion } from 'framer-motion';
import { useHistory, useParams } from 'react-router';
import { useQuery } from '@apollo/react-hooks';
import { useTranslation } from 'react-i18next';
import QRCode from 'qrcode.react';
import gql from 'graphql-tag';
import styled, { ThemeContext, css } from 'styled-components/macro';
import useMediaDevice from 'hooks/useMediaDevice';
import useOnClickOutside from 'hooks/useClickOnOutside';

interface DialogueLayoutProps {
  children: React.ReactNode;
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

const DialogueNavBarContainer = motion.custom(styled(Div)`
  ${({ theme }) => css`
    height: 100%;
    background: ${theme.colors.primaries[600]};
    position: fixed;
    z-index: 1000;
    width: 220px;
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
      padding: 8px 6px;
      display: flex;
      align-items: center;
      font-size: 0.9rem;
      vertical-align: middle;

      &.active {
        background: ${theme.isDarkColor ? theme.colors.primaries['400'] : theme.colors.primaries['800']};
        border-radius: 5px;
        color: white;
      }
    }
  `}
`);

const DialogueNavBarContextHeading = styled(Text)`
  ${({ theme }) => css`
    color: ${theme.isDarkColor ? theme.colors.primaries['100'] : theme.colors.primaries['300']};
    font-size: 1rem;
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

interface ShareDialogueModalProps {
  dialogueName: string;
  shareUrl: string;
  onClose: () => void;
}

const ShareDialogueModal = ({ dialogueName, shareUrl, onClose }: ShareDialogueModalProps) => {
  const themeContext = useContext(ThemeContext);

  const qrColor = themeContext.colors.primary || '#FFFFFF';
  const qrContainerRef = useRef<HTMLDivElement>(null);

  const { onCopy, hasCopied } = useClipboard(shareUrl);

  const handleDownload = (): void => {
    if (!qrContainerRef.current) return;

    const canvas = qrContainerRef.current.querySelector('canvas');
    if (!canvas) return;

    const img = canvas.toDataURL('image/png');
    const anchor = document.createElement('a');
    anchor.href = img;
    anchor.download = `QRCode-${dialogueName}.png`;
    anchor.click();
  };

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
            <ColumnFlex alignItems="center">
              <Div ref={qrContainerRef}>
                <QRCode fgColor={qrColor} value={shareUrl} />
              </Div>
              <Button
                margin="0 auto"
                onClick={handleDownload}
                as="a"
                variantColor="teal"
                mt={1}
                size="xs"
                leftIcon={() => <Download size={12} />}
              >
                <Text ml={1}>Download</Text>
              </Button>
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

const IconButtonContainer = styled.div`
  ${({ theme }) => css`

    button {
      background: ${theme.colors.primaries['700']};
      margin-left: ${theme.gutter / 2}px;
    
      svg {
        padding: 4px;
        stroke: ${theme.colors.primaries['100']};
      }    
    }
  `}
`;

const DialogueNavBar = ({ dialogue, customerSlug, dialogueSlug }: DialogueNavBarProps) => {
  const { t } = useTranslation();
  const { onClose, onOpen, isOpen } = useDisclosure();
  const history = useHistory();

  const shareUrl = `https://client.haas.live/${customerSlug}/${dialogueSlug}`;

  return (
    <DialogueNavBarContainer>
      <Div mb={4}>
        <Flex>
          <DialogueNavBarContextHeading fontWeight={700}>
            {dialogue.title}
          </DialogueNavBarContextHeading>
          <IconButtonContainer>
            <IconButton
              onClick={() => (
                history.push(`/dashboard/b/${customerSlug}/d/${dialogueSlug}/edit`)
              )}
              fontSize="0.7rem"
              size="xs"
              variant="ghost"
              aria-label="settings"
              icon={Sliders}
            />
          </IconButtonContainer>
        </Flex>
        <Flex justifyContent="space-between">

          <Div color="primaries.200" flexGrow={0}>
            <Button size="xs" variant="ghost" onClick={onOpen}>
              <Share size={14} />
              <Text ml={1}>Share</Text>
            </Button>
            <Modal isOpen={isOpen} onClose={onClose}>
              <ModalOverlay />
              <ShareDialogueModal dialogueName={dialogueSlug} onClose={onClose} shareUrl={shareUrl} />
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

const FloatingBurgerContainer = styled.button`
  ${({ theme }) => css`
    background: white;
    width: 40px;
    height: 40px;
    border-radius: 100%;
    fill: ${theme.colors.primary};
    z-index: 700;
    position: fixed;
    top: ${theme.gutter}px;
    right: ${theme.gutter}px;
  `}
`;

const FloatingBurger = ({ onClick }: { onClick: any }) => (
  <FloatingBurgerContainer onClick={onClick}>
    <Icon as={Menu} />
  </FloatingBurgerContainer>
);

const menuAnimation: Variants = {
  open: { opacity: 1, x: 0 },
  closed: { opacity: 0, x: '-100%' },
};

const DialogueLayoutContainer = styled.div<{ isMobile: boolean }>`
  ${({ isMobile = false }) => css`
    ${!isMobile && css`
      display: grid;
      grid-template-columns: 220px 1fr;
    `}
  `}
`;

const DialogueLayout = ({ children }: DialogueLayoutProps) => {
  const { customerSlug, dialogueSlug } = useParams<{customerSlug: string, dialogueSlug: string}>();
  const device = useMediaDevice();

  const { data, loading } = useQuery(getSharedDialogueLayoutQuery, {
    variables: {
      customerSlug,
      dialogueSlug,
    },
  });
  const [showContextMenu, setShowContextMenu] = useState(!device.isSmall);

  const navBarRef = useRef<any>();

  useOnClickOutside(navBarRef, () => setShowContextMenu(false));

  const dialogue = data?.customer?.dialogue;

  if (loading || !dialogue) return <p>Loading!</p>;

  return (
    <>
      {device.isSmall && (
        <FloatingBurger onClick={() => setShowContextMenu((showState) => !showState)} />
      )}

      <DialogueLayoutContainer isMobile={device.isSmall}>
        <motion.div initial="closed" variants={menuAnimation} animate={showContextMenu || !device.isSmall ? 'open' : 'closed'}>
          <Div ref={navBarRef}>
            <DialogueNavBar customerSlug={customerSlug} dialogueSlug={dialogueSlug} dialogue={dialogue} />
          </Div>
        </motion.div>

        <Div overflow="hidden">
          <ViewContainer>
            {children}
          </ViewContainer>
        </Div>
      </DialogueLayoutContainer>
    </>
  );
};

export default DialogueLayout;
