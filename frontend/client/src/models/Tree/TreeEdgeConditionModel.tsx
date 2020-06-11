import { Instance, types } from 'mobx-state-tree';

const TreeEdgeConditionModel: any = types
  .model({
    id: types.identifierNumber,
    conditionType: types.string,
    renderMin: types.maybeNull(types.number),
    renderMax: types.maybeNull(types.number),
    matchValue: types.maybeNull(types.string),
    __typename: types.maybeNull(types.string),
  });

export interface TreeEdgeConditionProps extends Instance<typeof TreeEdgeConditionModel>{}

export default TreeEdgeConditionModel;
