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

interface TextboxNodeProps extends GenericNodeProps {
  isLeaf?: boolean;
}

const TextboxNode = ({ isLeaf, node }: TextboxNodeProps) => {
  const history = useHistory();
  const location = useLocation();
  const finishedRef = useRef(false);
  const { register, getValues, formState } = useForm();
  const [submitForm] = useMutation(uploadEntryMutation, {});

  const onSubmit = () => {
    const formEntry = getValues({ nest: true });
    // saveNodeEntry(formEntry);
    finishedRef.current = true;
  };

  return (
    <TextboxContainer>
      <H2>{node.title}</H2>
      <Div>
        <Button
          isActive={'textValue' in formState.touched}
          brand="secondary"
          onClick={() => onSubmit()}
        >
          <ButtonIcon>
            <CheckCircle />
          </ButtonIcon>
          Submit
        </Button>
        <H3 color="white">What would you like to tell us?</H3>
        <Textbox name="textValue" ref={register} />
      </Div>
    </TextboxContainer>
  );
};

export default TextboxNode;
