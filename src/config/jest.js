import { rootDir, logger } from "../constants";
import { write } from "../exec";

function config(name) {
  const parts = name.split("-");
  let data;

  /*eslint-disable */
  data = `module.exports = {
  testEnvironment: "node",
  testMatch: ["**/__tests__/**/*.[jt]s?(x)", "**/?(*.)+(spec|test).[tj]s?(x)"],
  testPathIgnorePatterns: ["/node_modules/"],
  setupFilesAfterEnv: ["./jest.setup.js"],
};`;

  const typescript = `module.exports = {
  testEnvironment: "node",
  testMatch: ["**/__tests__/**/*.[jt]s?(x)", "**/?(*.)+(spec|test).[tj]s?(x)"],
  testPathIgnorePatterns: ["/node_modules/"],
  setupFilesAfterEnv: ["./jest.setup.js"],
  transform: {
    "^.+\\.tsx?$": "ts-jest"
  }
};`;
  /* eslint-enable */

  if (parts.includes("typescript", "ts", "jest")) {
    data = typescript;
  }

  return data;
}

function setup() {
  return "jest.setTimeout(50000);";
}

async function jestConfig(name) {
  try {
    const parts = name.split("-");
    if (parts.includes("jest") && !parts.includes("cypress")) {
      const configPath = `${rootDir}/${name}/jest.config.js`;
      const configData = config(name);
      await write(configPath, configData, "utf8");
      logger.info(`jest.config.js ${name}`);

      const setupPath = `${rootDir}/${name}/jest.setup.js`;
      const setupData = setup(name);
      await write(setupPath, setupData, "utf8");
      logger.info(`jest.setup.js ${name}`);
    }
  } catch (error) {
    logger.error(`jest ${error}`);
  }
}

export default jestConfig;
