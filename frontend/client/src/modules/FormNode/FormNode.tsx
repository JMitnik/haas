import * as UI from '@haas/ui';
import { AtSign, FileText, Hash, Link2, Phone, Type } from 'react-feather';
import { ClientButton } from 'components/Buttons/Buttons';
import { Controller, useForm } from 'react-hook-form';
import { Div } from '@haas/ui';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import React from 'react';
import styled from 'styled-components';

import * as RadioGroup from 'components/RadioGroup';

import { FormNodeFieldTypeEnum } from 'types/generated-types';
import { GenericQuestionNodeProps } from 'modules/Node/Node.types';
import { NodeTitle } from 'layouts/NodeLayout/NodeLayoutStyles';
import { SessionActionType } from 'types/core-types';

type FormNodeProps = GenericQuestionNodeProps;

interface FormNodeFormProps {
  fields: {
    value: string | number;
  }[]
}

const mapFieldType: { [key: string]: string } = {
  email: 'email',
  number: 'number',
  phoneNumber: 'tel',
  url: 'url',
  longText: '',
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

const FormNode = ({ node, onRunAction }: FormNodeProps) => {
  const { t } = useTranslation();
  const { register, getValues, formState, control } = useForm<FormNodeFormProps>({
    mode: 'onChange',
    defaultValues: {
      fields: node?.form?.fields?.map(() => ({
        value: '',
      })) || [],
    },
  });

  const { isValid } = formState;

  const fields = node?.form?.fields || [];

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>, ignoreFields = false) => {
    event.preventDefault();
    const formEntry = getValues();

    const formFieldValues = formEntry.fields?.map((fieldEntry, index) => ({
      relatedFieldId: fields?.[index]?.id,
      [fields?.[index]?.type || '']: !ignoreFields ? getFieldValue(fieldEntry, fields?.[index]) : undefined,
    }));

    // TODO: Think of some logic
    const childEdge = undefined;
    const childNode = undefined;

    onRunAction({
      startTimestamp: new Date(Date.now()),
      action: {
        type: SessionActionType.FormAction,
        form: { values: formFieldValues },
      },
      reward: {
        overrideCallToActionId: node.overrideLeaf?.id,
        toEdge: childEdge,
        toNode: childNode,
      },
    });
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
            {node.form?.helperText || t('leave_your_details')}
          </UI.Text>
          <UI.Hr />
          <UI.Form onSubmit={(e: React.FormEvent<HTMLFormElement>) => { handleSubmit(e); return false; }}>
            <Div>
              <UI.Grid gridTemplateColumns={['1fr', '1fr 1fr']}>
                {fields?.map((field, index) => (
                  <UI.Div
                    key={index}
                    gridColumn={field.type === 'longText'
                      || field.type === FormNodeFieldTypeEnum.Contacts ? 'span 2' : '1fr'}
                  >
                    <UI.FormControl isRequired={field.isRequired || false}>
                      <UI.FormLabel htmlFor={`fields.${index}.value`}>{field.label}</UI.FormLabel>
                      {field.type === 'longText' && (
                        <UI.Textarea
                          key={`longText-${index}`}
                          id={`fields[${index}].value`}
                          variant="outline"
                          {...register(`fields.${index}.value` as const)}
                          minHeight="40px"
                          placeholder={field.placeholder || undefined}
                        />
                      )}
                      {field.type === FormNodeFieldTypeEnum.Contacts && (
                        <Controller
                          key="contactsradio"
                          name={`fields.${index}.value` as const}
                          control={control}
                          defaultValue={undefined}
                          rules={{ required: field.isRequired || false }}
                          render={({ field: { value, onBlur, onChange } }) => (
                            <RadioGroup.Root
                              defaultValue={value as string}
                              onValueChange={onChange}
                              onBlur={onBlur}
                              variant="tight"
                            >
                              {field.contacts?.map((contact) => (
                                <RadioGroup.Item
                                  isActive={value === contact?.email}
                                  value={contact?.email as string}
                                  key={contact?.id}
                                  contentVariant="twoLine"
                                  variant="boxed"
                                >
                                  <UI.Flex flexDirection="column" alignItems="flex-start" justifyContent="center">
                                    <RadioGroup.Label style={{ marginBottom: 0, marginTop: '4px' }}>
                                      {contact?.firstName}
                                      {' '}
                                      {contact?.lastName}
                                    </RadioGroup.Label>
                                  </UI.Flex>

                                </RadioGroup.Item>
                              ))}
                            </RadioGroup.Root>
                          )}
                        />
                      )}
                      {field.type !== 'longText' && field.type !== 'contacts' && (
                        <UI.Input
                          key={fields[index].id}
                          id={`fields.${index}.value`}
                          variant="outline"
                          leftEl={mapIcon[field?.type] || <Type />}
                          type={mapFieldType[field?.type] || 'text'}
                          placeholder={field.placeholder || undefined}
                          maxWidth={mapFieldType[field?.type] === 'number' ? '100px' : 'auto'}
                          {...register(`fields.${index}.value` as const, { required: field.isRequired || false })}
                        />
                      )}
                    </UI.FormControl>
                  </UI.Div>
                ))}
              </UI.Grid>
              <UI.Div mt={4}>
                <UI.Flex flexWrap="wrap" alignItems="center">
                  <ClientButton
                    // @ts-ignore
                    flexBasis="200px"
                    mr={2}
                    width="auto"
                    type="submit"
                    isDisabled={!isValid}
                    isActive={isValid}
                  >
                    {t('submit')}
                  </ClientButton>
                  <UI.Button size="sm" variant="ghost" onClick={(e) => handleSubmit(e, true)}>
                    {t('do_not_share')}
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
