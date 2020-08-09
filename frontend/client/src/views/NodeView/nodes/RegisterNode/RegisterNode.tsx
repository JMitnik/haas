import { CheckCircle, Mail, User } from 'react-feather';
import { useForm } from 'react-hook-form';
import React from 'react';

import { ButtonIcon } from '@haas/ui/src/Buttons';
import { ClientButton, OutlineButton } from 'components/Buttons/Buttons';
import { DeprecatedInputContainer, DeprecatedInputStyled, FormControl, Input, InputGroup, InputLabel } from '@haas/ui/src/Form';
import { Div, Grid } from '@haas/ui';
import { NodeTitle } from 'layouts/NodeLayout/NodeLayoutStyles';
import { SessionEntryDataProps } from 'models/Session/SessionEntryModel';

import { GenericNodeProps } from '../types';
import { RegisterNodeContainer } from './RegisterNodeStyles';

type RegisterNodeProps = GenericNodeProps;

interface RegisterNodeFormProps {
  firstName?: string;
  lastName?: string;
  email?: string;
}

const RegisterNode = ({ node, onEntryStore }: RegisterNodeProps) => {
  const { register, getValues, formState } = useForm<RegisterNodeFormProps>({
    mode: 'onChange',
    reValidateMode: 'onChange',
  });

  const { dirty } = formState;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formEntry = getValues({ nest: true });

    const entry: SessionEntryDataProps = {
      register: { value: JSON.stringify(formEntry) },
      slider: undefined,
      choice: undefined,
      textbox: undefined,
    };

    onEntryStore(entry, formEntry);
  };

  return (
    <RegisterNodeContainer>
      <NodeTitle>{node.title}</NodeTitle>

      <form onSubmit={(e: React.FormEvent<HTMLFormElement>) => { handleSubmit(e); return false; }}>
        <Div>
          <Grid gridTemplateColumns={['auto', 'repeat(auto-fit, minmax(100px, 1fr))']} gridGap="24px">
            <Grid gridTemplateColumns="1fr 1fr">
              <Div>
                <InputLabel color="white">First name</InputLabel>
                <Input leftEl={<User />} placeholder="Jane" name="firstName" ref={register} />
              </Div>

              <Div>
                <InputLabel color="white">Last name</InputLabel>
                <Input leftEl={<User />} placeholder="Doe" name="lastName" ref={register} />
              </Div>
            </Grid>

            <Div>
              <InputLabel color="white">Email adress</InputLabel>
              <Input leftEl={<Mail />} placeholder="Jane@haas.live" name="email" ref={register} />
            </Div>
          </Grid>
          <Div mt={4}>
            <Grid gridTemplateColumns="2fr 1fr">
              <ClientButton type="submit" disabled={!dirty} isActive={dirty}>
                <ButtonIcon>
                  <CheckCircle />
                </ButtonIcon>
                Submit
              </ClientButton>

              <OutlineButton type="submit">Do not share</OutlineButton>
            </Grid>
          </Div>
        </Div>
      </form>
    </RegisterNodeContainer>
  );
};

export default RegisterNode;
