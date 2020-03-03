const util = require("util");
const exec = util.promisify(require("child_process").exec);
const fs = require("fs");
const rimraf = require("rimraf");
const { getRepositories } = require("./repositories");
const { username, rootDir, logger } = require("./constants");

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
    logger.error(cwd);
    logger.error(error);
  }
}

async function getRepositoriesList() {
  try {
    await getRepositories();
  } catch (error) {
    logger.error(error);
  }
}

async function clearRepositoriesList() {
  await rimraf.sync("repos/*.json");
  logger.info("Clearing existing repositories.");
}

async function getRepository(repo) {
  const cmd = `git clone git@github.com:${username}/${repo}.git`;
  await execute(cmd, rootDir);
}

async function setRootDir() {
  try {
    await fs.mkdirSync(rootDir);
    logger.info("Writing root directory.");
  } catch (error) {
    logger.error(error);
  }
}

module.exports = {
  execute,
  getRepositoriesList,
  clearRepositoriesList,
  getRepository,
  setRootDir
};
