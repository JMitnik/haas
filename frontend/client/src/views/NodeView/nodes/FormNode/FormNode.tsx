import * as UI from '@haas/ui';
import { AtSign, FileText, Hash, Link2, Phone, Type } from 'react-feather';
import { ClientButton } from 'components/Buttons/Buttons';
import { Div } from '@haas/ui';
import { NodeTitle } from 'layouts/NodeLayout/NodeLayoutStyles';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import React from 'react';
import styled from 'styled-components';

import { GenericNodeProps } from '../types';

type FormNodeProps = GenericNodeProps;

interface FormNodeFormProps {
  fields: {
    value: string | number;
  }[]
}

const mapFieldType: {[key: string]: string} = {
  email: 'email',
  number: 'number',
  phoneNumber: 'tel',
  url: 'url',
};

const mapIcon: any = {
  email: <AtSign />,
  number: <Hash />,
  phoneNumber: <Phone />,
  url: <Link2 />,
  shortText: <Type />,
  longText: <FileText />,
};

const DrawerContainer = styled(UI.Div)`
  background: white;
  padding: 24px;
  border-radius: 30px;
  box-shadow: rgba(0, 0, 0, 0.15) 0px 15px 25px, rgba(0, 0, 0, 0.05) 0px 5px 10px;
  backdrop-filter: blur(10px);
`;

const getFieldValue = (field: any, relatedField: any) => {
  if (relatedField?.type === 'number') {
    try {
      return parseInt(field.value, 10) || undefined;
    } catch {
      return undefined;
    }
  }

  return field.value || undefined;
};

const FormNode = ({ node, onEntryStore }: FormNodeProps) => {
  const { register, getValues, formState } = useForm<FormNodeFormProps>({
    mode: 'onChange',
    reValidateMode: 'onChange',
  });

  const { isValid } = formState;

  const fields = node?.form?.fields;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formEntry = getValues({ nest: true });

    const entry: any = {
      form: {
        values: formEntry.fields.map((fieldEntry, index) => ({
          relatedFieldId: fields?.[index].id,
          [fields?.[index]?.type || '']: getFieldValue(fieldEntry, fields?.[index]),
        })),
      },
    };

    onEntryStore(entry, formEntry);
  };

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
              <UI.Grid gridTemplateColumns={['1fr', '1fr 1fr']}>
                {fields?.map((field, index) => (
                  <UI.Div key={index}>
                    <UI.FormControl isRequired={field.isRequired}>
                      <UI.FormLabel htmlFor={`fields[${index}].value`}>{field.label}</UI.FormLabel>
                      <UI.Input
                        id={`fields[${index}].value`}
                        variant="outline"
                        leftEl={mapIcon[field?.type] || <Type />}
                        type={mapFieldType[field?.type] || 'text'}
                        ref={register({ required: field.isRequired })}
                        name={`fields[${index}].value`}
                        placeholder={field.label}
                        maxWidth={mapFieldType[field?.type] === 'number' ? '100px' : 'auto'}
                      />
                    </UI.FormControl>
                  </UI.Div>
                ))}
              </UI.Grid>
              <UI.Div mt={4}>
                <UI.Flex flexWrap="wrap" alignItems="center">
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
                  <UI.Button size="sm" variant="ghost" onClick={(e) => handleSubmit(e)}>
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
