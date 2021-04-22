/* eslint-disable no-restricted-syntax */
import { readFileSync, writeFileSync } from "fs";
import * as util from "util";
import { logger, rootDir } from "../common/constants";
import { sortObject } from "../common";

const exec = util.promisify(require("child_process").exec);

async function getGithubChromeDriverVersion() {
  const deps = JSON.parse(readFileSync("src/dependencies/dependencies.json", "utf8"));

  try {
    const { error, stdout, stderr } = await exec("chromedriver --version", { rootDir });
    if (error) {
      logger.info(stderr);
      throw error;
    }
    // eslint-disable-next-line prefer-destructuring
    deps.chromedriver = stdout.split(" ")[1];
    const content = JSON.stringify(sortObject(deps), null, 2);
    writeFileSync(`src/dependencies/dependencies.json`, content);
    writeFileSync(`api/v1/dependencies.json`, content);
    logger.info(`\nUpdate dependencies.json version using \n${stdout}`);
  } catch (error) {
    logger.error(`${__filename}: ${error}`);
  }
}

(async () => {
  await getGithubChromeDriverVersion();
})().catch((error) => {
  console.error(`Unable to update chrome driver`, error);
});
