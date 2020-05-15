import * as deps from "./dependencies.json";

export default function testCafe(name) {
  // eslint-disable-next-line no-unused-vars
  const parts = name.split("-");
  const dependencies = {
    testcafe: deps.testcafe,
  };
  const devDependencies = {};

  return { dependencies, devDependencies };
}
