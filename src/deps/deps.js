import * as deps from "./dependencies.json";
import { logger } from "../constants";

async function makeDeps(repo) {
  const { name } = repo;
  const parts = name.split("-");
  const dependencies = {};
  const devDependencies = {
    husky: deps.husky,
    prettier: deps.prettier,
  };

  try {
    if (parts.includes("typescript")) {
      devDependencies["tslint-config-prettier"] = deps["tslint-config-prettier"];
      devDependencies["tslint-plugin-prettier"] = deps["tslint-plugin-prettier"];
      devDependencies.tslint = deps.tslint;
      dependencies.typescript = deps.typescript;
      devDependencies["lint-staged"] = deps["lint-staged"];

      if (!parts.includes("cypress")) {
        devDependencies["@types/node"] = deps["@types/node"];
      }

      if (parts.includes("jest")) {
        devDependencies["@types/jest"] = deps["@types/jest"];
      }

      if (parts.includes("mocha")) {
        devDependencies["@types/mocha"] = deps["@types/mocha"];
      }

      if (parts.includes("chai")) {
        devDependencies["@types/chai"] = deps["@types/chai"];
      }

      if (parts.includes("selenium", "webdriver")) {
        devDependencies["@types/selenium-webdriver"] = deps["@types/selenium-webdriver"];
      }

      if (parts.includes("puppeteer")) {
        devDependencies["@types/puppeteer"] = deps["@types/puppeteer"];
      }

      if (parts.includes("jasmine")) {
        devDependencies["@types/jasmine"] = deps["@types/jasmine"];

        if (parts.includes("protractor")) {
          devDependencies["@types/jasminewd2"] = deps["@types/jasminewd2"];
        }
      }
    }

    if (!parts.includes("typescript")) {
      devDependencies.eslint = deps.eslint;
      devDependencies["eslint-config-airbnb-base"] = deps["eslint-config-airbnb-base"];
      devDependencies["eslint-config-prettier"] = deps["eslint-config-prettier"];
      devDependencies["eslint-plugin-import"] = deps["eslint-plugin-import"];
      devDependencies["eslint-plugin-prettier"] = deps["eslint-plugin-prettier"];
      devDependencies["pretty-quick"] = deps["pretty-quick"];

      if (parts.includes("cucumber")) {
        devDependencies["eslint-plugin-cucumber"] = deps["eslint-plugin-cucumber"];
      }

      if (parts.includes("webdriverio")) {
        devDependencies["eslint-plugin-wdio"] = deps["eslint-plugin-wdio"];
      }
    }

    if (parts.includes("babel")) {
      devDependencies["@babel/register"] = deps["@babel/register"];
      devDependencies["@babel/cli"] = deps["@babel/cli"];
      devDependencies["@babel/core"] = deps["@babel/core"];
      devDependencies["@babel/plugin-transform-runtime"] = deps["@babel/plugin-transform-runtime"];
      devDependencies["@babel/preset-env"] = deps["@babel/preset-env"];
      devDependencies["@babel/runtime"] = deps["@babel/runtime"];
    }

    if (parts.includes("cucumber")) {
      dependencies.cucumber = deps.cucumber;
    }

    if (parts.includes("chai") && !parts.includes("cypress")) {
      dependencies.chai = deps.chai;
    }

    if (parts.includes("jasmine")) {
      dependencies.jasmine = deps.jasmine;
    }

    if (parts.includes("jest")) {
      dependencies.jest = deps.jest;
    }

    if (parts.includes("mocha")) {
      dependencies.mocha = deps.mocha;
    }

    if (parts.includes("ava")) {
      dependencies.ava = deps.ava;
    }

    if (parts.includes("babel", "jest")) {
      devDependencies["babel-jest"] = deps["babel-jest"];
    }

    if (parts.includes("esm")) {
      dependencies.esm = deps.esm;
    }

    if (parts.includes("tape")) {
      dependencies.tape = deps.tape;
    }

    if (parts.includes("ts", "jest") && !parts.includes("node")) {
      dependencies["ts-jest"] = deps["ts-jest"];
    }

    if (parts.includes("ts", "node")) {
      dependencies["ts-node"] = deps["ts-node"];
    }

    if (parts.includes("tape", "typescript")) {
      devDependencies["@types/tape"] = deps["@types/tape"];
    }

    if (parts.includes("expect") && !parts.includes("jasmine", "jest", "mocha", "chai", "cypress", "nightwatch")) {
      dependencies.expect = deps.expect;
    }

    if (parts.includes("cypress")) {
      dependencies.cypress = deps.cypress;
      dependencies.rimraf = deps.rimraf;
      dependencies["ts-loader"] = deps["ts-loader"];
      devDependencies["eslint-plugin-cypress"] = deps["eslint-plugin-cypress"];

      if (parts.includes("browserify")) {
        dependencies["@cypress/browserify-preprocessor"] = deps["@cypress/browserify-preprocessor"];
      }

      if (parts.includes("webpack")) {
        dependencies["@cypress/webpack-preprocessor"] = deps["@cypress/webpack-preprocessor"];
      }
    }

    if (parts.includes("nightwatch")) {
      dependencies.nightwatch = deps.nightwatch;
      dependencies.chromedriver = deps.chromedriver;

      if (parts.includes("typescript")) {
        devDependencies["@types/nightwatch"] = deps["@types/nightwatch"];
        dependencies.rimraf = deps.rimraf;
      }
    }

    if (parts.includes("playwright")) {
      dependencies.playwright = deps.playwright;
      dependencies.chromedriver = deps.chromedriver;
    }

    if (parts.includes("protractor")) {
      dependencies.protractor = deps.protractor;

      if (parts.includes("tsc")) {
        dependencies.rimraf = deps.rimraf;
      }
    }

    if (parts.includes("puppeteer")) {
      dependencies.puppeteer = deps.puppeteer;
    }

    if (parts.includes("selenium", "webdriver")) {
      dependencies["selenium-webdriver"] = deps["selenium-webdriver"];
      dependencies.chromedriver = deps.chromedriver;
    }

    if (parts.includes("webdriver", "manager")) {
      dependencies["webdriver-manager"] = deps["webdriver-manager"];
    }

    if (parts.includes("wd")) {
      dependencies.wd = deps.wd;
      dependencies["chai-as-promised"] = deps["chai-as-promised"];
    }

    if (parts.includes("webdriverio")) {
      dependencies.webdriverio = deps.webdriverio;
      dependencies.chromedriver = deps.chromedriver;
      dependencies["@wdio/cli"] = deps["@wdio/cli"];
      dependencies["@wdio/dot-reporter"] = deps["@wdio/dot-reporter"];
      dependencies["@wdio/local-runner"] = deps["@wdio/local-runner"];
      dependencies["@wdio/sync"] = deps["@wdio/sync"];
      dependencies["wdio-chromedriver-service"] = deps["wdio-chromedriver-service"];

      if (parts.includes("jasmine")) {
        dependencies["@wdio/jasmine-framework"] = deps["@wdio/jasmine-framework"];
      }

      if (parts.includes("mocha")) {
        dependencies["@wdio/mocha-framework"] = deps["@wdio/mocha-framework"];
      }
    }

    if (parts.includes("wd", "mocha")) {
      dependencies.puppeteer = deps.puppeteer;
    }

    if (parts.includes("ava", "babel")) {
      devDependencies["@ava/babel"] = deps["@ava/babel"];
    }

    // logger.info(`dependencies ${JSON.stringify(dependencies, null, 2)}`);
    // logger.info(`devDependencies ${JSON.stringify(devDependencies, null, 2)}`);
    logger.info(`dependencies: ${name}`);
  } catch (error) {
    logger.error(error);
  }

  return {
    dependencies,
    devDependencies,
  };
}

export default makeDeps;
