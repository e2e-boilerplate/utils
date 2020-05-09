import * as util from "util";
import { mkdirSync, writeFileSync } from "fs";
import getReposList from "./repositories";
import { username, rootDir, logger } from "./constants";

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

async function getRepositoriesList() {
  try {
    await getReposList();
  } catch (error) {
    logger.error(`${__filename}: ${error}`);
  }
}

async function getRepository(repo) {
  const cmd = `git clone git@github.com:${username}/${repo}.git`;
  await execute(cmd, rootDir);
}

async function setRootDir() {
  try {
    await mkdirSync(rootDir);
    logger.info("Writing root directory.");
  } catch (error) {
    logger.error(`${__filename}: ${error}`);
  }
}

function write(path, data, opt) {
  try {
    writeFileSync(path, data, opt);
    logger.info(`Write ${path}`);
  } catch (error) {
    logger.error(`${__filename}: exec: write: ${path} ${error}`);
  }
}

export { execute, getRepositoriesList, getRepository, setRootDir, write };
