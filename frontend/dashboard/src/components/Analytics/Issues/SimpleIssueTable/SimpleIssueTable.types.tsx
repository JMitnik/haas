import { Event } from 'components/Analytics/Common/EventBars/EventBars.helpers';

export enum ActionType {
  Contact = 'contact',
}

export interface Issue {
  topic: string;
  dialogueId: string;
  dialogueName: string;
  score: number;
  voteCount: number;
  events: Event[];
  action?: ActionType;
}
