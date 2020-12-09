import * as UI from '@haas/ui';
import React from 'react';

import { AtSign, FileText, Hash, Link2, Phone, Type } from 'react-feather';
import {
  getDialogueSessionConnection_customer_dialogue_sessionConnection_sessions_nodeEntries_value_formNodeEntry
  as FormNodeEntryType,
} from 'queries/__generated__/getDialogueSessionConnection';
import { FormNodeFieldTypeEnum } from 'types/globalTypes';
import styled from 'styled-components/macro';

const FormNodeEmailEntry = ({ formNodeFieldEntry }: { formNodeFieldEntry: any }) => (
  <UI.Label variantColor="gray" bg="gray.300">
    <UI.Icon color="gray.500" mr={1}>
      <AtSign width="14px" height="14px" />
    </UI.Icon>
    {formNodeFieldEntry.email}
  </UI.Label>
);

/**
 * Wrap the underlying element to be full-width
 */
const LongText = styled.div`
  grid-column: span 2;
  
  > * {
    width: 100%;
    height: auto;
    text-overflow: ellipsis;
    word-break: break-word;
  }
`;

const FormNodeLongTextEntry = ({ formNodeFieldEntry }: { formNodeFieldEntry: any }) => (
  <LongText>
    <UI.Label variantColor="gray" bg="gray.300">
      <UI.Icon color="gray.500" mr={1}>
        <FileText width="14px" height="14px" />
      </UI.Icon>
      {formNodeFieldEntry.longText}
    </UI.Label>
  </LongText>
);

const FormNodeShortTextEntry = ({ formNodeFieldEntry }: { formNodeFieldEntry: any }) => (
  <UI.Label variantColor="gray" bg="gray.300">
    <UI.Icon color="gray.500" mr={1}>
      <Type width="14px" height="14px" />
    </UI.Icon>
    {formNodeFieldEntry.shortText}
  </UI.Label>
);

const FormNodePhoneNumberEntry = ({ formNodeFieldEntry }: { formNodeFieldEntry: any }) => (
  <UI.Label variantColor="gray" bg="gray.300">
    <UI.Icon color="gray.500" mr={1}>
      <Phone width="14px" height="14px" />
    </UI.Icon>
    {formNodeFieldEntry.phoneNumber}
  </UI.Label>
);

const FormNodeNumberEntry = ({ formNodeFieldEntry }: { formNodeFieldEntry: any }) => (
  <UI.Label variantColor="gray" bg="gray.300">
    <UI.Icon color="gray.500" mr={1}>
      <Hash width="14px" height="14px" />
    </UI.Icon>
    {formNodeFieldEntry.number}
  </UI.Label>
);

const FormNodeUrlEntry = ({ formNodeFieldEntry }: { formNodeFieldEntry: any }) => (
  <UI.Label variantColor="gray" bg="gray.300">
    <UI.Icon color="gray.500" mr={1}>
      <Link2 width="14px" height="14px" />
    </UI.Icon>
    {formNodeFieldEntry.url}
  </UI.Label>
);

const MapFormNodeEntryVal: {[key in FormNodeFieldTypeEnum]?: React.FC<{ formNodeFieldEntry: any }>} = {
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
      <UI.Grid gridTemplateColumns="1fr 1fr">
        {nodeEntry.values.map((formNodeFieldEntry, index) => {
          const { relatedField, __typename, ...entryData } = formNodeFieldEntry;
          // We can't rely on the relatedField.type because users may have changed the type whilst the value remains
          // on previous type.
          const [presentRelatedFieldType] = Object.entries(entryData).find(
            ([, data]) => !!data,
          ) as [FormNodeFieldTypeEnum, any];

          if (!presentRelatedFieldType) return null;

          const FormNodeFieldEntry = MapFormNodeEntryVal[presentRelatedFieldType];

          if (!FormNodeFieldEntry) return null;

          return <FormNodeFieldEntry key={index} formNodeFieldEntry={formNodeFieldEntry} />;
        })}
      </UI.Grid>
    </UI.CardBody>
  </UI.Card>
);

export default FormNodeEntry;
