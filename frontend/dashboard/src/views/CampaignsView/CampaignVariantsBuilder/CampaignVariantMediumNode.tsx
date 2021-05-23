import * as UI from '@haas/ui';
import { memo } from 'react';
import { MessageCircle } from 'react-feather';

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
  min-width: 70px;
  background: white;
  min-height: 50px;
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
  return (
    <VariantBox>
      <VariantLabelContainer>
        <UI.Helper fontSize="0.5rem">
          <UI.Flex alignItems="center">
            <UI.Icon>
              <MessageCircle />
            </UI.Icon>
            SMS
          </UI.Flex>
        </UI.Helper>
      </VariantLabelContainer>
      <Handle
        type="target"
        position={Position.Top}
        id="mediumTarget"
        style={{ top: 0, background: '#555' }}
      />
    </VariantBox>
  );
});