import * as deps from "./dependencies.json";
import { logger } from "../constants";
// import { logger, rootDir } from "../constants";
// import { write, execute } from "../exec";

async function makeDeps(repo) {
  const { name } = repo;
  const parts = name.split("-");
  const dependencies = {};
  const devDependencies = {
    eslint: deps.eslint,
    "eslint-config-airbnb-base": deps["eslint-config-airbnb-base"],
    "eslint-config-prettier": deps["eslint-config-prettier"],
    "eslint-plugin-import": deps["eslint-plugin-import"],
    "eslint-plugin-prettier": deps["eslint-plugin-prettier"],
    husky: deps.husky,
    prettier: deps.prettier,
    "lint-staged": deps["lint-staged"]
  };

  try {
    if (parts.includes("typescript")) {
      devDependencies["tslint-config-prettier"] = deps["tslint-config-prettier"];
      devDependencies["tslint-plugin-prettier"] = deps["tslint-plugin-prettier"];
      dependencies.typescript = deps.typescript;
    }
    // if (!parts.includes("typescript")) { return true }

    if (parts.includes("cypress")) {
      dependencies.cypress = deps.cypress;
      dependencies.rimraf = deps.rimraf;
      dependencies["@cypress/browserify-preprocessor"] = deps["@cypress/browserify-preprocessor"];
      dependencies["ts-loader"] = deps["ts-loader"];
      devDependencies["eslint-plugin-cypress"] = deps["eslint-plugin-cypress"];
    }

    logger.info(`dependencies ${JSON.stringify(dependencies, null, 2)}`);
    logger.info(`devDependencies ${JSON.stringify(devDependencies, null, 2)}`);
  } catch (error) {
    logger.error(error);
  }
}

export default makeDeps;
