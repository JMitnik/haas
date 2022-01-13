import { QuestionNodeTypeEnum } from '../../types/generated-types';
import { Dialogue, QuestionNode } from '../../types/helper-types';

export const makePostLeafNode = (dialogue: Dialogue): QuestionNode => ({
  id: '-1',
  children: [],
  isLeaf: true,
  isRoot: false,
  links: [],
  options: [],
  type: QuestionNodeTypeEnum.Generic,
  // title: dialogue.
});
