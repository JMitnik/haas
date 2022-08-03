import * as UI from '@haas/ui';
import { Clipboard, Download } from 'react-feather';
import { ThemeContext } from 'styled-components';
import { useClipboard } from '@chakra-ui/core';
import { useTranslation } from 'react-i18next';
import QRCode from 'qrcode.react';
import React, { useContext, useRef } from 'react';

interface ShareDialogueDropdownProps {
  dialogueName: string;
  shareUrl: string;
}

export const ShareDialogue = ({ dialogueName, shareUrl }: ShareDialogueDropdownProps) => {
  // @ts-ignore
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
    <UI.Card maxWidth={500}>
      <UI.CardBody>
        <UI.Div mb={4}>
          <UI.Text fontWeight={600} fontSize="1.3rem" color="gray.700">{t('dialogue:share_qr')}</UI.Text>
          <UI.Hr />
          <UI.Grid pt={2} gridTemplateColumns="1fr 1fr">
            <UI.Div>
              <UI.Text color="gray.500" fontSize="0.8rem">
                {t('dialogue:qr_download_helper')}
              </UI.Text>
            </UI.Div>
            <UI.ColumnFlex alignItems="center">
              <UI.Div ref={qrContainerRef}>
                {/* @ts-ignore */}
                <QRCode fgColor={qrColor} value={`${shareUrl}?origin=qrc`} />
              </UI.Div>
              <UI.Button
                margin="0 auto"
                onClick={handleDownload}
                as="a"
                variantColor="teal"
                mt={1}
                size="xs"
                leftIcon={() => <Download size={12} />}
              >
                <UI.Text ml={1}>Download</UI.Text>
              </UI.Button>
            </UI.ColumnFlex>
          </UI.Grid>
        </UI.Div>
        <UI.Div mb={4}>
          <UI.Text fontWeight={600} fontSize="1.3rem" color="gray.700">{t('dialogue:share_link')}</UI.Text>
          <UI.Hr />

          <UI.Flex>
            <UI.Div flexGrow={1} pt={2}>
              <UI.Input
                rightEl={(
                  <UI.Button width="auto" size="sm" onClick={onCopy} leftIcon={() => <Clipboard />}>
                    {hasCopied ? 'Copied' : 'Copy'}
                  </UI.Button>
                )}
                value={shareUrl}
                isReadOnly
              />
            </UI.Div>

          </UI.Flex>
        </UI.Div>
      </UI.CardBody>
    </UI.Card>
  );
};
