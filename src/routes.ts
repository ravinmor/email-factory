import { Router } from "express";
import { EmailController } from "./controllers/EmailController";
import { GuerrillamailController } from "./controllers/GuerrillamailController";

const routes = Router();

routes.get("/createProtonEmail", new EmailController().createProtonEmail);
routes.get("/createGmailEmails", new EmailController().createGmailEmails);

routes.get("/getEmailAddress", new GuerrillamailController().getEmailAddress);
routes.get("/getVerificationCode", new GuerrillamailController().getVerificationCode);

export { routes };
