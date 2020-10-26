import { CheckCircle } from 'react-feather';
import { useForm } from 'react-hook-form';
import React, { useEffect } from 'react';

import { ButtonIcon } from '@haas/ui/src/Buttons';
import { ClientButton, OutlineButton } from 'components/Buttons/Buttons';
import { Div, Grid } from '@haas/ui';
import { ReactComponent as EmailIcon } from 'assets/icons/icon-email.svg';
import { Input, InputLabel } from '@haas/ui/src/Form';
import { ReactComponent as LastNameIcon } from 'assets/icons/icon-last-name.svg';
import { NodeTitle } from 'layouts/NodeLayout/NodeLayoutStyles';
import { SessionEntryDataProps } from 'models/Session/SessionEntryModel';
import { ReactComponent as UserIcon } from 'assets/icons/icon-user.svg';
import useDialogueFinish from 'hooks/useDialogueFinish';

import { GenericNodeProps } from '../types';
import { IconContainer, InputContainer, RegisterNodeContainer } from './RegisterNodeStyles';

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
              <InputContainer>
                <InputLabel>First name</InputLabel>
                <Input
                  leftEl={<IconContainer><UserIcon /></IconContainer>}
                  placeholder="Jane"
                  name="firstName"
                  ref={register}
                />
              </InputContainer>

              <InputContainer>
                <InputLabel color="white">Last name</InputLabel>
                <Input
                  leftEl={<IconContainer><LastNameIcon /></IconContainer>}
                  placeholder="Doe"
                  name="lastName"
                  ref={register}
                />
              </InputContainer>
            </Grid>

            <InputContainer>
              <InputLabel color="white">Email address</InputLabel>
              <Input
                leftEl={<IconContainer><EmailIcon /></IconContainer>}
                placeholder="Jane@haas.live"
                name="email"
                ref={register}
              />
            </InputContainer>
          </Grid>
          <Grid paddingTop={4} gridTemplateColumns={['1fr 1fr', '1fr 1fr']}>
            <ClientButton type="submit" disabled={!dirty} isActive={dirty}>
              <ButtonIcon>
                <CheckCircle />
              </ButtonIcon>
              Submit
            </ClientButton>
            <OutlineButton type="submit">Do not share</OutlineButton>
          </Grid>
        </Div>
      </form>
    </RegisterNodeContainer>
  );
};

export default RegisterNode;
