import React from 'react';

import { Div, ExtLink, Flex, H2, PageHeading, Span } from '@haas/ui';
import { MapPin, User } from 'react-feather';
import { ReactComponent as UrlIcon } from 'assets/icons/icon-link.svg';
import { useParams } from 'react-router';
import { useQuery } from '@apollo/react-hooks';
import Placeholder from 'components/Placeholder';
import SliderNodeIcon from 'components/Icons/SliderNodeIcon';
import Tabbar, { Tab } from 'components/Tabbar/Tabbar';
import gql from 'graphql-tag';
import styled, { css } from 'styled-components/macro';

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
      <Flex mb={4}>
        {dialogue?.tags?.length === 1 && (
          <Span pr={3}>
            <TagIcon type={dialogue.tags[0].type} />
          </Span>
        )}

        <Div>
          {dialogue?.title ? (
            <H2 mb={1}>{dialogue?.title}</H2>
        ) : (
          <Placeholder height="30px" width="140px" mb={4} />
        )}

          <DialogueSubHeaderContainer>
            <UrlIcon />
            {/* TODO: Sanitize */}
            <ExtLink to={`https://haas-client.netlify.app/${customerSlug}/${dialogueSlug}`}>
              {`haas.live/${customerSlug}/${dialogueSlug}`}
            </ExtLink>
          </DialogueSubHeaderContainer>
        </Div>
      </Flex>

      <Tabbar>
        <Tab to={`/dashboard/b/${customerSlug}/d/${dialogueSlug}`} exact>General</Tab>
        <Tab to={`/dashboard/b/${customerSlug}/d/${dialogueSlug}/interactions`}>Interactions</Tab>
        <Tab to={`/dashboard/b/${customerSlug}/d/${dialogueSlug}/actions`}>Actions</Tab>
        <Tab to={`/dashboard/b/${customerSlug}/d/${dialogueSlug}/builder`}>Builder</Tab>
        <Tab to={`/dashboard/b/${customerSlug}/d/${dialogueSlug}/builder2`}>BuilderV2</Tab>
        <Tab to={`/dashboard/b/${customerSlug}/d/${dialogueSlug}/edit`}>Settings</Tab>
      </Tabbar>

      {children}
    </>

  );
};

export default DialogueLayout;
