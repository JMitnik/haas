import { SocialShareNode as LinkNode } from 'modules/SocialShareNode';
import { QuestionNodeTypeEnum } from 'types/core-types';
import { SliderNode } from 'modules/SliderNode';
import ChoiceNode from 'modules/MultiChoiceNode/MultiChoiceNode';
import FormNode from 'modules/FormNode/FormNode';
import ShareNode from 'modules/ShareNode/ShareNode';

import { GenericQuestionNodeProps } from './Node.types';
import PostLeafNode from '../PostLeafNode/PostLeafNode';
import VideoNode from '../VideoNode/VideoEmbeddedNode';

export const MapNode: { [key in QuestionNodeTypeEnum]?: React.FC<GenericQuestionNodeProps> } = {
  [QuestionNodeTypeEnum.Slider]: SliderNode,
  [QuestionNodeTypeEnum.Choice]: ChoiceNode,
  [QuestionNodeTypeEnum.Textbox]: ChoiceNode,
  [QuestionNodeTypeEnum.Form]: FormNode,
  [QuestionNodeTypeEnum.Link]: LinkNode,
  [QuestionNodeTypeEnum.Registration]: ChoiceNode,
  [QuestionNodeTypeEnum.Share]: ShareNode,
  [QuestionNodeTypeEnum.VideoEmbedded]: VideoNode,
  [QuestionNodeTypeEnum.Generic]: PostLeafNode,
};
