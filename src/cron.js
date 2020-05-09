import { readFileSync } from "fs";
import { logger, rootDir } from "./constants";
import { write } from "./exec";
import { getRandomCron, sortObject, getMetaValue } from "./common";

function writeMeta(data, path) {
  const update = JSON.stringify(sortObject(data), null, 2);
  write(path, update, "utf8");
}

async function cron(name) {
  try {
    const value = await getMetaValue(name, "cron");
    if (!value) {
      const metaPath = `${rootDir}/${name}/.github`;
      const path = `${rootDir}/${name}/.github/meta.json`;

      const metaData = readFileSync(`${metaPath}/meta.json`);
      const metaJson = JSON.parse(metaData);

      if (!metaJson.cron) {
        metaJson.cron = getRandomCron();
      }

      await writeMeta(metaJson, path);
      logger.info(`writing meta for ${name}`);
    }
  } catch (error) {
    logger.error(`${__filename}: cron: ${error}`);
  }
}

export default cron;
