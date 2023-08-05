import puppeteer from "puppeteer-extra";
import { v4 as uuidv4 } from 'uuid';
import RecaptchaPlugin from 'puppeteer-extra-plugin-recaptcha'

import { PuppeteerService } from "./PuppeteerService";
import { WordGeneratorService } from "./WordGeneratorService";

interface SelectorsInterface {
  signupButtonSelector: string;
  buttonFreeAccountSelector: string;
  disclaimerAccountOwnerSelector: string;
  disclaimerAccountBusinessSelector: string;
  buttonOKDisclaimerSelector: string;
  emailFieldSelector: string;
  passwordFieldSelector: string;
  passwordConfirmationFieldSelector: string;
  disclaimerTermsAndConditionsSelector: string;
  disclaimerOver16Selector: string;
  checkEmailSelector: string;
  buttonCreateAccountSelector: string;
  cancelCaptchaButtonSelector: string;
  createdAccountButtonSelector: string;

  loginEmailSelector: string;
  loginPasswordSelector: string;
  buttonLoginSelector: string;
}
export class EmailService {
  async createTutaNotaEmail(): Promise<any> {
    const selectors: SelectorsInterface = {
      signupButtonSelector: "div.flex-center.flex-column > button:nth-child(1)",
      buttonFreeAccountSelector: "div.buyOptionBox > div.button-min-height > button",
      disclaimerAccountOwnerSelector: "div:nth-child(2) > div:nth-child(1) > div > input[type=checkbox]",
      disclaimerAccountBusinessSelector: "div:nth-child(2) > div:nth-child(2) > div > input[type=checkbox]",
      buttonOKDisclaimerSelector: "div.flex-center.dialog-buttons > button:nth-child(2)",
      emailFieldSelector: "div.text-field.rel.overflow-hidden.text.pt > div > div > div > div.flex-grow.rel > input",
      passwordFieldSelector: "#signup-account-dialog > div > div:nth-child(2) > div:nth-child(1) > div > div > div > div.flex-grow.rel > input",
      passwordConfirmationFieldSelector: "div:nth-child(2) > div > div > div > div.flex-grow.rel > input",
      disclaimerTermsAndConditionsSelector: "#signup-account-dialog > div > div:nth-child(3) > div > input[type=checkbox]",
      disclaimerOver16Selector: "#signup-account-dialog > div > div:nth-child(4) > div > input[type=checkbox]",
      checkEmailSelector: '#signup-account-dialog > div > div.text-field.rel.overflow-hidden.text.pt > small > div',
      buttonCreateAccountSelector: "#signup-account-dialog > div > div.mt-l.mb-l > button",
      cancelCaptchaButtonSelector: '#modal > div:nth-child(3) > div > div > div > div.dialog-header.plr-l > div > div.flex-third.overflow-hidden.ml-negative-s > button',
      createdAccountButtonSelector: '#wizardDialogContent > div.flex-center.full-width.pt-l > div > button',
      loginEmailSelector: '#login-view > div.flex-grow.flex-center.scroll > div > div.content-bg.border-radius-big.pb.plr-l > div.flex.col.pb > form > div:nth-child(1) > div > div > div > div > div > input',
      loginPasswordSelector: '#login-view > div.flex-grow.flex-center.scroll > div > div.content-bg.border-radius-big.pb.plr-l > div.flex.col.pb > form > div:nth-child(2) > div > div > div > div > div > input',
      buttonLoginSelector: '#login-view > div.flex-grow.flex-center.scroll > div > div.content-bg.border-radius-big.pb.plr-l > div.flex.col.pb > form > div:nth-child(4) > button'
    }

    puppeteer.use(RecaptchaPlugin({
      provider: {
          id: process.env.CAPTCHA_SERVICE,
          token: process.env.CAPTCHA_TOKEN 
      },
      visualFeedback: true,
      solveInactiveChallenges:true
    })
);
    const generatorService = new WordGeneratorService();

    const emailData = {
      emailName: await generatorService.generateEmail(),
      password: uuidv4(),
    }
    
    const puppeteerService = new PuppeteerService();
    const browser = await puppeteer.launch({ headless: false });

    // const { page, _browser } = await puppeteerService.instantiatePuppeteerStealthNewPage(browser, );
    
    const page = await browser.newPage();
    await page.goto(
      'https://mail.tutanota.com/login',
      { 
        waitUntil: 'networkidle2',
        timeout: 0
      }
    );
    
    console.log('> Sign Up button');
    await page.waitForSelector(selectors.signupButtonSelector);
    await page.click(selectors.signupButtonSelector);

    console.log('> Free account button');
    await page.waitForSelector(selectors.buttonFreeAccountSelector);
    await page.click(selectors.buttonFreeAccountSelector);

    console.log('> Disclaimer Owner Input Box');
    await page.waitForSelector(selectors.disclaimerAccountOwnerSelector);
    await new Promise(r => setTimeout(r, 400));
    await page.click(selectors.disclaimerAccountOwnerSelector);

    console.log('> Disclaimer Business Input Box');
    await page.waitForSelector(selectors.disclaimerAccountBusinessSelector);
    await new Promise(r => setTimeout(r, 200));
    await page.click(selectors.disclaimerAccountBusinessSelector);

    console.log('> Disclaimer Button');
    await page.waitForSelector(selectors.buttonOKDisclaimerSelector);
    await new Promise(r => setTimeout(r, 300));
    await page.click(selectors.buttonOKDisclaimerSelector);

    console.log('> Typing email and password');
    await page.waitForSelector(selectors.emailFieldSelector);
    await new Promise(r => setTimeout(r, 3000));
    await page.type(selectors.emailFieldSelector, emailData.emailName, { delay: 50 });
    await new Promise(r => setTimeout(r, 300));
    await page.click(selectors.passwordFieldSelector);
    await new Promise(r => setTimeout(r, 300));
    await page.type(selectors.passwordFieldSelector, emailData.password, { delay: 50 });
    await new Promise(r => setTimeout(r, 300));
    await page.type(selectors.passwordConfirmationFieldSelector, emailData.password, { delay: 50 });

    console.log('> Disclaimer Terms And Conditions Input Box');
    await page.waitForSelector(selectors.disclaimerTermsAndConditionsSelector);
    await new Promise(r => setTimeout(r, 400));
    await page.click(selectors.disclaimerTermsAndConditionsSelector);

    console.log('> Disclaimer Over 16 Input Box');
    await page.waitForSelector(selectors.disclaimerOver16Selector);
    await new Promise(r => setTimeout(r, 200));
    await page.click(selectors.disclaimerOver16Selector);

    let emailIsavailable = false
    while (!emailIsavailable) {
      const emailIsChecked = await page.$eval(selectors.checkEmailSelector, (el: HTMLElement) => { return el.innerText.includes('Email address is available')});
      if(emailIsChecked)
        emailIsavailable = true
    }

    console.log('> Create Account Button');
    await new Promise(r => setTimeout(r, 300));
    await page.click(selectors.buttonCreateAccountSelector);
    await new Promise(r => setTimeout(r, 400));
    await page.click(selectors.buttonCreateAccountSelector);
    await new Promise(r => setTimeout(r, 800));
    await page.click(selectors.buttonCreateAccountSelector);

    console.log('> Solving Captcha');
    await page.waitForSelector(selectors.cancelCaptchaButtonSelector, { timeout: 60000 });
    await page.solveRecaptchas();
    
    await new Promise(r => setTimeout(r, 18000));
    
    await page.close()
    await browser.close();

    return {
      ...emailData,
      emailName: `${emailData.emailName}@tutanota.com`
    };
  }
}
