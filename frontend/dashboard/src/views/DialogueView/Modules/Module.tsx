import * as UI from '@haas/ui';
import styled from 'styled-components';

const ModuleContainer = styled(UI.Div)`
  ol {
      padding: 12px 24px;
  }

  ${UI.CardBody} {
    overflow: hidden;
  }
`;

export default ModuleContainer;
