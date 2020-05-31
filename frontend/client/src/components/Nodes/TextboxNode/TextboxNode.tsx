import React from 'react';

import { ButtonIcon } from '@haas/ui/src/Buttons';
import { CheckCircle } from 'react-feather';
import { ClientButton } from 'components/Buttons/Buttons';
import { Div, H2, H3, Textbox } from '@haas/ui';
import { useForm } from 'react-hook-form';
import { GenericNodeProps } from '../NodeLayout/NodeLayout';
import { TextboxContainer } from './TextboxStyles';
import useDialogueTree from 'providers/DialogueTreeProvider';

interface TextboxNodeProps extends GenericNodeProps {
  isLeaf?: boolean;
}

const TextboxNode = ({ node }: TextboxNodeProps) => {
  const { register, getValues, formState } = useForm();
  // const {
  //   treeDispatch: { goToChild }
  // } = useDialogueTree();
  const goToChild = (a: any, b: any, c: any) => {};
  const saveEntry = (a: any, b: any, c: any) => {};

  const onSubmit = () => {
    const formEntry = getValues({ nest: true });
    goToChild(node, null, formEntry);
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
