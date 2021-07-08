import * as UI from '@haas/ui';
import React from 'react';

import { AtSign, FileText, Hash, Link2, Phone, Type } from 'react-feather';
import {
  getDialogueSessionConnection_customer_dialogue_sessionConnection_sessions_nodeEntries_value_formNodeEntry
  as FormNodeEntryType,
} from 'queries/__generated__/getDialogueSessionConnection';
import { FormNodeFieldTypeEnum } from 'types/globalTypes';
import styled from 'styled-components';

/**
 * Wrap the underlying element to be full-width
 */
const LongTextContainer = styled.div`
  grid-column: span 2;

  > * {
    width: 100%;
    height: auto;
    text-overflow: ellipsis;
    word-break: break-word;
  }
`;

/**
 * Wrap all general elements
 */
const GeneralWrappedTextContainer = styled.div`
  > * {
    width: 100%;
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
    height: auto;
    text-overflow: ellipsis;
    word-break: break-word;
  }
`;

const FormNodeEmailEntry = ({ formNodeFieldEntry }: { formNodeFieldEntry: any }) => (
  <GeneralWrappedTextContainer>
    <UI.Label variantColor="gray" bg="gray.300">
      <UI.Icon color="gray.500" mr={1}>
        <AtSign width="14px" height="14px" />
      </UI.Icon>
      {formNodeFieldEntry.email}
    </UI.Label>
  </GeneralWrappedTextContainer>
);

const FormNodeLongTextEntry = ({ formNodeFieldEntry }: { formNodeFieldEntry: any }) => (
  <LongTextContainer>
    <UI.Label variantColor="gray" bg="gray.300">
      <UI.Icon color="gray.500" mr={1}>
        <FileText width="14px" height="14px" />
      </UI.Icon>
      {formNodeFieldEntry.longText}
    </UI.Label>
  </LongTextContainer>
);

const FormNodeShortTextEntry = ({ formNodeFieldEntry }: { formNodeFieldEntry: any }) => (
  <GeneralWrappedTextContainer>
    <UI.Label variantColor="gray" bg="gray.300">
      <UI.Icon color="gray.500" mr={1}>
        <Type width="14px" height="14px" />
      </UI.Icon>
      {formNodeFieldEntry.shortText}
    </UI.Label>
  </GeneralWrappedTextContainer>
);

const FormNodePhoneNumberEntry = ({ formNodeFieldEntry }: { formNodeFieldEntry: any }) => (
  <GeneralWrappedTextContainer>
    <UI.Label variantColor="gray" bg="gray.300">
      <UI.Icon color="gray.500" mr={1}>
        <Phone width="14px" height="14px" />
      </UI.Icon>
      {formNodeFieldEntry.phoneNumber}
    </UI.Label>
  </GeneralWrappedTextContainer>
);

const FormNodeNumberEntry = ({ formNodeFieldEntry }: { formNodeFieldEntry: any }) => (
  <GeneralWrappedTextContainer>
    <UI.Label variantColor="gray" bg="gray.300">
      <UI.Icon color="gray.500" mr={1}>
        <Hash width="14px" height="14px" />
      </UI.Icon>
      {formNodeFieldEntry.number}
    </UI.Label>
  </GeneralWrappedTextContainer>
);

const FormNodeUrlEntry = ({ formNodeFieldEntry }: { formNodeFieldEntry: any }) => (
  <GeneralWrappedTextContainer>
    <UI.Label variantColor="gray" bg="gray.300">
      <UI.Icon color="gray.500" mr={1}>
        <Link2 width="14px" height="14px" />
      </UI.Icon>
      {formNodeFieldEntry.url}
    </UI.Label>
  </GeneralWrappedTextContainer>
);

const MapFormNodeEntryVal: { [key in FormNodeFieldTypeEnum]?: React.FC<{ formNodeFieldEntry: any }> } = {
  [FormNodeFieldTypeEnum.email]: FormNodeEmailEntry,
  [FormNodeFieldTypeEnum.longText]: FormNodeLongTextEntry,
  [FormNodeFieldTypeEnum.shortText]: FormNodeShortTextEntry,
  [FormNodeFieldTypeEnum.phoneNumber]: FormNodePhoneNumberEntry,
  [FormNodeFieldTypeEnum.number]: FormNodeNumberEntry,
  [FormNodeFieldTypeEnum.url]: FormNodeUrlEntry,
};

export const FormNodeEntry = ({ nodeEntry }: { nodeEntry: FormNodeEntryType }) => (
  <UI.Card noHover>
    <UI.CardBody>
      <UI.Grid gridTemplateColumns={['1fr', '1fr', '1fr', '1fr 1fr']}>
        {nodeEntry.values?.map((formNodeFieldEntry, index) => {
          // eslint-disable-next-line @typescript-eslint/naming-convention
          const { relatedField, __typename, ...entryData } = formNodeFieldEntry;
          // We can't rely on the relatedField.type because users may have changed the type whilst the value remains
          // on previous type.
          if (!entryData) return null;

          try {
            const [presentRelatedFieldType] = Object.entries(entryData).find(
              ([, data]) => !!data,
            ) as [FormNodeFieldTypeEnum, any];
            if (!presentRelatedFieldType) return null;

            const FormNodeFieldEntry = MapFormNodeEntryVal[presentRelatedFieldType];

            if (!FormNodeFieldEntry) return null;

            return <FormNodeFieldEntry key={index} formNodeFieldEntry={formNodeFieldEntry} />;
          } catch {
            return null;
          }
        })}
      </UI.Grid>
    </UI.CardBody>
  </UI.Card>
);

export default FormNodeEntry;
