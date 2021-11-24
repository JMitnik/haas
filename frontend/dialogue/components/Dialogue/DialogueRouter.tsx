import { Routes, Route, useLocation } from 'react-router-dom';

import { GenericNodeRenderer } from 'components/GenericNode/GenericNodeRenderer';

export const DialogueRouter = () => {
  let loc = useLocation();
  console.log(loc);
  return (
    <Routes>
      <Route path="/:workspace/:dialogue">
        <Route path="n/:nodeId" element={<GenericNodeRenderer />} />
      </Route>
    </Routes>
  )
}
