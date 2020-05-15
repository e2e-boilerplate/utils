import * as deps from "./dependencies.json";

export default function playwright(name) {
  // eslint-disable-next-line no-unused-vars
  const parts = name.split("-");
  const dependencies = {
    playwright: deps.playwright,
  };
  const devDependencies = {};

  return { dependencies, devDependencies };
}
