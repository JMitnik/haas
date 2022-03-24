import { CheckCircle } from 'react-feather';
import { useForm } from 'react-hook-form';
import React from 'react';

import { ClientButton, OutlineButton } from 'components/Buttons/Buttons';
import { Div, Grid, Textbox } from '@haas/ui';
import { NodeTitle } from 'layouts/NodeLayout/NodeLayoutStyles';
import { SessionEntryDataProps } from 'models/Session/SessionEntryModel';

import { GenericNodeProps } from '../types';
import { TextboxContainer } from './TextboxStyles';

interface TextboxNodeProps extends GenericNodeProps {}

const TextboxNode = ({ node, onEntryStore }: TextboxNodeProps) => {
  const { register, getValues, formState } = useForm<{ textbox: string }>({
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
      <NodeTitle>{node?.title}</NodeTitle>
      <Div>
        <Textbox name="textbox" ref={register} />

        <Div mt={4}>
          <Grid gridTemplateColumns={['1fr 1fr', '1fr 1fr', '2fr 1fr']}>
            <ClientButton
              leftIcon={<CheckCircle />}
              isDisabled={!dirty}
              isActive={dirty}
              onClick={() => onSubmit()}
            >
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
