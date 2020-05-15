import * as deps from "./dependencies.json";

export default function protractor(name) {
  // eslint-disable-next-line no-unused-vars
  const parts = name.split("-");
  const dependencies = {
    protractor: deps.protractor,
  };
  const devDependencies = {};

  return { dependencies, devDependencies };
}
