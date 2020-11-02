import { CheckCircle } from 'react-feather';
import { useForm } from 'react-hook-form';
import React from 'react';

import { ButtonIcon } from '@haas/ui/src/Buttons';
import { ClientButton, OutlineButton } from 'components/Buttons/Buttons';
import { Div, Grid, H3, Textbox } from '@haas/ui';
import { NodeTitle } from 'layouts/NodeLayout/NodeLayoutStyles';
import { SessionEntryDataProps } from 'models/Session/SessionEntryModel';

import ReactMarkdown from 'react-markdown';
import { GenericNodeProps } from '../types';
import { TextboxContainer } from './TextboxStyles';

interface TextboxNodeProps extends GenericNodeProps {
  isLeaf?: boolean;
}

const TextboxNode = ({ node, onEntryStore }: TextboxNodeProps) => {
  const { register, getValues, formState } = useForm<{textbox: string}>({
    mode: 'onChange',
  });

  const { dirty } = formState;

  const onSubmit = () => {
    const formEntry = getValues({ nest: true }).textbox;

    const entry: SessionEntryDataProps = {
      textbox: { value: formEntry },
      choice: undefined,
      register: undefined,
      slider: undefined,
    };

    onEntryStore(entry, formEntry);
  };

  return (
    <TextboxContainer>
      <NodeTitle><ReactMarkdown>{node.title}</ReactMarkdown></NodeTitle>
      <Div>
        <Textbox name="textbox" ref={register} />

        <Div mt={4}>
          <Grid gridTemplateColumns="2fr 1fr">
            <ClientButton disabled={!dirty} isActive={dirty} onClick={() => onSubmit()}>
              <ButtonIcon>
                <CheckCircle />
              </ButtonIcon>
              Submit
            </ClientButton>

            <OutlineButton onClick={() => onSubmit()}>Do not share</OutlineButton>
          </Grid>
        </Div>
      </Div>
    </TextboxContainer>
  );
};

export default TextboxNode;
