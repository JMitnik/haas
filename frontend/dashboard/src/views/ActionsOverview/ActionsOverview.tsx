import { Edit3, Plus, X } from 'react-feather';
import { useHistory, useParams } from 'react-router-dom';
import React, { useState } from 'react';

import { ApolloError } from 'apollo-boost';
import { Button, Div, Flex, H2, Loader, Span } from '@haas/ui';
import { useMutation, useQuery } from '@apollo/react-hooks';
import LinkIcon from 'components/Icons/LinkIcon';
import OpinionIcon from 'components/Icons/OpinionIcon';
import RegisterIcon from 'components/Icons/RegisterIcon';
import SearchBar from 'components/SearchBar/SearchBar';
import deleteCTAMutation from 'mutations/deleteCTA';
import getCTANodesQuery from 'queries/getCTANodes';
import styled, { css } from 'styled-components/macro';

interface ActionOverviewProps {
  leafs: Array<any>;
}

interface CTAEntryProps {
  id: string;
  title: string;
  type: string;
  Icon: (props: any) => JSX.Element;
  activeCTA: string | null;
  onActiveCTAChange: (cta: string) => void;
}

const DialogueViewContainer = styled(Div)`
  ${({ theme }) => css`
    padding: ${theme.gutter * 2}px 0;
  `}
`;

const AddCTAButton = styled(Button)`
   ${({ theme }) => css`
    padding: 4px 0px;
    background-color: ${theme.colors.default.dark};
    font-size: 0.8em;
    color: ${theme.colors.default.darkest};
    border: 0px;
    min-width: 80px;
    display: flex;
    margin-left: 20px;
    &:hover {
      transition: all 0.2s ease-in;
      box-shadow: 0 1px 3px 1px rgba(0,0,0,0.2) !important;
    }
    svg {
        margin-right: 2px;
        color: ${theme.colors.default.darkest};
        width: 10px;
        height: 10px;
    }
  `}
`;

const EditCTAButton = styled(Button)`
    ${({ theme }) => css`
    padding: 4px 0px;
    background-color: ${theme.colors.white};
    border: ${theme.colors.app.mutedOnWhite} 1px solid;
    border-radius: ${theme.borderRadiuses.subtleRounded};
    font-size: 0.8em;
    color: ${theme.colors.default.darkest};
    min-width: 80px;
    display: flex;
    &:hover {
      transition: all 0.2s ease-in;
      box-shadow: 0 1px 3px 1px rgba(0,0,0,0.2) !important;
    }
    svg {
        margin-right: 10px;
        color: ${theme.colors.default.darkest};
        width: 10px;
        height: 10px;
    }
  `}
`;

const CTAEntryContainer = styled(Flex)`
 ${({ theme }) => css`
    position: relative;
    align-items: center; 
    flex-direction: row;
    color: ${theme.colors.default.muted};
    background-color: ${theme.colors.white};
    border: ${theme.colors.app.mutedOnDefault} 1px solid;
    padding: 20px;
    margin-bottom: 20px;
    border-radius: ${theme.borderRadiuses.somewhatRounded};
 `}
`;

const OverflowSpan = styled(Span)`
  ${({ theme }) => css`
    color: ${theme.colors.default.darkest};
  `}
  font-size: 1.2em;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

const CTAEntryIcon = styled(Div)`
   ${({ theme }) => css`
    color: ${theme.colors.white};
    background-color: ${theme.colors.default.darker};
    padding: 14px;
    border-radius: ${theme.borderRadiuses.somewhatRounded};
  `}
`;

export const DeleteButtonContainer = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  border: none;
  background: #f6f7f9;
  color: #a1a2a5;
  padding: 7.5px;
  border-radius: 100%;

  svg {
    width: 15px;
    height: 15px;
  }

  opacity: 0.7;
  cursor: pointer;
  transition: all 0.2s ease-in;

  &:hover {
    transition: all 0.2s ease-in;
    opacity: 0.9;
    background: #e1e2e5;
  }
`;

const CTAEntry = ({ id, activeCTA, onActiveCTAChange, title, type, Icon }: CTAEntryProps) => {
  const history = useHistory();
  const { customerSlug, dialogueSlug } = useParams();

  const [deleteEntry] = useMutation(deleteCTAMutation, { variables: {
    id,
  },
  onError: (serverError: ApolloError) => {
    console.log(serverError);
  },
  refetchQueries: [{ query: getCTANodesQuery,
    variables: {
      customerSlug,
      dialogueSlug,
    } }] });

  return (
    <CTAEntryContainer>
      <DeleteButtonContainer onClick={() => deleteEntry()}>
        <X />
      </DeleteButtonContainer>
      <Flex width="10%" flexDirection="column">
        <Flex flexDirection="column" alignItems="center" justifyContent="center">
          <CTAEntryIcon>
            <Icon />
          </CTAEntryIcon>
          <Span marginTop="5px" fontSize="0.6em" color="default.darker">
            {type}
          </Span>
        </Flex>

      </Flex>

      <Flex width="60%" flexDirection="column">
        <Span fontSize="1.4em">
          Title
        </Span>
        <OverflowSpan>
          {title}
        </OverflowSpan>
      </Flex>

      <Flex width="30%" justifyContent="center">
        {/* <EditCTAButton onClick={() => history.push(`/dashboard/b/${customerSlug}/d/${dialogueSlug}/actions/${id}/edit`)}> */}
        <EditCTAButton onClick={() => onActiveCTAChange(id)}>
          <Edit3 />
          <Span>
            Edit
          </Span>
        </EditCTAButton>
      </Flex>

      {activeCTA === id
        && (
        <Flex>
          Yea
        </Flex>
        )}

    </CTAEntryContainer>
  );
};

const ActionsPage = () => {
  const { dialogueSlug, customerSlug } = useParams();
  const { data, loading } = useQuery(getCTANodesQuery, {
    variables: {
      dialogueSlug,
      customerSlug,
    },
  });

  const leafs = data?.customer?.dialogue?.leafs;

  if (!leafs) return <Loader />;

  const mappedLeafs = leafs.map((leaf: any) => {
    if (leaf.type === 'SOCIAL_SHARE') {
      return { ...leaf, type: 'LINK', icon: LinkIcon };
    }
    if (leaf.type === 'REGISTRATION') {
      return { ...leaf, type: 'REGISTER', icon: RegisterIcon };
    }
    if (leaf.type === 'TEXTBOX') {
      return { ...leaf, type: 'OPINION', icon: OpinionIcon };
    }
  });

  return (
    <ActionOverview leafs={mappedLeafs} />
  );
};

const ActionOverview = ({ leafs }: ActionOverviewProps) => {
  const history = useHistory();
  const { customerSlug, dialogueSlug } = useParams();
  const handleSearchTerm = () => null;
  const [activeCTA, setActiveCTA] = useState<null | string>(null);

  return (
    <DialogueViewContainer>
      <Flex flexDirection="row" justifyContent="space-between">
        <Flex marginBottom="20px" flexDirection="row" alignItems="center" width="50%">
          <H2 color="default.darkest" fontWeight={500} py={2}>Call-to-Actions</H2>
          <AddCTAButton onClick={() => history.push(`/dashboard/b/${customerSlug}/d/${dialogueSlug}/actions/add`)}>
            <Plus />
            <Span>
              Add
            </Span>
          </AddCTAButton>
        </Flex>
        <Div width="40%">
          <SearchBar activeSearchTerm="" onSearchTermChange={handleSearchTerm} />
        </Div>
      </Flex>
      {leafs && leafs.map(
        (leaf: any) => <CTAEntry activeCTA={activeCTA} onActiveCTAChange={setActiveCTA} id={leaf.id} Icon={leaf.icon} title={leaf.title} type={leaf.type} />,
      )}
    </DialogueViewContainer>
  );
};

export default ActionsPage;
