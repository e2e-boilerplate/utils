import * as deps from "./dependencies.json";
import { logger } from "../constants";

async function makeDeps(repo) {
  const { name } = repo;
  const parts = name.split("-");
  const dependencies = {};
  const devDependencies = {
    husky: deps.husky,
    prettier: deps.prettier
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
      dependencies.rimraf = deps.rimraf;
      if (parts.includes("typescript")) {
        devDependencies["@types/nightwatch"] = deps["@types/nightwatch"];
      }
    }

    if (parts.includes("playwright")) {
      dependencies.playwright = deps.playwright;
      dependencies.chromedriver = deps.chromedriver;
      if (parts.includes("expect")) {
        dependencies.expect = deps.expect;
      }
    }

    logger.info(`dependencies ${JSON.stringify(dependencies, null, 2)}`);
    logger.info(`devDependencies ${JSON.stringify(devDependencies, null, 2)}`);
    logger.error(name);
  } catch (error) {
    logger.error(error);
  }
}

export default makeDeps;
// playwright-commonjs-jest-assert
