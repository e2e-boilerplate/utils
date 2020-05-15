import * as deps from "./dependencies.json";

export default function typescript(name) {
  const parts = name.split("-");
  const dependencies = {
    typescript: deps.typescript,
  };
  const devDependencies = {
    tslint: deps.tslint,
  };

  devDependencies["tslint-config-prettier"] = deps["tslint-config-prettier"];
  devDependencies["tslint-plugin-prettier"] = deps["tslint-plugin-prettier"];

  if (parts.includes("cypress") && (parts.includes("webpack") || parts.includes("cucumber"))) {
    dependencies["ts-loader"] = deps["ts-loader"];
  }

  if (parts.includes("cypress", "browserify")) {
    dependencies.tsify = deps.tsify;
  }

  // if we build, we clear
  if (parts.includes("tsc")) {
    dependencies.rimraf = deps.rimraf;
  }

  if (parts.includes("cypress", "cucumber")) {
    devDependencies["@types/cypress-cucumber-preprocessor"] = deps["@types/cypress-cucumber-preprocessor"];
  }

  if (!parts.includes("cypress")) {
    devDependencies["@types/node"] = deps["@types/node"];
  }

  if (parts.includes("nightwatch")) {
    devDependencies["@types/nightwatch"] = deps["@types/nightwatch"];
  }

  if (parts.includes("protractor", "jasmine")) {
    devDependencies["@types/jasminewd2"] = deps["@types/jasminewd2"];
  }

  if (parts.includes("jasmine")) {
    devDependencies["@types/jasmine"] = deps["@types/jasmine"];
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

  if (parts.includes("tape")) {
    devDependencies["@types/tape"] = deps["@types/tape"];
  }

  return { dependencies, devDependencies };
}
