import { logger, rootDir } from "../constants";
import { write } from "../exec";

async function makeTslint(repo) {
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
      const tslint = JSON.stringify(data, null, 2);
      const path = `${rootDir}/${name}/tslint.json`;
      await write(path, tslint, "utf8");
      logger.info(`tslint ${name}`);
    }
  } catch (error) {
    logger.error(error);
  }
}

export default makeTslint;
