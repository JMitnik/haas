import * as UI from '@haas/ui';
import { CheckCircle } from 'react-feather';
import { useForm } from 'react-hook-form';
import React from 'react';

import { ClientButton, OutlineButton } from 'components/Buttons/Buttons';
import { Div, Grid } from '@haas/ui';
import { ReactComponent as EmailIcon } from 'assets/icons/icon-email.svg';
import { Input, InputLabel } from '@haas/ui/src/Form';
import { ReactComponent as LastNameIcon } from 'assets/icons/icon-last-name.svg';
import { NodeTitle } from 'layouts/NodeLayout/NodeLayoutStyles';
import { SessionEntryDataProps } from 'models/Session/SessionEntryModel';
import { ReactComponent as UserIcon } from 'assets/icons/icon-user.svg';

import { getSnapshot } from 'mobx-state-tree';
import styled from 'styled-components';
import { GenericNodeProps } from '../types';

type RegisterNodeProps = GenericNodeProps;

interface RegisterNodeFormProps {
  firstName?: string;
  lastName?: string;
  email?: string;
}

const DrawerContainer = styled(UI.Div)`
  background: rgba(255, 255, 255, 0.8);
  padding: 24px;
  border-radius: 30px;
  box-shadow: rgba(50, 50, 105, 0.25) 0px 2px 5px 0px, rgba(0, 0, 0, 0.15) 0px 1px 1px 0px;
  backdrop-filter: blur(10px);
`;

const FormNode = ({ node, onEntryStore }: RegisterNodeProps) => {
  const { register, getValues, formState } = useForm<RegisterNodeFormProps>({
    mode: 'onChange',
    reValidateMode: 'onChange',
  });

  const { dirty, isValid } = formState;

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

  const fields = node?.form?.fields;

  console.log(getSnapshot(node));

  return (
    <UI.Div>
      <NodeTitle>{node.title}</NodeTitle>

      <DrawerContainer>
        <form onSubmit={(e: React.FormEvent<HTMLFormElement>) => { handleSubmit(e); return false; }}>
          <Div>
            <UI.Grid gridTemplateColumns={['1fr', '1fr 1fr']}>
              {fields?.map((field, index) => (
                <UI.Div>
                  <UI.FormControl isRequired={field.isRequired}>
                    <UI.FormLabel htmlFor={`form.fields[${index}].value`}>{field.label}</UI.FormLabel>
                    <UI.Input
                      ref={register({ required: field.isRequired })}
                      name={`form.fields[${index}].value`}
                      placeholder={field.label}
                    />
                  </UI.FormControl>
                </UI.Div>
              ))}
            </UI.Grid>

            <Grid paddingTop={4} gridTemplateColumns={['1fr', '1fr 1fr']}>
              <ClientButton type="submit" isDisabled={!isValid} isActive={isValid}>
                Submit
              </ClientButton>
              <UI.Button variant="outline">
                Do not share
              </UI.Button>
            </Grid>
          </Div>
        </form>
      </DrawerContainer>
    </UI.Div>
  );
};

export default FormNode;
