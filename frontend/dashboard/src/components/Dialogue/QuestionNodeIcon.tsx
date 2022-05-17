import { Eye, HelpCircle } from 'react-feather';
import React from 'react';

import { ReactComponent as FormNodeIcon } from 'assets/icons/icon-survey.svg';
import { ReactComponent as MultiChoiceIcon } from 'assets/icons/multi-choice-icon.svg';
import { QuestionNodeTypeEnum } from 'types/generated-types';
import { ReactComponent as SliderIcon } from 'assets/icons/haas.svg';
import LinkIcon from 'components/Icons/LinkIcon';
import VideoIcon from 'components/Icons/VideoIcon';

const FormIcon = () => (
  <>
    <FormNodeIcon style={{ margin: '0 auto', width: '70%' }} />
  </>
);

const MapQuestionNodeIcon: { [key in QuestionNodeTypeEnum]?: React.FC<{ color?: string }> } = {
  [QuestionNodeTypeEnum.Slider]: SliderIcon,
  [QuestionNodeTypeEnum.Choice]: MultiChoiceIcon,
  [QuestionNodeTypeEnum.Form]: FormIcon,
  [QuestionNodeTypeEnum.Generic]: Eye,
  [QuestionNodeTypeEnum.Link]: LinkIcon,
  [QuestionNodeTypeEnum.VideoEmbedded]: VideoIcon,
};

export const QuestionNodeIcon = ({ nodeType }: { nodeType: QuestionNodeTypeEnum }) => {
  const MappedCampaignIcon = MapQuestionNodeIcon[nodeType];

  if (!MappedCampaignIcon) {
    return <HelpCircle />;
  }

  return <MappedCampaignIcon />;
};
