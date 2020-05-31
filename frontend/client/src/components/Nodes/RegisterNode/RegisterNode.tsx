import { CheckCircle } from 'react-feather';
import { Div, Grid, H2 } from '@haas/ui';
import { InputField, InputGroup, InputLabel } from '@haas/ui/src/Form';
import { useForm } from 'react-hook-form';
import React from 'react';

import { ButtonIcon } from '@haas/ui/src/Buttons';
import { GenericNodeProps } from 'components/Nodes/NodeLayout/NodeLayout';

import { ClientButton } from 'components/Buttons/Buttons';
import { RegisterNodeContainer } from './RegisterNodeStyles';
import useDialogueTree from 'providers/DialogueTreeProvider';

type RegisterNodeProps = GenericNodeProps;

const RegisterNode = ({ node, isLeaf }: RegisterNodeProps) => {
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

  const touched = () => 'multiValues' in formState.touched;

  return (
    <RegisterNodeContainer>
      <H2>{node.title}</H2>

      <Div>
        <Grid gridTemplateColumns={['auto', 'repeat(auto-fit, minmax(100px, 1fr))']} gridGap="24px">
          <Grid gridTemplateColumns="1fr 1fr">
            <InputGroup>
              <InputLabel color="white">First name</InputLabel>
              <InputField placeholder="Jane" name="multiValues[0].textValue" ref={register} />
            </InputGroup>

            <InputGroup>
              <InputLabel color="white">Last name</InputLabel>
              <InputField placeholder="White" name="multiValues[1].textValue" ref={register} />
            </InputGroup>
          </Grid>

          <InputGroup>
            <InputLabel color="white">Email adress</InputLabel>
            <InputField placeholder="janewhite@gmail.com" name="multiValues[2].textValue" ref={register} />
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
