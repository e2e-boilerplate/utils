import { execute, getRepository } from "./exec";
import { hasRepository } from "./validators";
import { username, rootDir, message, command } from "./common/constants";
import buildPackageJson from "./buildPackageJson";
import cron from "./cron";
import funding from "./funding";
import generateDependency from "./dependencies/generate_dependency";
import jestConfig from "./config/jest";
import makeEslintrc from "./style/eslintrc";
import makeTsconfig from "./style/tsconfig";
import makeTslint from "./style/tslint";
import mochaConfig from "./config/mocha";
import protractorConfig from "./config/protractor";
import readme from "./read-me";
import traffic from "./traffic";
import updateDependency from "./dependencies/update_dependency";
import wdioConfig from "./config/webdriverio";
import workflow from "./workflow";

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
  await buildPackageJson(name);
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
  readme(repo);
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
  updateDependency(name);
}

async function genCron(repo) {
  const { name } = repo;
  await prepareRepo(name);
  await cron(name);
}

async function genJestConfig(repo) {
  const { name } = repo;
  await prepareRepo(name);
  jestConfig(name);
}

async function genMochaConfig(repo) {
  const { name } = repo;
  await prepareRepo(name);
  mochaConfig(name);
}

async function genProtractorConfig(repo) {
  const { name } = repo;
  await prepareRepo(name);
  protractorConfig(name);
}

async function genWebdriverioConfig(repo) {
  const { name } = repo;
  await prepareRepo(name);
  await wdioConfig(name);
}

async function getTraffic(repo) {
  const { name } = repo;
  await prepareRepo(name);
  await traffic(name);
}

async function getDependency(repo) {
  const { name } = repo;
  await prepareRepo(name);
  await generateDependency(name);
}

export {
  audit,
  dependencies,
  eslintrc,
  executeArbitraryCommand,
  genCron,
  genJestConfig,
  genMochaConfig,
  genProtractorConfig,
  genWebdriverioConfig,
  generateReadme,
  generateWorkflow,
  getDependency,
  getTraffic,
  gitAdd,
  gitClone,
  gitCommit,
  gitPull,
  gitPush,
  lint,
  npmInstall,
  setFunding,
  tsconfig,
  tslint,
  updateMetadata,
};
