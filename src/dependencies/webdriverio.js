import * as deps from "./dependencies.json";

export default function webdriverIo(name) {
  const parts = name.split("-");
  const dependencies = {
    webdriverio: deps.webdriverio,
  };
  const devDependencies = {};

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

  if (parts.includes("cucumber")) {
    dependencies["@wdio/cucumber-framework"] = deps["@wdio/cucumber-framework"];
  }

  return { dependencies, devDependencies };
}
