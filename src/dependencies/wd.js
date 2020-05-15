import * as deps from "./dependencies.json";

export default function wd(name) {
  // eslint-disable-next-line no-unused-vars
  const parts = name.split("-");
  const dependencies = {
    wd: deps.wd,
  };
  const devDependencies = {};

  dependencies["chai-as-promised"] = deps["chai-as-promised"];

  return { dependencies, devDependencies };
}
