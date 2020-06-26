import { CheckCircle } from 'react-feather';
import { useForm } from 'react-hook-form';
import React from 'react';

import { ButtonIcon } from '@haas/ui/src/Buttons';
import { ClientButton } from 'components/Buttons/Buttons';
import { DeprecatedInput, InputGroup, InputLabel } from '@haas/ui/src/Form';
import { Div, Grid } from '@haas/ui';
import { NodeTitle } from 'layouts/NodeLayout/NodeLayoutStyles';

import { GenericNodeProps } from '../types';
import { RegisterNodeContainer } from './RegisterNodeStyles';

type RegisterNodeProps = GenericNodeProps;

const RegisterNode = ({ node, onEntryStore }: RegisterNodeProps) => {
  const { register, getValues, formState } = useForm();

  const onSubmit = () => {
    const formEntry = getValues({ nest: true });

    const entry: any = {
      multiValues: formEntry.multiValues,
      numberValue: null,
      textValue: null,
    };

    onEntryStore(entry, formEntry.multiValues);
  };

  const touched = () => 'multiValues' in formState.touched;

  return (
    <RegisterNodeContainer>
      <NodeTitle>{node.title}</NodeTitle>

      <Div>
        <Grid gridTemplateColumns={['auto', 'repeat(auto-fit, minmax(100px, 1fr))']} gridGap="24px">
          <Grid gridTemplateColumns="1fr 1fr">
            <InputGroup>
              <InputLabel color="white">First name</InputLabel>
              <DeprecatedInput placeholder="Jane" name="multiValues[0].textValue" ref={register} />
            </InputGroup>

            <InputGroup>
              <InputLabel color="white">Last name</InputLabel>
              <DeprecatedInput placeholder="White" name="multiValues[1].textValue" ref={register} />
            </InputGroup>
          </Grid>

          <InputGroup>
            <InputLabel color="white">Email adress</InputLabel>
            <DeprecatedInput placeholder="janewhite@gmail.com" name="multiValues[2].textValue" ref={register} />
          </InputGroup>
        </Grid>
        <Div mt={4}>
          <ClientButton isActive={touched()} onClick={() => onSubmit()}>
            <ButtonIcon>
              <CheckCircle />
            </ButtonIcon>
            Submit
          </ClientButton>
        </Div>
      </Div>
    </RegisterNodeContainer>
  );
};

export default RegisterNode;
