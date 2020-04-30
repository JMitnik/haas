import React from 'react';

import { Textbox, H3, H2, Div } from '@haas/ui';
import useHAASTree from 'providers/dialogue-tree-provider';
import { useForm } from 'react-hook-form';
import { CheckCircle } from 'react-feather';
import { ButtonIcon } from '@haas/ui/src/Buttons';
import { TextboxContainer } from './TextboxStyles';
import { GenericNodeProps } from '../Node/Node';
import { ClientButton } from 'components/Buttons/Buttons';

interface TextboxNodeProps extends GenericNodeProps {
  isLeaf?: boolean;
}

const TextboxNode = ({ node }: TextboxNodeProps) => {
  const { register, getValues, formState } = useForm();
  const {
    treeDispatch: { goToChild }
  } = useHAASTree();

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
