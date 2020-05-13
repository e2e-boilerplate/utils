import { logger, rootDir } from "../common/constants";
import { write } from "../exec";

function makeTslint(repo) {
  const { name } = repo;
  const parts = name.split("-");
  const data = {
    extends: ["tslint:latest", "tslint-plugin-prettier", "tslint-config-prettier"],
    rules: {
      prettier: true,
    },
  };

  try {
    if (parts.includes("typescript")) {
      if (parts.includes("testcafe")) {
        data.rules["no-unused-expression"] = false;
      }
      const tslint = JSON.stringify(data, null, 2);
      const path = `${rootDir}/${name}/tslint.json`;
      write(path, tslint, "utf8");
      logger.info(`tslint ${name}`);
    }
  } catch (error) {
    logger.error(`${__filename}: ${error}`);
  }
}

export default makeTslint;
