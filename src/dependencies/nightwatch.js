import * as deps from "./dependencies.json";

export default function nightwatch(name) {
  // eslint-disable-next-line no-unused-vars
  const parts = name.split("-");
  const dependencies = {
    nightwatch: deps.nightwatch,
    chromedriver: deps.chromedriver,
  };
  const devDependencies = {};

  return { dependencies, devDependencies };
}
