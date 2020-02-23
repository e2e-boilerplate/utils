const util = require("util");
const exec = util.promisify(require("child_process").exec);
const fs = require("fs");
const rimraf = require("rimraf");
const user = require("os").userInfo().username;
const { getRepositories } = require("./repositories");
const logger = require("./common/logger");

const rootDir = `/Users/${user}/Documents/e2e-boilerplates`;

async function execute(cmd, cwd) {
  try {
    const { error, stdout, stderr } = await exec(cmd, { cwd });
    if (error) {
      throw error;
    }
    logger.info(stdout);
    logger.info(stderr);
  } catch (error) {
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
  logger.info("Clearing existing repository name list.");
}

async function getRepository(repo) {
  const cmd = `git clone git@github.com:e2e-boilerplates/${repo}.git`;
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
