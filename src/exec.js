const { series } = require("async");
const util = require("util");
const exec = util.promisify(require("child_process").exec);
const fs = require("fs");
const rimraf = require("rimraf");
const user = require("os").userInfo().username;
const logger = require("./logger");

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

async function getRepNameList() {
  await series([exec("npm run repo")]);
}

async function getRepo(repo) {
  const cmd = `git clone git@github.com:e2e-boilerplates/${repo}.git`;
  await execute(cmd, rootDir);
}

async function writeRootDir() {
  try {
    await fs.mkdirSync(rootDir);
    logger.info("Writing root directory.");
  } catch (error) {
    logger.error(error);
  }
}

async function clearRepList() {
  await rimraf.sync("repos/*.json");
  logger.info("Clearing existing repository name list.");
}

module.exports = {
  execute,
  getRepo,
  getRepNameList,
  writeRootDir,
  clearRepList
};
