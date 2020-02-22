const util = require("util");
const exec = util.promisify(require("child_process").exec);
const user = require("os").userInfo().username;
const fs = require("fs");

const logger = require("./logger");

const root = `/Users/${user}/Documents/e2e-boilerplates`;

async function clone(repo) {
  if (!fs.existsSync(root)) {
    fs.mkdirSync(root);
  }

  try {
    const { error, stdout, stderr } = await exec(`git clone git@github.com:e2e-boilerplates/${repo.name}.git`, {
      cwd: root
    });
    if (error) {
      throw error;
    }
    logger.info(stdout);
    logger.info(stderr);
  } catch (error) {
    logger.error(error);
  }
}

async function install(repo) {
  try {
    const { error, stdout, stderr } = await exec(`npm install`, { cwd: `${root}/${repo.name}` });
    if (error) {
      throw error;
    }
    logger.info(stdout);
    logger.info(stderr);
  } catch (error) {
    logger.error(error);
  }
}

async function pull(repo) {
  try {
    const { error, stdout, stderr } = await exec(`git pull`, { cwd: `${root}/${repo.name}` });
    if (error) {
      throw error;
    }
    logger.info(stdout);
    logger.info(stderr);
  } catch (error) {
    logger.error(error);
  }
}

module.exports = {
  clone,
  install,
  pull
};
