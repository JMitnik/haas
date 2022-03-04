import { Routes, Route } from 'react-router-dom';

import { Dialogue as DialogueType, Workspace, SessionActionInput } from '../../types/core-types';
import { Dialogue } from '../Dialogue/Dialogue';
import NotFound from './NotFound';
import { FallbackRouter } from './FallbackRouter';

interface DialogueRouterProps {
  dialogue: DialogueType;
  workspace: Workspace;
  onEventUpload: (events: SessionActionInput[]) => void;
}

export const DialogueRoutes = ({ dialogue, onEventUpload }: DialogueRouterProps) => {
  return (
    <Routes>
      <Route path="/:workspace/:dialogue">
        <Route index element={<FallbackRouter dialogue={dialogue}/>}/>
        <Route path="n/:nodeId" element={<Dialogue onEventUpload={onEventUpload} dialogue={dialogue}/>}/>
        <Route path="404" element={<NotFound/>}/>
      </Route>
    </Routes>
  )
}
