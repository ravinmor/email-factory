import * as puppeteer from "puppeteer";
import { v4 as uuidv4 } from 'uuid';

import { PuppeteerService } from "./PuppeteerService";
import { WordGeneratorService } from "./WordGeneratorService";
import { GuerrillamailService } from "./GuerrillamailService";

interface SelectorsInterface {
  emailFieldSelector: string;
  passwordFieldSelector: string;
  passwordConfirmationFieldSelector: string;
  buttonCreateAccountSelector: string;
  buttonFreeAccountSelector: string;
  recoveryEmailSelector: string;
  getVerificationCodeButtonSelector: string;

}

export class EmailService {
  async createProtonEmail(): Promise<any> {
    const selectors: SelectorsInterface = {
      emailFieldSelector: "#email",
      passwordFieldSelector: "#password",
      passwordConfirmationFieldSelector: "#repeat-password",
      buttonCreateAccountSelector: "div.sign-layout-main-content > form > button",
      buttonFreeAccountSelector: "div.sign-layout-main-content > div > button",
      recoveryEmailSelector: "#email",
      getVerificationCodeButtonSelector: "div.sign-layout-main-content > button",
    }

    const generatorService = new WordGeneratorService();


    const gmServic = new GuerrillamailService();
    const tempEmail: any = await gmServic.getEmailAddress();

    console.log(tempEmail);
    const emailData = {
      emailName: await generatorService.generateEmail(),
      password: uuidv4(),
      recoveryEmail: tempEmail.email_address,
    }
    
    const puppeteerService = new PuppeteerService();
    const browser = await puppeteer.launch({ headless: false });

    const { page, _browser } = await puppeteerService.instantiatePuppeteerStealthNewPage(browser, 'https://account.proton.me/signup');

    console.log('> Typing email and password');
    // Email and password
    await page.waitForSelector(selectors.emailFieldSelector);
    await page.waitForTimeout(3000)
    await page.type(selectors.emailFieldSelector, emailData.emailName, { delay: 50 });
    await page.type(selectors.passwordFieldSelector, emailData.password, { delay: 50 });
    await page.type(selectors.passwordConfirmationFieldSelector, emailData.password, { delay: 50 });

    console.log('> Create account button');
    // Click create account button
    await page.waitForTimeout(800)
    await page.click(selectors.buttonCreateAccountSelector);
    
    console.log('> Free account button');
    // Click free account button
    await page.waitForSelector(selectors.buttonFreeAccountSelector);
    await page.click(selectors.buttonFreeAccountSelector);

    console.log('> Typing recovery email');
    // Type the recovery email
    await page.waitForSelector(selectors.recoveryEmailSelector);
    await page.waitForTimeout(3000)
    await page.type(selectors.recoveryEmailSelector, emailData.recoveryEmail, { delay: 50 });

    console.log('> Get verification code button');
    // Click get verification code button
    await page.waitForTimeout(800)
    await page.click(selectors.getVerificationCodeButtonSelector);

    return {
      ...emailData,
      ...tempEmail
    };
  }
}
