import { Request, Response } from "express";
import { GuerrillamailService } from "../services/GuerrillamailService";

export class GuerrillamailController {
  async getEmailAddress(request: Request, response: Response) {
    const service = new GuerrillamailService();
    const result = await service.getEmailAddress();

    if (result instanceof Error) {
      return response.status(400).json(result.message);
    }
    return response.json(result);
  }
  async getVerificationCode(request: Request, response: Response) {
    const service = new GuerrillamailService();
    const result = await service.getVerificationCode('teste');

    if (result instanceof Error) {
      return response.status(400).json(result.message);
    }
    return response.json(result);
  }
}
