const { execute, getRepository } = require("./exec");
const { hasRepository } = require("./validators");
const { username, rootDir, message } = require("./constants");

async function gitClone(repo) {
  const cmd = `git clone git@github.com:${username}/${repo.name}.git`;
  await execute(cmd, rootDir);
}

async function prepareRepo(name) {
  const hasRepo = await hasRepository(name);
  if (!hasRepo) {
    await getRepository(name);
  }
}

async function npmInstall(repo) {
  const { name } = repo;
  await prepareRepo(name);

  await execute(`npm install`, `${rootDir}/${name}`);
}

async function gitPull(repo) {
  const { name } = repo;
  await prepareRepo(name);
  await execute(`git pull`, `${rootDir}/${name}`);
}

async function gitAdd(repo) {
  const { name } = repo;
  await prepareRepo(name);
  await execute(`git add .`, `${rootDir}/${name}`);
}

async function gitCommit(repo) {
  const { name } = repo;
  await prepareRepo(name);
  await execute(`git commit -m "${message}"`, `${rootDir}/${name}`);
}

async function gitPush(repo) {
  const { name } = repo;
  await prepareRepo(name);
  await execute(`git push`, `${rootDir}/${name}`);
}

module.exports = {
  gitAdd,
  gitClone,
  npmInstall,
  gitPull,
  gitCommit,
  gitPush
};
