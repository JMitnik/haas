import React from 'react';
import { Grid, Div, H2 } from '@haas/ui';
import { useForm } from 'react-hook-form';
import { InputField, InputGroup, InputLabel } from '@haas/ui/src/Form';
import { CheckCircle } from 'react-feather';

import { ButtonIcon } from '@haas/ui/src/Buttons';
import { RegisterNodeContainer } from './RegisterNodeStyles';
import { GenericNodeProps } from 'components/Nodes/Node/Node';

import useHAASTree from 'providers/dialogue-tree-provider';
import { ClientButton } from 'components/Buttons/Buttons';

type RegisterNodeProps = GenericNodeProps;

const RegisterNode = ({ node, isLeaf }: RegisterNodeProps) => {
  const { register, getValues, formState } = useForm();
  const {
    treeDispatch: { goToChild }
  } = useHAASTree();

  const onSubmit = () => {
    const formEntry = getValues({ nest: true });
    goToChild(node, null, formEntry);
  };

  const touched = () => {
    return 'multiValues' in formState.touched;
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
