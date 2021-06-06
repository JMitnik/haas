import { User } from "@prisma/client";
import { NexusGenInputs } from "../../generated/nexus";

export interface AuthServiceType {
  registerUser(userInput: NexusGenInputs['RegisterInput']): Promise<User>;
  verifyUserRefreshToken(userId: string): Promise<boolean>;
}