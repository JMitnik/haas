import { Dialogue } from 'types/generic';

export const mockEmptyDialogue = (): Dialogue => {
    return {
        questions: [],
        leafs: [],
        rootQuestion: {
            id: '1',
            children: [],
            title: 'How do you feel about Mock',
            type: 'SLIDER',
        }
    };
}
