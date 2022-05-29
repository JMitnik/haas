import { HexagonState } from '../WorkspaceGrid.types';

export interface SummaryPaneProps {
  startDate: Date;
  endDate: Date;
  currentState: HexagonState;
  onDialogueChange?: any;
}
