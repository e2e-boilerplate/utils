const { execute, getRepository } = require("./exec");
const { hasRepository } = require("./validators");
const { username, rootDir } = require("./common/constants");

async function gitClone(repo) {
  const cmd = `git clone git@github.com:${username}/${repo.name}.git`;
  await execute(cmd, rootDir);
}

async function npmInstall(repo) {
  const { name } = repo;
  const hasRepo = await hasRepository(name);
  if (!hasRepo) {
    await getRepository(name);
  }

  await execute(`npm install`, `${rootDir}/${name}`);
}

async function gitPull(repo) {
  const { name } = repo;
  const hasRepo = await hasRepository(name);
  if (!hasRepo) {
    await getRepository(name);
  }
  await execute(`git pull`, `${rootDir}/${repo.name}`);
}

module.exports = {
  gitClone,
  npmInstall,
  gitPull
};
