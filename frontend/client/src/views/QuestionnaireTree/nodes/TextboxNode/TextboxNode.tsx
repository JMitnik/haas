import React, { useRef, useEffect } from 'react';
import { useMutation } from '@apollo/react-hooks';

import { Textbox, Button, H3, H2, Div } from '@haas/ui';
import { useHistory, useLocation } from 'react-router-dom';
import useHAASTree from 'hooks/use-haas-tree';
import uploadEntryMutation from 'mutations/UploadEntryMutation';
import { useForm } from 'react-hook-form';
import { CheckCircle } from 'react-feather';
import { ButtonIcon } from '@haas/ui/src/Buttons';
import { TextboxContainer } from './TextboxStyles';
import { GenericNodeProps } from '../Node';
import { ClientButton } from 'components/Buttons';

interface TextboxNodeProps extends GenericNodeProps {
  isLeaf?: boolean;
}

const TextboxNode = ({ isLeaf, node }: TextboxNodeProps) => {
  const history = useHistory();
  const location = useLocation();
  const finishedRef = useRef(false);
  const { register, getValues, formState } = useForm();
  const [submitForm] = useMutation(uploadEntryMutation, {});
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
        <Textbox name="textValue" ref={register} />
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
