import { Event } from 'components/Analytics/Common/EventBars/EventBars';

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
