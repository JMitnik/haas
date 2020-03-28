import React from 'react';
import { Button, Grid, Div, H2 } from '@haas/ui';
import { useForm } from 'react-hook-form';
import { InputField, InputGroup, InputLabel } from '@haas/ui/src/Form';
import { CheckCircle } from 'react-feather';

import { ButtonIcon } from '@haas/ui/src/Buttons';
import { RegisterNodeContainer } from './RegisterNodeStyles';
import { GenericNodeProps } from '../Node';

import useHAASTree from 'hooks/use-haas-tree';
import useJourneyFinish from 'hooks/use-journey-finish';

type RegisterNodeProps = GenericNodeProps;

const RegisterNode = ({ node, isLeaf }: RegisterNodeProps) => {
  const { register, getValues } = useForm();

  const { finishedRef } = useJourneyFinish({ isLeaf, useFinishPage: true });

  const onSubmit = () => {
    const formEntry = getValues({ nest: true });
    // saveNodeEntry(formEntry);
    finishedRef.current = true;
  };

  return (
    <RegisterNodeContainer>
      <H2>{node.title}</H2>

      <Div>
        <Grid gridTemplateColumns={['auto', 'repeat(auto-fit, minmax(100px, 1fr))']} gridGap="24px">
          <Grid gridTemplateColumns="1fr 1fr">
            <InputGroup>
              <InputLabel color="white">First name</InputLabel>
              <InputField name="multiValues[0].textValue" ref={register} />
            </InputGroup>

            <InputGroup>
              <InputLabel color="white">Last name</InputLabel>
              <InputField name="multiValues[1].textValue" ref={register} />
            </InputGroup>
          </Grid>

          <InputGroup>
            <InputLabel color="white">Email adress</InputLabel>
            <InputField name="multiValues[2].textValue" ref={register} />
          </InputGroup>
        </Grid>
        <Div mt={4}>
          <Button brand="secondary" onClick={() => onSubmit()}>
            <ButtonIcon>
              <CheckCircle />
            </ButtonIcon>
            Submit
          </Button>
        </Div>
      </Div>
    </RegisterNodeContainer>
  );
};

export default RegisterNode;
