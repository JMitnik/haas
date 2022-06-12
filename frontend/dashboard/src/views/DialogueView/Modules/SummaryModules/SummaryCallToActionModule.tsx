import * as UI from '@haas/ui';
import { useHistory, useParams } from 'react-router';
import React from 'react';

const SummaryCallToActionModule = ({ callToActionCount }: { callToActionCount: number }) => {
  const { customerSlug, dialogueSlug } = useParams<{ customerSlug: string, dialogueSlug: string }>();
  const history = useHistory();

  return (
    <UI.NewCard bg="white" onClick={() => history.push(`/dashboard/b/${customerSlug}/d/${dialogueSlug}/interactions`)}>
      <UI.CardBody useFlex flexDirection="column" justifyContent="space-between" height="100%">
        <UI.H3 color="tertiary">
          <UI.Flex justifyContent="space-between" alignItems="center">
            <UI.Span>Call to actions</UI.Span>
          </UI.Flex>
        </UI.H3>
        <UI.Paragraph color="app.onWhite" mt={4}>
          {!callToActionCount ? (
            <UI.H2 color="default.darkest" mb={2}>No call to actions yet</UI.H2>
          ) : (
            <p>
              <UI.H2 color="default.darkest">
                {callToActionCount}
              </UI.H2>
              {' '}
              <UI.Span color="default.darker">
                user(s) have interacted with the call to actions

                is the score of this dialogue
              </UI.Span>
            </p>
          )}
        </UI.Paragraph>
      </UI.CardBody>
    </UI.NewCard>
  );
};

export default SummaryCallToActionModule;
