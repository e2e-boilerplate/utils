import cypress from "../src/docs/matrix/cypress";
import nightwatch from "../src/docs/matrix/nightwatch";
import wd from "../src/docs/matrix/wd";
import commonMatrix from "../src/docs/matrix/framework";

async function matrix() {
  await cypress();
  await nightwatch();
  await wd();
  await commonMatrix("playwright");
  await commonMatrix("puppeteer");
  await commonMatrix("protractor");
  await commonMatrix("selenium-webdriver");
  await commonMatrix("webdriverio");
}

matrix().then();
