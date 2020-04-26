import { execute, getRepository } from "./exec";
import { hasRepository } from "./validators";
import { username, rootDir, message, command } from "./constants";
import updateMeta from "./metadata";
import workflow from "./workflow";
import funding from "./funding";
import readme from "./read-me";
import makeEslintrc from "./style/eslintrc";
import makeTsconfig from "./style/tsconfig";
import makeTslint from "./style/tslint";
import makeDeps from "./deps/deps";
import cron from "./cron";
import jestConfig from "./config/jest";
import mochaConfig from "./config/mocha";
import protractorConfig from "./config/protractor";
import wdioConfig from "./config/webdriverio";

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
  await execute(`git commit -am "${message}"`, `${rootDir}/${name}`);
}

async function gitPush(repo) {
  const { name } = repo;
  await prepareRepo(name);
  await execute(`git push`, `${rootDir}/${name}`);
}

async function updateMetadata(repo) {
  const { name } = repo;
  await prepareRepo(name);
  await updateMeta(repo);
}

async function generateWorkflow(repo) {
  const { name } = repo;
  await prepareRepo(name);
  await workflow(repo);
}

async function setFunding(repo) {
  const { name } = repo;
  await prepareRepo(name);
  await funding(repo);
}

async function generateReadme(repo) {
  const { name } = repo;
  await prepareRepo(name);
  await readme(repo);
}

async function executeArbitraryCommand(repo) {
  const { name } = repo;
  await prepareRepo(name);
  await execute(command.toString(), `${rootDir}/${name}`);
}

async function lint(repo) {
  const { name } = repo;
  await prepareRepo(name);
  await execute(`npm run lint`, `${rootDir}/${name}`);
}

async function audit(repo) {
  const { name } = repo;
  await prepareRepo(name);
  await execute(`npm audit fix`, `${rootDir}/${name}`);
}

async function eslintrc(repo) {
  const { name } = repo;
  await prepareRepo(name);
  await makeEslintrc(repo);
}

async function tsconfig(repo) {
  const { name } = repo;
  await prepareRepo(name);
  await makeTsconfig(repo);
}

async function tslint(repo) {
  const { name } = repo;
  await prepareRepo(name);
  await makeTslint(repo);
}

async function dependencies(repo) {
  const { name } = repo;
  await prepareRepo(name);
  await makeDeps(repo);
}

async function repoTraffic(repo) {
  const { name } = repo;
  await prepareRepo(name);
  await traffic(repo);
}

async function genCron(repo) {
  const { name } = repo;
  await prepareRepo(name);
  await cron(name);
}

async function genJestConfig(repo) {
  const { name } = repo;
  await prepareRepo(name);
  await jestConfig(name);
}

async function genMochaConfig(repo) {
  const { name } = repo;
  await prepareRepo(name);
  await mochaConfig(name);
}

async function genProtractorConfig(repo) {
  const { name } = repo;
  await prepareRepo(name);
  await protractorConfig(name);
}

async function genWebdriverioConfig(repo) {
  const { name } = repo;
  await prepareRepo(name);
  await wdioConfig(name);
}

export {
  audit,
  dependencies,
  eslintrc,
  gitAdd,
  gitClone,
  npmInstall,
  generateWorkflow,
  generateReadme,
  gitPull,
  gitCommit,
  gitPush,
  updateMetadata,
  executeArbitraryCommand,
  lint,
  repoTraffic,
  setFunding,
  tsconfig,
  tslint,
  genCron,
  genJestConfig,
  genMochaConfig,
  genProtractorConfig,
  genWebdriverioConfig,
};
