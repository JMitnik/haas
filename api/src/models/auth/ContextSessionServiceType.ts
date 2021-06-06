import { ContextSessionType } from "./ContextSessionType";

export interface ContextSessionServiceType {
  constructContextSession(): Promise<ContextSessionType | null>;
}