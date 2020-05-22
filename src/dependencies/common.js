import * as deps from "./dependencies.json";

export default function common(name) {
  const parts = name.split("-");
  const dependencies = {};
  const devDependencies = {
    husky: deps.husky,
    prettier: deps.prettier,
  };

  devDependencies["lint-staged"] = deps["lint-staged"];

  if (parts.includes("cucumber")) {
    dependencies.cucumber = deps.cucumber;
  }

  if (parts.includes("chai") && !parts.includes("cypress")) {
    dependencies.chai = deps.chai;
  }

  if (parts.includes("jasmine")) {
    dependencies.jasmine = deps.jasmine;
  }

  if (parts.includes("jest") && !parts.includes("cypress")) {
    dependencies.jest = deps.jest;
  }

  if (parts.includes("mocha")) {
    dependencies.mocha = deps.mocha;
  }

  if (parts.includes("ava")) {
    dependencies.ava = deps.ava;
  }

  if (parts.includes("esm")) {
    dependencies.esm = deps.esm;
  }

  if (parts.includes("tape")) {
    dependencies.tape = deps.tape;
  }

  if (parts.includes("ts", "jest") && !parts.includes("node")) {
    dependencies["ts-jest"] = deps["ts-jest"];
    delete dependencies["ts-node"];
  }

  if (parts.includes("ts", "node") && !parts.includes("jest")) {
    dependencies["ts-node"] = deps["ts-node"];
    delete dependencies["ts-jest"];
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
    dependencies.expect = deps.expect;
  }

  if (
    parts.includes("nightwatch") ||
    parts.includes("playwright") ||
    parts.includes("selenium", "webdriver") ||
    parts.includes("webdriverio")
  ) {
    // dependencies.chromedriver = deps.chromedriver;
    dependencies.chromedriver = "81.0.0";
  }

  if (parts.includes("webdriver", "manager")) {
    dependencies["webdriver-manager"] = deps["webdriver-manager"];
  }

  return { dependencies, devDependencies };
}
