export type UpdateShareInput = {
  title: string;
  url: string;
  tooltip: string;
}

export interface CreateShareInput extends UpdateShareInput {
  questionId: string;
};
