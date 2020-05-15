import * as deps from "./dependencies.json";

export default function puppeteer(name) {
  // eslint-disable-next-line no-unused-vars
  const parts = name.split("-");
  const dependencies = {
    puppeteer: deps.puppeteer,
  };
  const devDependencies = {};

  return { dependencies, devDependencies };
}
