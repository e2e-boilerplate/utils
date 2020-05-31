import * as deps from "./dependencies.json";

export default function seleniumWebdriver(name) {
  const parts = name.split("-");
  const dependencies = {
    chromedriver: deps.chromedriver,
  };
  const devDependencies = {};

  if (parts.includes("selenium", "webdriver")) {
    dependencies["selenium-webdriver"] = deps["selenium-webdriver"];
  }

  return { dependencies, devDependencies };
}
