import { Instance, types } from 'mobx-state-tree';

const TreeDialogueFinisherModel = types
  .model({
    header: types.string,
    subtext: types.string,
  });

export interface TreeShareProps extends Instance<typeof TreeDialogueFinisherModel> { }

export default TreeDialogueFinisherModel;
