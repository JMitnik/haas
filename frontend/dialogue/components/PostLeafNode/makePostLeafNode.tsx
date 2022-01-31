import { QuestionNodeTypeEnum } from '../../types/generated-types';
import { Dialogue, QuestionNode } from '../../types/core-types';

/**
 * Generate a post-leaf node based on the dialouge properties.
 */
export const makePostLeafNode = (dialogue: Dialogue): QuestionNode => ({
  id: '-1',
  children: [],
  isLeaf: true,
  isRoot: false,
  links: [],
  options: [],
  type: QuestionNodeTypeEnum.Generic,
  title: dialogue.postLeafNode?.header || '',
  postLeafBody: dialogue.postLeafNode?.subtext || '',
});
