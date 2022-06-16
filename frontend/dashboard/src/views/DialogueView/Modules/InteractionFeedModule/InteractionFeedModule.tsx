import * as UI from '@haas/ui';
import { Info } from 'react-feather';
import { useTranslation } from 'react-i18next';
import React from 'react';

import { Session } from 'types/generated-types';

import { InteractionFeedEntriesContainer } from './InteractionFeedModuleStyles';
import InteractionFeedEntry from './InteractionFeedEntry';

const InteractionFeedModule = ({ interactions }: { interactions: Session[] }) => {
  const { t } = useTranslation();

  return (
    <UI.Card bg="white">
      <UI.CardBody useFlex height="100%" flexDirection="column">
        <UI.Text mb={2} fontSize="1.2rem" color="gray.400">{t('latest_interactions')}</UI.Text>

        <InteractionFeedEntriesContainer>
          {interactions?.length > 0 && interactions?.map((interaction, index) => (
            <InteractionFeedEntry
              key={index}
              interaction={interaction}
            />
          ))}
        </InteractionFeedEntriesContainer>

        {(interactions?.length === 0 || (!interactions)) && (
          <UI.Flex flexGrow={1} justifyContent="center" alignItems="center">
            <UI.Div color="default.darker" marginRight="5px">
              <Info />
            </UI.Div>
            <UI.H4 color="default.darker">No data available</UI.H4>
          </UI.Flex>
        )}
      </UI.CardBody>
    </UI.Card>
  );
};

export default InteractionFeedModule;
