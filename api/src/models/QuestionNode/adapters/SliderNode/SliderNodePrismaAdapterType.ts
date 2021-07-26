export interface UpdateSliderNodeInput {
  happyText: string | null;
  unhappyText: string | null;
  markers?: {
    id?: string | null | undefined;
    label: string;
    range?: {
      end?: number | null | undefined;
      start?: number | null | undefined;
    } | null | undefined;
    subLabel: string;
  }[] | null | undefined;
}

export interface CreateSliderNodeInput extends UpdateSliderNodeInput {
  parentNodeId: string;
}