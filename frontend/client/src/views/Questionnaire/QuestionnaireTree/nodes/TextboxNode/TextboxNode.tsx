import React, { useRef, useEffect } from 'react';
import { useMutation } from '@apollo/react-hooks';

import { Textbox, Button, H3 } from '@haas/ui';
import { useHistory, useLocation } from 'react-router-dom';
import useHAASTree from 'hooks/use-haas-tree';
import uploadEntryMutation from 'mutations/UploadEntryMutation';
import { useForm } from 'react-hook-form';
import { CheckCircle } from 'react-feather';
import { ButtonIcon } from '@haas/ui/src/Buttons';
import { TextboxContainer } from './TextboxStyles';

interface TextboxNodeProps {
  isLeaf?: boolean;
}

const TextboxNode = ({ isLeaf }: TextboxNodeProps) => {
  const { saveNodeEntry, historyStack } = useHAASTree();
  const history = useHistory();
  const location = useLocation();
  const finishedRef = useRef(false);
  const { register, getValues, formState } = useForm();
  const [submitForm] = useMutation(uploadEntryMutation, {});

  const onSubmit = () => {
    const formEntry = getValues({ nest: true });
    saveNodeEntry(formEntry);
    finishedRef.current = true;
  };

  useEffect(() => {
    const finishJourney = () => {
      submitForm({
        variables: {
          uploadUserSessionInput: { entries: historyStack }
        }
      }).then(() => history.push(`${location.pathname}/finished`));
    };

    if (finishedRef.current && isLeaf) {
      finishJourney();
    }
  }, [historyStack, isLeaf, submitForm, history, location.pathname]);

  return (
    <>
      <TextboxContainer>
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
      </TextboxContainer>
    </>
  );
};

export default TextboxNode;
