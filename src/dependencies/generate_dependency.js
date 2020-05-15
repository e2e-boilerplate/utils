/* eslint-disable no-shadow */
import babel from "./babel";
import common from "./common";
import cypress from "./cypress";
import eslint from "./eslint";
import nightwatch from "./nightwatch";
import playwright from "./playwright";
import protractor from "./protractor";
import puppeteer from "./puppeteer";
import seleniumWebdriver from "./selenium-webdriver";
import testCafe from "./testcafe";
import tslint from "./tslint";
import typescript from "./typescript";
import wd from "./wd";
import webdriverIo from "./webdriverio";
import { logger, miscRepos } from "../common/constants";

/**
 * Given repo name generate dependencies and devDependencies
 * @param name: repository name
 */
export default function generateDependency(name) {
  let dep = {};
  let devDep = {};

  function merge(dependencies, devDependencies) {
    dep = { ...dep, ...dependencies };
    devDep = { ...devDep, ...devDependencies };
  }

  try {
    if (!miscRepos.includes(name)) {
      const parts = name.split("-");

      const { dependencies, devDependencies } = common(name);
      merge(dependencies, devDependencies);

      if (parts.includes("babel")) {
        const { dependencies, devDependencies } = babel(name);
        merge(dependencies, devDependencies);
      }

      if (parts.includes("cypress")) {
        const { dependencies, devDependencies } = cypress(name);
        merge(dependencies, devDependencies);
      }

      if (parts.includes("cypress")) {
        const { dependencies, devDependencies } = cypress(name);
        merge(dependencies, devDependencies);
      }

      if (parts.includes("es", "modules") || parts.includes("commonjs")) {
        const { dependencies, devDependencies } = eslint(name);
        merge(dependencies, devDependencies);
      }

      if (parts.includes("nightwatch")) {
        const { dependencies, devDependencies } = nightwatch(name);
        merge(dependencies, devDependencies);
      }

      if (parts.includes("playwright")) {
        const { dependencies, devDependencies } = playwright(name);
        merge(dependencies, devDependencies);
      }

      if (parts.includes("protractor")) {
        const { dependencies, devDependencies } = protractor(name);
        merge(dependencies, devDependencies);
      }

      if (parts.includes("puppeteer")) {
        const { dependencies, devDependencies } = puppeteer(name);
        merge(dependencies, devDependencies);
      }

      if (parts.includes("selenium", "webdriver")) {
        const { dependencies, devDependencies } = seleniumWebdriver(name);
        merge(dependencies, devDependencies);
      }

      if (parts.includes("testcafe")) {
        const { dependencies, devDependencies } = testCafe(name);
        merge(dependencies, devDependencies);
      }

      if (parts.includes("typescript")) {
        const { dependencies, devDependencies } = typescript(name);
        const lint = tslint(name);
        merge(dependencies, devDependencies);
        merge(lint.dependencies, lint.devDependencies);
      }

      if (parts.includes("wd")) {
        const { dependencies, devDependencies } = wd(name);
        merge(dependencies, devDependencies);
      }

      if (parts.includes("webdriverio")) {
        const { dependencies, devDependencies } = webdriverIo(name);
        merge(dependencies, devDependencies);
      }

      logger.info(`\nGenerate dependencies and devDependencies for \n${name}`);
    }
  } catch (error) {
    logger.error(`\nGenerate dependency, \n${error}: \n${__filename}`);
  }

  return { dep, devDep };
}
