import { MailServiceType } from "../../services/mailings/MailServiceTypes";
import { LoginServiceType } from "./LoginServiceType";

export class LoginService implements LoginServiceType {
  mailService: MailServiceType;

  constructor(mailService: MailServiceType) {
    this.mailService = mailService;
  }
}