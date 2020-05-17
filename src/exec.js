import * as util from "util";
import { username, rootDir, logger } from "./common/constants";

const exec = util.promisify(require("child_process").exec);

async function execute(cmd, cwd) {
  try {
    const { error, stdout, stderr } = await exec(cmd, { cwd });
    if (error) {
      throw error;
    }
    logger.info(cwd);
    logger.info(stdout);
    logger.info(stderr);
  } catch (error) {
    logger.error(`${__filename}: ${cwd}`);
    logger.error(`${__filename}: ${error}`);
  }
}

async function getRepository(repo) {
  const cmd = `git clone git@github.com:${username}/${repo}.git`;
  await execute(cmd, rootDir);
}

export { execute, getRepository };
