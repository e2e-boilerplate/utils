import { frameworks, logger } from "./constants";

frameworks.push("selenium-webdriver");

const chai = {};
const assertion = {};
const runner = {};
const typescript = {};
const esModule = {};
const javascript = {};
const module = {};
const platform = {};
const framework = {};

const chaiAssertionTypes = ["expect", "should", "assert"];
const assertionType = ["assert", "expect", "chai", "none"];
const runnerType = ["jasmine", "mocha", "jest", "ava", "tape", "none"];
const typescriptTranspiler = ["tsc", "ts-node"];
const esModuleTranspiler = ["babel", "esm"];
const javascriptType = ["non-typescript", "typescript"];
const moduleType = ["commonjs", "es modules"];
const platformType = ["node", "browser"];

chaiAssertionTypes.forEach(c => {
  chai[c] = {};
});

assertionType.forEach(a => {
  assertion[a] = a === "chai" ? chai : {};
});

runnerType.forEach(r => {
  runner[r] = assertion;
});

typescriptTranspiler.forEach(t => {
  typescript[t] = runner;
});

esModuleTranspiler.forEach(e => {
  esModule[e] = runner;
});

javascriptType.forEach(j => {
  javascript[j] = j === "non-typescript" ? esModule : typescript;
});

moduleType.forEach(m => {
  module[m] = m === "commonjs" ? runner : javascript;
});

platformType.forEach(p => {
  platform[p] = module;
});

frameworks.forEach(f => {
  if (f !== "cypress") {
    framework[f] = module;
  }
});

logger.info(JSON.stringify(framework, null, 4));
