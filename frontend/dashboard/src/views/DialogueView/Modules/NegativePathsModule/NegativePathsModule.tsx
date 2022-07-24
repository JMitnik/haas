import * as UI from '@haas/ui';
import React from 'react';
import styled, { css } from 'styled-components';

import { Frown } from 'react-feather';
import { Icon } from '@chakra-ui/core';
import { useTranslation } from 'react-i18next';
import FallbackContainer from '../FallbackContainer';
import ModuleContainer from '../Module';

const NegativePathsModuleList = styled.ol`
  ${({ theme }) => css`
    list-style: none;
    padding: 12px 0 0 0 !important;
    counter-reset: item;

    li {
      counter-increment: item;
      color: ${theme.colors.default.darkest};
      padding: 18px 24px;

      &:last-of-type {
        border-bottom: 0;
      }

      &::before {
        transform: translateX(-18px);
        content: counter(item);
        display: inline-block;
        color: ${theme.colors.default.darker};
        border: 2px solid #f7f8fb;
        padding: 4px;
        font-size: 0.7rem;
      }
    }
  `}
`;

const NegativePathsModule = ({ negativePaths }: { negativePaths: any }) => {
  const { t } = useTranslation();
  return (
    <ModuleContainer>
      <UI.Card height="100%" bg="white">
        <UI.CardBody display="flex" flexDirection="column" height="100%">
          <UI.Text fontSize="1.3rem" color="red.200">{t('dialogue:top_negative_paths')}</UI.Text>
          <UI.Flex marginTop="10px" flexGrow={1} flexDirection="column">
            {negativePaths?.length > 0 && (
              <NegativePathsModuleList>
                {negativePaths.map(({ answer, quantity }: { answer: string, quantity: number }) => (
                  <li key={`${answer}-${quantity}`}>
                    {`${answer}`}
                  </li>
                ))}
              </NegativePathsModuleList>
            )}
          </UI.Flex>
        </UI.CardBody>
        {!negativePaths?.length && (
          <FallbackContainer>
            <UI.Text
              fontWeight="600"
              fontSize="1.2rem"
              color="gray.400"
            >
              {t('dialogue:fallback_no_negative_paths')}
            </UI.Text>
            <UI.Div>
              <Icon size="175px" color="gray.50" as={Frown} />
            </UI.Div>
          </FallbackContainer>
        )}
      </UI.Card>
    </ModuleContainer>
  );
};

export default NegativePathsModule;
