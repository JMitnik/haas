import { NexusGenInputs } from "../../generated/nexus";
import { User } from "@prisma/client";

export interface UserServiceType {
  createUser(userInput: NexusGenInputs['UserInput']): Promise<User>;
  inviteNewUserToCustomer(email: string, customerId: string, roleId: string): Promise<void>;
}