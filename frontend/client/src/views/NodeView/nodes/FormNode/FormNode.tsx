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

import { GenericNodeProps } from '../types';
import { getSnapshot } from 'mobx-state-tree';
import { motion } from 'framer-motion';
import styled from 'styled-components';

type FormNodeProps = GenericNodeProps;

interface FormNodeFormProps {
  fields: {
    value: string | number;
  }[]
}

const DrawerContainer = styled(UI.Div)`
  background: white;
  padding: 24px;
  border-radius: 30px;
  box-shadow: rgba(0, 0, 0, 0.15) 0px 15px 25px, rgba(0, 0, 0, 0.05) 0px 5px 10px;
  backdrop-filter: blur(10px);
`;

const FormNode = ({ node, onEntryStore }: FormNodeProps) => {
  const { register, getValues, formState } = useForm<FormNodeFormProps>({
    mode: 'onChange',
    reValidateMode: 'onChange',
  });

  const { dirty, isValid } = formState;

  const fields = node?.form?.fields;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formEntry = getValues({ nest: true });

    console.log(formEntry);

    const entry: any = {
      form: {
        values: formEntry.fields.map((fieldEntry, index) => ({
          relatedFieldId: fields?.[index].id,
          [fields?.[index]?.type || '']: fieldEntry.value,
        })),
      },
    };

    console.log(entry);

    onEntryStore(entry, formEntry);
  };

  console.log(getSnapshot(node));

  return (
    <UI.Div>
      <NodeTitle>{node.title}</NodeTitle>

      <motion.div animate={{ opacity: 1, y: 0 }} initial={{ opacity: 0, y: 350 }}>
        <DrawerContainer>
          <UI.Text
            textAlign="left"
            fontWeight={700}
            color="gray.600"
            fontSize="1.2rem"
            mb={2}
          >
            Leave your details
          </UI.Text>
          <UI.Hr />
          <UI.Form onSubmit={(e: React.FormEvent<HTMLFormElement>) => { handleSubmit(e); return false; }}>
            <Div>
              <UI.Grid gridTemplateColumns="1fr 1fr">
                {fields?.map((field, index) => (
                  <UI.Div key={index}>
                    <UI.FormControl isRequired={field.isRequired}>
                      <UI.FormLabel htmlFor={`fields[${index}].value`}>{field.label}</UI.FormLabel>
                      <UI.Input
                        variant="outline"
                        ref={register({ required: field.isRequired })}
                        name={`fields[${index}].value`}
                        placeholder={field.label}
                      />
                    </UI.FormControl>
                  </UI.Div>
                ))}
              </UI.Grid>
              <UI.Div mt={4}>
                <UI.Flex alignItems="center">
                  <ClientButton
                    flexBasis="200px"
                    mr={2}
                    width="auto"
                    type="submit"
                    isDisabled={!isValid}
                    isActive={isValid}
                  >
                    Submit
                  </ClientButton>
                  <UI.Button size="sm" variant="ghost">
                    Do not share
                  </UI.Button>
                </UI.Flex>
              </UI.Div>
            </Div>
          </UI.Form>
        </DrawerContainer>
      </motion.div>
    </UI.Div>
  );
};

export default FormNode;
