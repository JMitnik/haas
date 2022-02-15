import { ReactComponent as ChatIcon } from 'assets/icons/icon-chat-group.svg';
import { ReactComponent as CursorIcon } from 'assets/icons/icon-cursorclick.svg';
import { ReactComponent as FormIcon } from 'assets/icons/icon-identification.svg';
import { ReactComponent as LinkIcon } from 'assets/icons/icon-link.svg';
import { QuestionNodeTypeEnum } from 'types/globalTypes';
import { ReactComponent as RegisterIcon } from 'assets/icons/icon-pencil.svg';
import { ReactComponent as TextboxIcon } from 'assets/icons/icon-annotation.svg';
import React from 'react';

export interface MapNodeToPropertiesOutput {
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  bg: string;
  color: string;
  stroke?: string;
}

export const MapNodeToProperties = (type: (QuestionNodeTypeEnum | 'DIALOGUE')): MapNodeToPropertiesOutput => {
  switch (type) {
    case 'DIALOGUE': {
      return {
        bg: '#F7C948',
        color: 'white',
        icon: CursorIcon,
      };
    }

    case QuestionNodeTypeEnum.SHARE: {
      return {
        icon: ChatIcon,
        bg: '#0ae47f',
        color: '#f9fbfa',
      };
    }

    case QuestionNodeTypeEnum.LINK: {
      return {
        icon: LinkIcon,
        bg: '#7997f8',
        color: '#f9fbfa',
      };
    }

    case QuestionNodeTypeEnum.REGISTRATION: {
      return {
        icon: RegisterIcon,
        bg: '#dddded',
        color: 'transparent',
        stroke: '#323546',
      };
    }

    case QuestionNodeTypeEnum.TEXTBOX: {
      return {
        icon: TextboxIcon,
        bg: '#dddded',
        color: 'transparent',
        stroke: '#323546',
      };
    }

    case QuestionNodeTypeEnum.FORM: {
      return {
        icon: FormIcon,
        bg: '#fe3274',
        color: '#f9fbfa',
      };
    }

    default: {
      return {
        icon: CursorIcon,
        bg: '#e4e5ec',
        color: '#323546',
      };
    }
  }
};
