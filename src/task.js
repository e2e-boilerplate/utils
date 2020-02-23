const user = require("os").userInfo().username;
const { execute } = require("./exec");
const { checkRepository } = require("./checklist");

const rootDir = `/Users/${user}/Documents/e2e-boilerplates`;

async function clone(repo) {
  const cmd = `git clone git@github.com:e2e-boilerplates/${repo.name}.git`;
  await execute(cmd, rootDir);
}

async function installDependencies(repo) {
  await checkRepository(repo.name);
  await execute(`npm install`, `${rootDir}/${repo.name}`);
}

async function pull(repo) {
  await checkRepository(repo.name);
  await execute(`git pull`, `${rootDir}/${repo.name}`);
}

module.exports = {
  clone,
  installDependencies,
  pull
};
