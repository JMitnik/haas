import { NexusGenInputs } from '../../generated/nexus';

type Modify<T, R> = Omit<T, keyof R> & R;

export type ActionableFilterInput = NexusGenInputs['ActionableFilterInput'];
