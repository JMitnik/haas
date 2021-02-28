import React from 'react';
import { QuestionNodeTypeEnum } from 'types/globalTypes';
import { ReactComponent as ChatIcon } from 'assets/icons/icon-chat-group.svg';

export const MapNodeToIcon = (type: QuestionNodeTypeEnum): React.FC<React.SVGProps<SVGSVGElement>> => {
    switch (type) {
        case QuestionNodeTypeEnum.CHOICE: {
            return ChatIcon;
        }
        
        default: {
            return ChatIcon;
        }
    }
}