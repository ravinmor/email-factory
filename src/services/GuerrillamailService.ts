import * as puppeteer from "puppeteer";
import { PuppeteerService } from "./PuppeteerService";
import GuerrillamailNodeApi from "guerrillamail-node-api";

export class GuerrillamailService {
    async getEmailAddress(): Promise<unknown> {
        const email = new GuerrillamailNodeApi();
        await email.get_email_address();
        return email;
    }
    async getVerificationCode(emailInstance: any): Promise<any> {
        const emailWithVerificationCode = await emailInstance.fetch_email(emailInstance.inbox[1]);

        const verificationCode = 'Your Proton verification code is: <br>679337'.split('<br>')[1]

        return verificationCode;
    }
}
