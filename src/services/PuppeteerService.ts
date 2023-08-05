import puppeteer from 'puppeteer-extra';
import UserAgents from 'user-agents';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

const USER_AGENT = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.75 Safari/537.36';
puppeteer.use(StealthPlugin())

export class PuppeteerService {
  async instantiatePuppeteerStealthNewPage(browser: any, url: string) {
    puppeteer.use(StealthPlugin())

    const page = await browser.newPage();

    // > Skip dialog
    page.on("dialog", async (dialog: any) => {
      await dialog.dismiss();
    });

    // > Randomize User-agent or Set a valid one (via user-agents)
    const userAgent = new UserAgents();
    const USER_AGENT = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36';
    const UA = userAgent.toString() || USER_AGENT;
    await page.setUserAgent(UA);
    await page.setJavaScriptEnabled(true);
    await page.setDefaultNavigationTimeout(0);

    // > Randomize Viewport size
    await page.setViewport({
      width: 1920 + Math.floor(Math.random() * 100),
      height: 3000 + Math.floor(Math.random() * 100),
      deviceScaleFactor: 1,
      hasTouch: false,
      isLandscape: false,
      isMobile: false,
    });


    await page.setRequestInterception(true);

    // > Skip images/styles/fonts loading for better performance
    // page.on('request', (req) => {
    //   if(req.resourceType() == 'stylesheet' || req.resourceType() == 'font' || req.resourceType() == 'image'){
    //     req.abort();
    //   } else {
    //     req.continue();
    //   }
    // });

    // > Pass "WebDriver check"
    await page.evaluateOnNewDocument(() => {
      Object.defineProperty(navigator, 'webdriver', {
          get: () => false,
      });
    });

    // > Pass "Chrome check"
    await page.evaluateOnNewDocument(() => {
      //@ts-ignore
      window.chrome = {
        runtime: {},
        // etc.
      };
    });

    // > Pass "Notifications check"
    await page.evaluateOnNewDocument(() => {
      const originalQuery = window.navigator.permissions.query;
      //@ts-ignore
      return window.navigator.permissions.query = (parameters) => (
        parameters.name === 'notifications' ?
          Promise.resolve({ state: Notification.permission }) :
          originalQuery(parameters)
      );
    });

    // > Pass "Plugins check"
    await page.evaluateOnNewDocument(() => {
      // Overwrite the `plugins` property to use a custom getter.
      Object.defineProperty(navigator, 'plugins', {
        // This just needs to have `length > 0` for the current test,
        // but we could mock the plugins too if necessary.
        get: () => [1, 2, 3, 4, 5],
      });
    });

    // > Pass "Languages check"
    await page.evaluateOnNewDocument(() => {
      // Overwrite the `plugins` property to use a custom getter.
      Object.defineProperty(navigator, 'languages', {
          get: () => ['en-US', 'en'],
      });
    });
    
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 0 });

    const client = await page.target().createCDPSession();
    await client.send("Network.clearBrowserCookies");
    await client.send("Network.clearBrowserCache");

    let redirects: any[] = [];

    await client.send("Network.enable");
    client.on("Network.requestWillBeSent", (e: any) => {
      if (e.type !== "Document") {
        return;
      }
      redirects.push(e.documentURL);
    });

    return {
      page: page,
      _browser: browser
    };
  }
}
