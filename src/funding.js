import { safeDump } from "js-yaml";
import { writeFileSync } from "fs";
import { logger, rootDir } from "./common/constants";
import { createPath, hasPath } from "./common";

async function funding(repo) {
  const { name } = repo;
  const buyMeCoffee = { custom: ["https://www.buymeacoffee.com/xgirma"] };

  try {
    const yml = `${rootDir}/${name}/.github/FUNDING.yml`;

    const dir = `${rootDir}/${name}/.github/`;
    if (!(await hasPath(dir))) {
      await createPath(dir);
    }

    const yamlStr = safeDump(buyMeCoffee);
    logger.info(`Generates: ${name} ${yml}`);
    writeFileSync(yml, yamlStr, "utf8");
  } catch (error) {
    logger.error(`${__filename}: Workflow: ${rootDir}/${name}/.github/FUNDING.yml ${error}`);
  }
}

export default funding;
