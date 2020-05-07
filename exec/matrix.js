import cypress from "../src/docs/matrix/cypress";
import nightwatch from "../src/docs/matrix/nightwatch";
import wd from "../src/docs/matrix/wd";
import testcafe from "../src/docs/matrix/testcafe";
import commonMatrix from "../src/docs/matrix/framework";

function matrix() {
  cypress();
  nightwatch();
  wd();
  testcafe();
  commonMatrix("playwright");
  commonMatrix("puppeteer");
  commonMatrix("protractor");
  commonMatrix("selenium-webdriver");
  commonMatrix("webdriverio");
}

matrix();
