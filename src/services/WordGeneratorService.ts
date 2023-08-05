import { rword } from "rword";

export class WordGeneratorService {
  async generateEmail(): Promise<any> {
    const words = rword.generate(3, { length: '3-4' });
    return `${words[0]}${words[1]}${words[2]}`;
  }
}
