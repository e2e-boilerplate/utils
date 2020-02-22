const util = require("util");
const exec = util.promisify(require("child_process").exec);
const user = require("os").userInfo().username;
const logger = require("./logger");

const root = `/Users/${user}/Documents/e2e-boilerplates/`;

async function clone(repo) {
  const { stdout, stderr } = await exec(`git clone git@github.com:e2e-boilerplates/${repo.name}.git`, { cwd: root });

  if (stderr) {
    logger.error(`error: ${stderr}`);
  }

  logger.info(stdout);
}

async function install(repo) {
  const { stdout, stderr } = await exec(`npm install`, { cwd: `${root}${repo.name}` });

  if (stderr) {
    logger.error(`error: ${stderr}`);
  }

  logger.log(stdout);
}

async function pull(repo) {
  const { stdout, stderr } = await exec(`git pull`, { cwd: `${root}${repo.name}` });

  if (stderr) {
    logger.error(`error: ${stderr}`);
  }

  logger.log(stdout);
}

module.exports = {
  clone,
  install,
  pull
};
