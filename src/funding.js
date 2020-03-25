import { safeDump } from "js-yaml";
import { logger, rootDir } from "./constants";
import { clear, createPath, hasPath } from "./common";
import { write } from "./exec";

async function funding(repo) {
  const { name } = repo;
  const buyMeCoffee = { custom: ["https://www.buymeacoffee.com/xgirma"] };

  try {
    const yml = `${rootDir}/${name}/.github/FUNDING.yml`;
    if (await hasPath(yml)) {
      await clear(yml);
    }

    const dir = `${rootDir}/${name}/.github/`;
    if (!(await hasPath(dir))) {
      await createPath(dir);
    }

    const yamlStr = safeDump(buyMeCoffee);
    logger.info(`Generates: ${name} ${yml}`);
    await write(yml, yamlStr, "utf8");
  } catch (error) {
    logger.error(`Workflow: ${rootDir}/${name}/.github/FUNDING.yml ${error}`);
  }
}

export default funding;
