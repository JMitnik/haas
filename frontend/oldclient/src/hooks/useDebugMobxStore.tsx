import { onPatch } from 'mobx-state-tree';

const useDebugMobx = (store: any) => {
  onPatch(store, (change) => {
    console.log('Got MobX change: ', change);
  });
};

export default useDebugMobx;
