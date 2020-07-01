import { CheckCircle, Mail, User } from 'react-feather';
import { useForm } from 'react-hook-form';
import React from 'react';

import { ButtonIcon } from '@haas/ui/src/Buttons';
import { ClientButton, OutlineButton } from 'components/Buttons/Buttons';
import { DeprecatedInputContainer, DeprecatedInputStyled, InputGroup, InputLabel } from '@haas/ui/src/Form';
import { Div, Flex, Grid, Span } from '@haas/ui';
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
              <DeprecatedInputContainer>
                <User />
                <DeprecatedInputStyled placeholder="Jane" name="multiValues[0].textValue" ref={register} />
              </DeprecatedInputContainer>
            </InputGroup>

            <InputGroup>
              <InputLabel color="white">Last name</InputLabel>
              <DeprecatedInputContainer>
                <User />
                <DeprecatedInputStyled placeholder="Doe" name="multiValues[0].textValue" ref={register} />
              </DeprecatedInputContainer>
            </InputGroup>
          </Grid>

          <InputGroup>
            <InputLabel color="white">Email adress</InputLabel>
            <DeprecatedInputContainer>
              <Mail />
              <DeprecatedInputStyled placeholder="Jane@haas.live" name="multiValues[0].textValue" ref={register} />
            </DeprecatedInputContainer>
          </InputGroup>
        </Grid>
        <Div mt={4}>
          <Grid gridTemplateColumns="2fr 1fr">
            <ClientButton disabled={!touched()} isActive={touched()} onClick={() => onSubmit()}>
              <ButtonIcon>
                <CheckCircle />
              </ButtonIcon>
              Submit
            </ClientButton>

            <OutlineButton onClick={() => onSubmit()}>Do not share</OutlineButton>
          </Grid>
        </Div>
      </Div>
    </RegisterNodeContainer>
  );
};

export default RegisterNode;
