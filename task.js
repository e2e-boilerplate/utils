const util = require("util");
const exec = util.promisify(require("child_process").exec);
const user = require("os").userInfo().username;
const fs = require("fs");

const logger = require("./logger");

const root = `/Users/${user}/Documents/e2e-boilerplates`;

if (!fs.existsSync(root)) {
  fs.mkdirSync(root);
} else {
  logger.info(`/Users/${user}/Documents/e2e-boilerplates already exists`);
  process.exit();
}

async function clone(repo) {
  const { error } = await exec(`git clone git@github.com:e2e-boilerplates/${repo.name}.git`, { cwd: root });

  if (error) {
    logger.error(`error: ${error}`);
  }

  logger.info(`Cloning ${repo.name}`);
}

async function install(repo) {
  const { error } = await exec(`npm install`, { cwd: `${root}/${repo.name}` });

  if (error) {
    logger.error(`error: ${error}`);
  }

  logger.info(`Installing dependencies for ${repo.name}`);
}

async function pull(repo) {
  const { error } = await exec(`git pull`, { cwd: `${root}/${repo.name}` });

  if (error) {
    logger.error(`error: ${error}`);
  }

  logger.info(`Pulling latest for ${repo.name}`);
}

module.exports = {
  clone,
  install,
  pull
};
