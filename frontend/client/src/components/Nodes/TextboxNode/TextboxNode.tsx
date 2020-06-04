import { CheckCircle } from 'react-feather';
import { useForm } from 'react-hook-form';
import React from 'react';

import { ButtonIcon } from '@haas/ui/src/Buttons';
import { ClientButton } from 'components/Buttons/Buttons';
import { Div, H2, H3, Textbox } from '@haas/ui';
import useDialogueTree from 'providers/DialogueTreeProvider';
import useEdgeTransition from 'hooks/use-edge-transition';

import { GenericNodeProps } from '../NodeLayout/NodeLayout';
import { TextboxContainer } from './TextboxStyles';

interface TextboxNodeProps extends GenericNodeProps {
  isLeaf?: boolean;
}

const TextboxNode = ({ node }: TextboxNodeProps) => {
  const { register, getValues, formState } = useForm();
  const store = useDialogueTree();
  // const { customer, dialogue } = useProject();
  const { goToEdge } = useEdgeTransition();

  const onSubmit = () => {
    const formEntry = getValues({ nest: true });

    store.session.add(node.id, {
      textValue: formEntry.textValue,
      multiValues: null,
      numberValue: null,
    });

    // if (customer && dialogue) {
    //   const nextEdgeId = node.getNextEdgeIdFromKey(formEntry.textValue);
    //   goToEdge(customer.slug, dialogue?.id, nextEdgeId);
    // }
  };

  return (
    <TextboxContainer>
      <H2>{node.title}</H2>
      <Div>
        <H3 color="white">What would you like to tell us?</H3>
        <Textbox placeholder="I have experienced ..." name="textValue" ref={register} />
        <ClientButton mt={4} isActive={'textValue' in formState.touched} onClick={() => onSubmit()}>
          <ButtonIcon>
            <CheckCircle />
          </ButtonIcon>
          Submit
        </ClientButton>
      </Div>
    </TextboxContainer>
  );
};

export default TextboxNode;
