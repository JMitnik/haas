import * as UI from '@haas/ui';
import React, { memo } from 'react';
import { Repeat } from 'react-feather';

import { Handle, Position } from 'react-flow-renderer';
import styled from 'styled-components';

const VariantBox = styled.div`
  position: relative;
  transform: translate(402px, 41px);
  pointer-events: all;
  opacity: 1;
  border: 1px solid rgb(211, 213, 222);
  padding: 12px;
  box-shadow: rgb(0 0 0 / 8%) 0px 1px 2px, rgb(0 0 0 / 6%) 0px 2px 8px;
  border-radius: 10px;
  min-width: 200px;
  background: white;
  min-height: 80px;
`;

const VariantLabelContainer = styled.div`
  /* position: absolute;
  top: 6px;
  left: 6px; */

  svg {
    width: 14px;
    margin-right: 6px;
  }
`;

export default memo(({ data }: { data: any }) => {
  console.log(data);
  return (
    <VariantBox>
      <Handle
        type="target"
        position={Position.Left}
        style={{ background: '#555' }}
        onConnect={(params) => console.log('handle onConnect', params)}
      />
      <VariantLabelContainer>
        <UI.Helper fontSize="0.5rem">
          <UI.Flex alignItems="center">
            <UI.Icon>
              <Repeat />
            </UI.Icon>
            Repeat daily
          </UI.Flex>
        </UI.Helper>
        <UI.Text>{data.label}</UI.Text>
      </VariantLabelContainer>
      <Handle
        type="source"
        position={Position.Right}
        id="a"
        style={{ top: 10, background: '#555' }}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="b"
        style={{ bottom: 10, top: 'auto', background: '#555' }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="medium"
        style={{ bottom: 0, background: '#555' }}
      />
    </VariantBox>
  );
});