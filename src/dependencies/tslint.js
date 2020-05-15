import * as deps from "./dependencies.json";

export default function tslint(name) {
  // eslint-disable-next-line no-unused-vars
  const parts = name.split("-");
  const dependencies = {};
  const devDependencies = {
    tslint: deps.tslint,
  };

  devDependencies["tslint-config-prettier"] = deps["tslint-config-prettier"];
  devDependencies["tslint-plugin-prettier"] = deps["tslint-plugin-prettier"];

  return { dependencies, devDependencies };
}
