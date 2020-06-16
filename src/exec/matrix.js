import commonMatrix from "../docs/matrix/framework";
import cypress from "../docs/matrix/cypress";
import nightwatch from "../docs/matrix/nightwatch";
import testcafe from "../docs/matrix/testcafe";
import wd from "../docs/matrix/wd";

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
