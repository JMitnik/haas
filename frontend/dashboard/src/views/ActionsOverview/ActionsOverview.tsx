import { ApolloError } from 'apollo-boost';
import { Edit3, Plus, X } from 'react-feather';
import { useForm } from 'react-hook-form';
import { useHistory, useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/react-hooks';
import React, { useState } from 'react';
import Select from 'react-select';

import { Button, Div, Flex, Form, FormGroupContainer, Grid, H2, H3, Hr, Loader, Muted, Span, StyledInput, StyledLabel } from '@haas/ui';

import LinkIcon from 'components/Icons/LinkIcon';
import OpinionIcon from 'components/Icons/OpinionIcon';
import RegisterIcon from 'components/Icons/RegisterIcon';
import SearchBar from 'components/SearchBar/SearchBar';
import deleteCTAMutation from 'mutations/deleteCTA';
import getCTANodesQuery from 'queries/getCTANodes';
import getTopicBuilderQuery from 'queries/getQuestionnaireQuery';
import styled, { css } from 'styled-components/macro';
import updateCTAMutation from 'mutations/updateCTA';

interface ActionOverviewProps {
  leafs: Array<any>;
}

interface FormDataProps {
  title: string;
  ctaType: string;
}

const CTA_TYPES = [
  { label: 'Opinion', value: 'TEXTBOX' },
  { label: 'Register', value: 'REGISTRATION' },
  { label: 'Link', value: 'SOCIAL_SHARE' },
];

interface CTAEntryProps {
  id: string;
  title: string;
  type: { label: string, value: string };
  Icon: (props: any) => JSX.Element;
  activeCTA: string | null;
  onActiveCTAChange: React.Dispatch<React.SetStateAction<string | null>>;
}

const DialogueViewContainer = styled(Div)`
  ${({ theme }) => css`
    padding: ${theme.gutter * 2}px 0;
  `}
`;

const AddCTAButton = styled(Button)`
   ${({ theme, disabled }) => css`
    padding: 4px 0px;
    background-color: ${theme.colors.default.dark};
    font-size: 0.8em;
    color: ${theme.colors.default.darkest};
    border: 0px;
    min-width: 80px;
    display: flex;
    margin-left: 20px;
    ${!disabled && css`
      &:hover {
        transition: all 0.2s ease-in;
      box-shadow: 0 1px 3px 1px rgba(0,0,0,0.2) !important;
      }
    `}
    svg {
        margin-right: 2px;
        color: ${theme.colors.default.darkest};
        width: 10px;
        height: 10px;
    }
  `}
`;

const EditCTAButton = styled(Button)`
    ${({ theme, disabled }) => css`
    padding: 4px 0px;
    background-color: ${theme.colors.white};
    border: ${theme.colors.app.mutedOnWhite} 1px solid;
    border-radius: ${theme.borderRadiuses.subtleRounded};
    font-size: 0.8em;
    color: ${theme.colors.default.darkest};
    min-width: 80px;
    display: flex;
    ${!disabled && css`
      &:hover {
        transition: all 0.2s ease-in;
      box-shadow: 0 1px 3px 1px rgba(0,0,0,0.2) !important;
      }
    `}
    svg {
        margin-right: 10px;
        color: ${theme.colors.default.darkest};
        width: 10px;
        height: 10px;
    }
  `}
`;

const CTAEntryContainer = styled(Flex) <{ activeCTA: string | null, id: string }>`
 ${({ id, activeCTA, theme }) => css`
    position: relative;
    /* align-items: center;  */
    flex-direction: column;
    color: ${theme.colors.default.muted};

    ${!activeCTA && css`
    background-color: ${theme.colors.white};
    `};

    ${activeCTA === id && css`
    background-color: ${theme.colors.white};
    `};

    ${activeCTA && activeCTA !== id && css`
    background-color: ${theme.colors.white};
    opacity: 0.5;
    `};

    border: ${theme.colors.app.mutedOnDefault} 1px solid;
    padding: 20px;
    padding-left: 30px;
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
   ${({ disabled }) => css`
    ${!disabled && css`
        &:hover {
        transition: all 0.2s ease-in;
        opacity: 0.9;
        background: #e1e2e5;
      }
    `}
  `}
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
`;

const initializeCTAType = (type: string) => {
  if (type === 'OPINION') {
    return { label: 'Opinion', value: 'TEXTBOX' };
  }

  if (type === 'REGISTER') {
    return { label: 'Register', value: 'REGISTRATION' };
  }

  if (type === 'LINK') {
    return { label: 'Link', value: 'SOCIAL_SHARE' };
  }

  return { label: 'None', value: '' };
};

const CTAEntry = ({ id, activeCTA, onActiveCTAChange, title, type, Icon }: CTAEntryProps) => {
  const history = useHistory();
  const { customerSlug, dialogueSlug } = useParams();
  const { register, handleSubmit, setValue, errors } = useForm<FormDataProps>({
    // validationSchema: schema,
  });

  const [activeType, setActiveType] = useState<{ label: string, value: string }>(type);

  const handleMultiChange = (selectedOption: any) => {
    setValue('ctaType', selectedOption?.value);
    setActiveType(selectedOption);
  };

  const [deleteEntry] = useMutation(deleteCTAMutation, {
    variables: {
      id,
    },
    onError: (serverError: ApolloError) => {
      console.log(serverError);
    },
    refetchQueries: [{
      query: getCTANodesQuery,
      variables: {
        customerSlug,
        dialogueSlug,
      },
    }],
  });

  const [updateCTA, { loading }] = useMutation(updateCTAMutation, {
    onCompleted: () => {
      onActiveCTAChange(null);
    },
    onError: (serverError: ApolloError) => {
      console.log(serverError);
    },
    refetchQueries: [
      {
        query: getCTANodesQuery,
        variables: {
          customerSlug,
          dialogueSlug,
        },
      },
      {
        query: getTopicBuilderQuery,
        variables: {
          customerSlug,
          dialogueSlug,
        },
      }],
  });

  const onSubmit = (formData: FormDataProps) => {
    updateCTA({
      variables: {
        id,
        title: formData.title,
        type: formData.ctaType || undefined,
      },
    });
  };

  return (
    <CTAEntryContainer id={id} activeCTA={activeCTA}>
      <DeleteButtonContainer disabled={(!!activeCTA && activeCTA !== id) || false} onClick={() => deleteEntry()}>
        <X />
      </DeleteButtonContainer>
      <Flex flexDirection="row" width="100%">
        <Flex flexDirection="column" marginRight="50px">
          <Flex flexDirection="column" alignItems="center" justifyContent="center">
            <CTAEntryIcon>
              <Icon />
            </CTAEntryIcon>
            <Span marginTop="5px" fontSize="0.6em" color="default.darker">
              {type.label}
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

        <Flex width="30%" alignItems="center" justifyContent="center">
          {/* <EditCTAButton onClick={() => history.push(`/dashboard/b/${customerSlug}/d/${dialogueSlug}/actions/${id}/edit`)}> */}
          <EditCTAButton disabled={(activeCTA && activeCTA !== id) || false} onClick={() => onActiveCTAChange(id)}>
            <Edit3 />
            <Span>
              Edit
            </Span>
          </EditCTAButton>
        </Flex>
      </Flex>

      {activeCTA === id
        && (
          <Form onSubmit={handleSubmit(onSubmit)}>
            <FormGroupContainer>
              <Grid gridTemplateColumns={['1fr', '1fr 2fr']} gridColumnGap={4}>
                <Div py={4} pr={4}>
                  <H3 color="default.text" fontWeight={500} pb={2}>General Call-to-Action information</H3>
                  <Muted>
                    General information about the CAT, such as title, type, etc.
                  </Muted>
                </Div>
                <Div py={4}>
                  <Grid gridTemplateColumns={['1fr', '1fr 1fr']}>
                    <Flex flexDirection="column" gridColumn="1 / -1">
                      <StyledLabel>Title</StyledLabel>
                      <StyledInput name="title" defaultValue={title} ref={register({ required: true })} />
                      {errors.title && <Muted color="warning">Something went wrong!</Muted>}
                    </Flex>
                    <Div useFlex flexDirection="column">
                      <StyledLabel>Type</StyledLabel>
                      <Select
                        ref={() => register({
                          name: 'ctaType',
                          required: true,
                          validate: (value) => (Array.isArray(value) ? value.length > 0 : !!value),
                        })}
                        options={CTA_TYPES}
                        value={activeType}
                        onChange={(qOption: any) => {
                          handleMultiChange(qOption);
                        }}
                      />
                      {errors.ctaType && (
                        <Muted color="warning">
                          {errors.ctaType.message}
                        </Muted>
                      )}
                    </Div>
                  </Grid>
                </Div>
              </Grid>
            </FormGroupContainer>

            <Div>
              <Flex>
                <Button brand="primary" mr={2} type="submit">Save CTA</Button>
                <Button brand="default" type="button" onClick={() => onActiveCTAChange(null)}>Cancel</Button>
              </Flex>
            </Div>
          </Form>
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
          <AddCTAButton disabled={!!activeCTA || false} onClick={() => history.push(`/dashboard/b/${customerSlug}/d/${dialogueSlug}/actions/add`)}>
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
        (leaf: any) => <CTAEntry activeCTA={activeCTA} onActiveCTAChange={setActiveCTA} id={leaf.id} Icon={leaf.icon} title={leaf.title} type={initializeCTAType(leaf.type)} />,
      )}
    </DialogueViewContainer>
  );
};

export default ActionsPage;
