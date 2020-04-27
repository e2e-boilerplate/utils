import cypress from "../src/docs/matrix/cypress";
import nightwatch from "../src/docs/matrix/nightwatch";
import wd from "../src/docs/matrix/wd";
import commonMatrix from "../src/docs/matrix/framework";

function matrix() {
  cypress();
  nightwatch();
  wd();
  commonMatrix("playwright");
  commonMatrix("puppeteer");
  commonMatrix("protractor");
  commonMatrix("selenium-webdriver");
  commonMatrix("webdriverio");
}

matrix();
