import { QuestionNodeTypeEnum } from 'types/core-types';
import ChoiceNode from 'views/NodeView/nodes/MultiChoiceNode/MultiChoiceNode';
import FormNode from 'views/NodeView/nodes/FormNode/FormNode';
import LinkNode from 'views/NodeView/nodes/SocialShareNode/SocialShareNode';
import ShareNode from 'views/NodeView/nodes/ShareNode/ShareNode';
import SliderNode from 'views/NodeView/nodes/SliderNode/SliderNode';

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
