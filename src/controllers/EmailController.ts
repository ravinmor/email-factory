import { Request, Response } from "express";
import { EmailService } from "../services/EmailService";

export class EmailController {
  async createProtonEmail(request: Request, response: Response) {
    const service = new EmailService();
    const result = await service.createProtonEmail();

    if (result instanceof Error) {
      return response.status(400).json(result.message);
    }
    return response.json(result);
  }
  async createGmailEmails(request: Request, response: Response) {
    return response.json({ message: "Method not implemented." });
  }
}
