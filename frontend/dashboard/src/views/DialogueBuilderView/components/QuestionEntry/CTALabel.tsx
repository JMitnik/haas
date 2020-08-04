import { Flex } from '@haas/ui';
import React from 'react';

import LinkIcon from 'components/Icons/LinkIcon';
import OpinionIcon from 'components/Icons/OpinionIcon';
import RegisterIcon from 'components/Icons/RegisterIcon';

import { LinkContainer, TypeSpan } from './QuestionEntryStyles';

const CTALabel = ({ question }: { question: any }) => (
  <LinkContainer data-cy="CTALabel" hasCTA={!!question.overrideLeaf?.id}>
    <Flex
      flexDirection="column"
      padding="25px"
      minWidth="80px"
      color="black"
      justifyContent="center"
      alignItems="center"
    >
      {(!question.overrideLeaf?.type || question.overrideLeaf?.type === 'Link') && (
        <LinkIcon isCTA hasCTA />
      )}

      {question.overrideLeaf?.type === 'Opinion' && (
        <OpinionIcon isCTA hasCTA />
      )}

      {question.overrideLeaf?.type === 'Register' && (
        <RegisterIcon isCTA hasCTA />
      )}

      <TypeSpan fontSize="0.5em">
        {question.overrideLeaf?.type || 'None'}
      </TypeSpan>
    </Flex>
  </LinkContainer>
);

export default CTALabel;
