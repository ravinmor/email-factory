import { Request, Response } from "express";
import { EmailService } from "../services/EmailService";

export class EmailController {
  async createTutaNotaEmail(request: Request, response: Response) {
    const service = new EmailService();
    const result = await service.createTutaNotaEmail();

    if (result instanceof Error) {
      return response.status(400).json(result.message);
    }
    return response.json(result);
  }
}
