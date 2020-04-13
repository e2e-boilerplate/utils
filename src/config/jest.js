import { rootDir, logger } from "../constants";
import { sortObject } from "../common";
import { write } from "../exec";

function config(name) {
  const parts = name.split("-");

  const data = {
    testEnvironment: "node",
    testMatch: ["**/__tests__/**/*.[jt]s?(x)", "**/?(*.)+(spec|test).[tj]s?(x)"],
    testPathIgnorePatterns: ["/node_modules/"],
    setupFilesAfterEnv: ["./jest.setup.js"],
  };

  if (!parts.includes("typescript", "ts", "jest")) {
    data.transform = {
      "^.+\\.tsx?$": "ts-jest",
    };
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
      const c = JSON.stringify(sortObject(configData), null, 2);
      await write(configPath, c, "utf8");
      logger.info(`jest.config.js ${name}`);

      const setupPath = `${rootDir}/${name}/jest.setup.js`;
      const setupData = setup(name);
      const s = JSON.stringify(sortObject(setupData), null, 2);
      await write(setupPath, s, "utf8");
      logger.info(`jest.setup.js ${name}`);
    }
  } catch (error) {
    logger.error(`jest ${error}`);
  }
}

export default jestConfig;
