import compareVersions from "compare-versions";
import { readFileSync } from "fs";
import * as deps from "./dependencies.json";
import { logger, rootDir } from "../constants";

/**
 * compare version
 * @param first version from package
 * @param second version from constant
 * @returns {*}
 */
function version(first, second, name) {
  if (first) {
    if (compareVersions.compare(first, second, ">")) {
      logger.info(`Change ${name} version to ${first}`);
      return first;
    }
  }
  return second;
}

async function makeDeps(repo) {
  const { name } = repo;
  const parts = name.split("-");
  const dependencies = {};
  const devDependencies = {
    husky: deps.husky,
    prettier: deps.prettier,
  };

  try {
    const data = readFileSync(`${rootDir}/${name}/package.json`);
    const pkgJson = JSON.parse(data);

    if (parts.includes("typescript")) {
      devDependencies["tslint-config-prettier"] = version(
        pkgJson.devDependencies["tslint-config-prettier"],
        deps["tslint-config-prettier"],
        "tslint-config-prettier"
      );

      devDependencies["tslint-plugin-prettier"] = version(
        pkgJson.devDependencies["tslint-plugin-prettier"],
        deps["tslint-plugin-prettier"],
        "tslint-plugin-prettier"
      );

      devDependencies.tslint = version(pkgJson.devDependencies.tslint, deps.tslint, "tslint");
      dependencies.typescript = version(pkgJson.dependencies.typescript, deps.typescript, "typescript");
      devDependencies["lint-staged"] = version(
        pkgJson.devDependencies["lint-staged"],
        deps["lint-staged"],
        "lint-staged"
      );

      if (!parts.includes("cypress")) {
        devDependencies["@types/node"] = version(
          pkgJson.devDependencies["@types/node"],
          deps["@types/node"],
          "@types/node"
        );
      }

      if (parts.includes("jest")) {
        devDependencies["@types/jest"] = version(
          pkgJson.devDependencies["@types/jest"],
          deps["@types/jest"],
          "@types/jest"
        );
      }

      if (parts.includes("mocha")) {
        devDependencies["@types/mocha"] = version(
          pkgJson.devDependencies["@types/mocha"],
          deps["@types/mocha"],
          "@types/mocha"
        );
      }

      if (parts.includes("chai")) {
        devDependencies["@types/chai"] = version(
          pkgJson.devDependencies["@types/chai"],
          deps["@types/chai"],
          "@types/chai"
        );
      }

      if (parts.includes("selenium", "webdriver")) {
        devDependencies["@types/selenium-webdriver"] = version(
          pkgJson.devDependencies["@types/selenium-webdriver"],
          deps["@types/selenium-webdriver"],
          "@types/selenium-webdriver"
        );
      }

      if (parts.includes("puppeteer")) {
        devDependencies["@types/puppeteer"] = version(
          pkgJson.devDependencies["@types/puppeteer"],
          deps["@types/puppeteer"],
          "@types/puppeteer"
        );
      }

      if (parts.includes("jasmine")) {
        devDependencies["@types/jasmine"] = version(
          pkgJson.devDependencies["@types/jasmine"],
          deps["@types/jasmine"],
          "@types/jasmine"
        );

        if (parts.includes("protractor")) {
          devDependencies["@types/jasminewd2"] = version(
            pkgJson.devDependencies["@types/jasminewd2"],
            deps["@types/jasminewd2"],
            "@types/jasminewd2"
          );
        }
      }
    }

    if (!parts.includes("typescript")) {
      devDependencies.eslint = version(pkgJson.dependencies.eslint, deps.eslint);
      devDependencies["eslint-config-airbnb-base"] = version(
        pkgJson.devDependencies["eslint-config-airbnb-base"],
        deps["eslint-config-airbnb-base"],
        "eslint-config-airbnb-base"
      );
      devDependencies["eslint-config-prettier"] = version(
        pkgJson.devDependencies["eslint-config-prettier"],
        deps["eslint-config-prettier"],
        "eslint-config-prettier"
      );
      devDependencies["eslint-plugin-import"] = version(
        pkgJson.devDependencies["eslint-plugin-import"],
        deps["eslint-plugin-import"],
        "eslint-plugin-import"
      );
      devDependencies["eslint-plugin-prettier"] = version(
        pkgJson.devDependencies["eslint-plugin-prettier"],
        deps["eslint-plugin-prettier"],
        "eslint-plugin-prettier"
      );
      devDependencies["pretty-quick"] = version(
        pkgJson.devDependencies["pretty-quick"],
        deps["pretty-quick"],
        "pretty-quick"
      );

      if (parts.includes("cucumber")) {
        devDependencies["eslint-plugin-cucumber"] = version(
          pkgJson.devDependencies["eslint-plugin-cucumber"],
          deps["eslint-plugin-cucumber"],
          "eslint-plugin-cucumber"
        );
      }

      if (parts.includes("webdriverio")) {
        devDependencies["eslint-plugin-wdio"] = version(
          pkgJson.devDependencies["eslint-plugin-wdio"],
          deps["eslint-plugin-wdio"],
          "eslint-plugin-wdio"
        );
      }
    }

    if (parts.includes("babel")) {
      devDependencies["@babel/register"] = version(
        pkgJson.devDependencies["@babel/register"],
        deps["@babel/register"],
        "@babel/register"
      );
      devDependencies["@babel/cli"] = version(pkgJson.devDependencies["@babel/cli"], deps["@babel/cli"], "@babel/cli");
      devDependencies["@babel/core"] = version(
        pkgJson.devDependencies["@babel/core"],
        deps["@babel/core"],
        "@babel/core"
      );
      devDependencies["@babel/plugin-transform-runtime"] = version(
        pkgJson.devDependencies["@babel/plugin-transform-runtime"],
        deps["@babel/plugin-transform-runtime"],
        "@babel/plugin-transform-runtime"
      );
      devDependencies["@babel/preset-env"] = version(
        pkgJson.devDependencies["@babel/preset-env"],
        deps["@babel/preset-env"],
        "@babel/preset-env"
      );
      devDependencies["@babel/runtime"] = version(
        pkgJson.devDependencies["@babel/runtime"],
        deps["@babel/runtime"],
        "@babel/runtime"
      );
    }

    if (parts.includes("cucumber")) {
      dependencies.cucumber = version(pkgJson.dependencies.cucumber, deps.cucumber, "cucumber");
    }

    if (parts.includes("chai") && !parts.includes("cypress")) {
      dependencies.chai = version(pkgJson.dependencies.chai, deps.chai, "chai");
    }

    if (parts.includes("jasmine")) {
      dependencies.jasmine = version(pkgJson.dependencies.jasmine, deps.jasmine, "jasmine");
    }

    if (parts.includes("jest")) {
      dependencies.jest = version(pkgJson.dependencies.jest, deps.jest, "jest");
    }

    if (parts.includes("mocha")) {
      dependencies.mocha = version(pkgJson.dependencies.mocha, deps.mocha, "mocha");
    }

    if (parts.includes("ava")) {
      dependencies.ava = version(pkgJson.dependencies.ava, deps.ava, "ava");
    }

    if (parts.includes("babel", "jest")) {
      devDependencies["babel-jest"] = version(pkgJson.devDependencies["babel-jest"], deps["babel-jest"], "babel-jest");
    }

    if (parts.includes("esm")) {
      dependencies.esm = version(pkgJson.dependencies.esm, deps.esm, "esm");
    }

    if (parts.includes("tape")) {
      dependencies.tape = version(pkgJson.dependencies.tape, deps.tape, "tape");
    }

    if (parts.includes("ts", "jest") && !parts.includes("node")) {
      dependencies["ts-jest"] = version(pkgJson.dependencies["ts-jest"], deps["ts-jest"], "ts-jest");
    }

    if (parts.includes("ts", "node")) {
      dependencies["ts-node"] = version(pkgJson.dependencies["ts-node"], deps["ts-node"], "ts-node");
    }

    if (parts.includes("tape", "typescript")) {
      devDependencies["@types/tape"] = version(
        pkgJson.devDependencies["@types/tape"],
        deps["@types/tape"],
        "@types/tape"
      );
    }

    if (
      parts.includes("expect") &&
      !parts.includes("jasmine") &&
      !parts.includes("jest") &&
      !parts.includes("mocha") &&
      !parts.includes("chai") &&
      !parts.includes("cypress") &&
      !parts.includes("nightwatch")
    ) {
      dependencies.expect = version(pkgJson.dependencies.expect, deps.expect, "expect");
    }

    if (parts.includes("cypress")) {
      dependencies.cypress = version(pkgJson.dependencies.cypress, deps.cypress, "cypress");
      dependencies.rimraf = version(pkgJson.dependencies.rimraf, deps.rimraf, "rimraf");
      dependencies["ts-loader"] = version(pkgJson.dependencies["ts-loader"], deps["ts-loader"], "ts-loader");
      devDependencies["eslint-plugin-cypress"] = version(
        pkgJson.devDependencies["eslint-plugin-cypress"],
        deps["eslint-plugin-cypress"],
        "eslint-plugin-cypress"
      );

      if (parts.includes("browserify")) {
        dependencies["@cypress/browserify-preprocessor"] = version(
          pkgJson.dependencies["@cypress/browserify-preprocessor"],
          deps["@cypress/browserify-preprocessor"],
          "@cypress/browserify-preprocessor"
        );
      }

      if (parts.includes("webpack")) {
        dependencies["@cypress/webpack-preprocessor"] = version(
          pkgJson.dependencies["@cypress/webpack-preprocessor"],
          deps["@cypress/webpack-preprocessor"],
          "@cypress/webpack-preprocessor"
        );
      }
    }

    if (parts.includes("nightwatch")) {
      dependencies.nightwatch = version(pkgJson.dependencies.nightwatch, deps.nightwatch, "nightwatch");
      dependencies.chromedriver = version(pkgJson.dependencies.chromedriver, deps.chromedriver, "chromedriver");

      if (parts.includes("typescript")) {
        devDependencies["@types/nightwatch"] = version(
          pkgJson.devDependencies["@types/nightwatch"],
          deps["@types/nightwatch"],
          "@types/nightwatch"
        );
        dependencies.rimraf = version(pkgJson.dependencies.rimraf, deps.rimraf, "rimraf");
      }
    }

    if (parts.includes("playwright")) {
      dependencies.playwright = version(pkgJson.dependencies.playwright, deps.playwright, "playwright");
      dependencies.chromedriver = version(pkgJson.dependencies.chromedriver, deps.chromedriver, "chromedriver");
    }

    if (parts.includes("protractor")) {
      dependencies.protractor = version(pkgJson.dependencies.protractor, deps.protractor, "protractor");

      if (parts.includes("tsc")) {
        dependencies.rimraf = version(pkgJson.dependencies.rimraf, deps.rimraf, "rimraf");
      }
    }

    if (parts.includes("puppeteer")) {
      dependencies.puppeteer = version(pkgJson.dependencies.puppeteer, deps.puppeteer, "puppeteer");
    }

    if (parts.includes("selenium", "webdriver")) {
      dependencies["selenium-webdriver"] = version(
        pkgJson.dependencies["selenium-webdriver"],
        deps["selenium-webdriver"],
        "selenium-webdriver"
      );
      dependencies.chromedriver = version(pkgJson.dependencies.chromedriver, deps.chromedriver, "chromedriver");
    }

    if (parts.includes("webdriver", "manager")) {
      dependencies["webdriver-manager"] = version(
        pkgJson.dependencies["webdriver-manager"],
        deps["webdriver-manager"],
        "webdriver-manager"
      );
    }

    if (parts.includes("wd")) {
      dependencies.wd = version(pkgJson.dependencies.wd, deps.wd);
      dependencies["chai-as-promised"] = version(
        pkgJson.dependencies["chai-as-promised"],
        deps["chai-as-promised"],
        "chai-as-promised"
      );
    }

    if (parts.includes("webdriverio")) {
      dependencies.webdriverio = version(pkgJson.dependencies.webdriverio, deps.webdriverio, "webdriverio");
      dependencies.chromedriver = version(pkgJson.dependencies.chromedriver, deps.chromedriver, "chromedriver");
      dependencies["@wdio/cli"] = version(pkgJson.dependencies["@wdio/cli"], deps["@wdio/cli"], "@wdio/cli");
      dependencies["@wdio/dot-reporter"] = version(
        pkgJson.dependencies["@wdio/dot-reporter"],
        deps["@wdio/dot-reporter"],
        "@wdio/dot-reporter"
      );
      dependencies["@wdio/local-runner"] = version(
        pkgJson.dependencies["@wdio/local-runner"],
        deps["@wdio/local-runner"],
        "@wdio/local-runner"
      );
      dependencies["@wdio/sync"] = version(pkgJson.dependencies["@wdio/sync"], deps["@wdio/sync"]);
      dependencies["wdio-chromedriver-service"] = version(
        pkgJson.dependencies["wdio-chromedriver-service"],
        deps["wdio-chromedriver-service"],
        "wdio-chromedriver-service"
      );

      if (parts.includes("jasmine")) {
        dependencies["@wdio/jasmine-framework"] = version(
          pkgJson.dependencies["@wdio/jasmine-framework"],
          deps["@wdio/jasmine-framework"],
          "@wdio/jasmine-framework"
        );
      }

      if (parts.includes("mocha")) {
        dependencies["@wdio/mocha-framework"] = version(
          pkgJson.dependencies["@wdio/mocha-framework"],
          deps["@wdio/mocha-framework"],
          "@wdio/mocha-framework"
        );
      }
    }

    if (parts.includes("wd", "mocha")) {
      dependencies.puppeteer = version(pkgJson.dependencies.puppeteer, deps.puppeteer, "puppeteer");
    }

    if (parts.includes("ava", "babel")) {
      devDependencies["@ava/babel"] = version(pkgJson.devDependencies["@ava/babel"], deps["@ava/babel"], "@ava/babel");
    }

    logger.info(`dependencies: ${name}`);
    logger.info(`dependencies ${JSON.stringify(dependencies, null, 2)}`);
    logger.info(`devDependencies ${JSON.stringify(devDependencies, null, 2)}`);
  } catch (error) {
    logger.error(error);
  }

  return {
    dependencies,
    devDependencies,
  };
}

export default makeDeps;
