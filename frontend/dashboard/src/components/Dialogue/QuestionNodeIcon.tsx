import { Eye, HelpCircle } from 'react-feather';
import React from 'react';

import { QuestionNodeTypeEnum } from 'types/generated-types';
import LinkIcon from 'components/Icons/LinkIcon';
import MultiChoiceNodeIcon from 'components/Icons/MultiChoiceNodeIcon';
import OpinionIcon from 'components/Icons/OpinionIcon';
import RegisterIcon from 'components/Icons/RegisterIcon';
import ShareIcon from 'components/Icons/ShareIcon';
import SliderNodeIcon from 'components/Icons/SliderNodeIcon';
import SurveyIcon from 'components/Icons/SurveyIcon';

const MapQuestionNodeIcon: { [key in QuestionNodeTypeEnum]?: React.FC<{ color?: string }> } = {
  [QuestionNodeTypeEnum.Slider]: SliderNodeIcon,
  [QuestionNodeTypeEnum.Choice]: MultiChoiceNodeIcon,
  [QuestionNodeTypeEnum.Form]: SurveyIcon,
  [QuestionNodeTypeEnum.Generic]: Eye,
  [QuestionNodeTypeEnum.Link]: LinkIcon,
  [QuestionNodeTypeEnum.Registration]: RegisterIcon,
  [QuestionNodeTypeEnum.Share]: ShareIcon,
  [QuestionNodeTypeEnum.Textbox]: OpinionIcon,
};

export const QuestionNodeIcon = ({ nodeType }: { nodeType: QuestionNodeTypeEnum }) => {
  const MappedCampaignIcon = MapQuestionNodeIcon[nodeType];

  if (!MappedCampaignIcon) {
    return <HelpCircle />;
  }

  return <MappedCampaignIcon />;
};
