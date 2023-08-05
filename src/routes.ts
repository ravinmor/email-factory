import { Router } from "express";
import { EmailController } from "./controllers/EmailController";
import { GuerrillamailController } from "./controllers/GuerrillamailController";

const routes = Router();

routes.get("/createTutaNotaEmail", new EmailController().createTutaNotaEmail);

export { routes };
