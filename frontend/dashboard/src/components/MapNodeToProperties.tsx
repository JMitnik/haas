import { ReactComponent as ChatIcon } from 'assets/icons/icon-chat-group.svg';
import { ReactComponent as CursorIcon } from 'assets/icons/icon-cursorclick.svg';
import { ReactComponent as FormIcon } from 'assets/icons/icon-identification.svg';
import { ReactComponent as LinkIcon } from 'assets/icons/icon-link.svg';
import { ReactComponent as ListIcon } from 'assets/icons/icon-list.svg';
import { QuestionNodeTypeEnum } from 'types/generated-types';
import { ReactComponent as RegisterIcon } from 'assets/icons/icon-pencil.svg';
import { ReactComponent as SlidersIcon } from 'assets/icons/icon-sliders.svg';
import { ReactComponent as TextboxIcon } from 'assets/icons/icon-annotation.svg';
import { ReactComponent as VideoIcon } from 'assets/icons/icon-youtube.svg';

export interface MapNodeToPropertiesOutput {
  icon: any;
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

    case QuestionNodeTypeEnum.Slider: {
      return {
        icon: SlidersIcon,
        bg: '#FE3274',
        color: '#f9fbfa',
      };
    }

    case QuestionNodeTypeEnum.Choice: {
      return {
        icon: ListIcon,
        bg: '#7997F8',
        color: '#f9fbfa',
      };
    }

    case QuestionNodeTypeEnum.VideoEmbedded: {
      return {
        icon: VideoIcon,
        bg: '#2CB1BC',
        color: '#f9fbfa',
      };
    }

    case QuestionNodeTypeEnum.Share: {
      return {
        icon: ChatIcon,
        bg: '#0ae47f',
        color: '#f9fbfa',
      };
    }

    case QuestionNodeTypeEnum.Link: {
      return {
        icon: LinkIcon,
        bg: '#7997f8',
        color: '#f9fbfa',
      };
    }

    case QuestionNodeTypeEnum.Registration: {
      return {
        icon: RegisterIcon,
        bg: '#dddded',
        color: 'transparent',
        stroke: '#323546',
      };
    }

    case QuestionNodeTypeEnum.Textbox: {
      return {
        icon: TextboxIcon,
        bg: '#dddded',
        color: 'transparent',
        stroke: '#323546',
      };
    }

    case QuestionNodeTypeEnum.Form: {
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
