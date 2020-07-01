import { CheckCircle } from 'react-feather';
import { useForm } from 'react-hook-form';
import React from 'react';

import { ButtonIcon } from '@haas/ui/src/Buttons';
import { ClientButton, OutlineButton } from 'components/Buttons/Buttons';
import { Div, Grid, H3, Textbox } from '@haas/ui';
import { NodeTitle } from 'layouts/NodeLayout/NodeLayoutStyles';

import { GenericNodeProps } from '../types';
import { TextboxContainer } from './TextboxStyles';

interface TextboxNodeProps extends GenericNodeProps {
  isLeaf?: boolean;
}

const TextboxNode = ({ node, onEntryStore }: TextboxNodeProps) => {
  const { register, getValues, formState } = useForm({
    mode: 'onChange',
  });

  const { dirty } = formState;

  const onSubmit = () => {
    const formEntry = getValues({ nest: true });

    const entry: any = {
      textValue: formEntry.textValue,
      multiValues: null,
      numberValue: null,
    };

    onEntryStore(entry, formEntry.textValue);
  };

  return (
    <TextboxContainer>
      <NodeTitle>{node.title}</NodeTitle>
      <Div>
        <H3 color="white">What would you like to tell us?</H3>
        <Textbox placeholder="I have experienced ..." name="textValue" ref={register} />

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
