import { writeFileSync } from "fs";
import { logger, rootDir } from "../common/constants";

function makeTslint(repo) {
  const { name } = repo;
  const parts = name.split("-");
  const data = {
    extends: ["tslint:latest", "tslint-plugin-prettier", "tslint-config-prettier"],
    rules: {
      prettier: true,
    },
    linterOptions: {
      exclude: ["*.json", "**/*.json"],
    },
  };

  try {
    if (parts.includes("typescript")) {
      if (parts.includes("testcafe")) {
        data.rules["no-unused-expression"] = false;
      }
      const tslint = JSON.stringify(data, null, 2);
      const path = `${rootDir}/${name}/tslint.json`;
      writeFileSync(path, tslint, "utf8");
      logger.info(`Write ${path}`);
    }
  } catch (error) {
    logger.error(`${__filename}: ${error}`);
  }
}

export default makeTslint;
