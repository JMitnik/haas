export interface DialogueServiceType {
  findDialogueIdsByCustomerId(customerId: string): Promise<Array<string>>;
}