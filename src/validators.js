const fs = require("fs");
const user = require("os").userInfo().username;
const logger = require("./common/logger");

const rootDir = `/Users/${user}/Documents/e2e-boilerplates`;
const dir = "./repos";

async function hasRootDir() {
  let hasDir = false;
  try {
    hasDir = await fs.existsSync(rootDir);
  } catch (error) {
    logger.error(error);
  }
  return hasDir;
}

async function hasRepositoriesList() {
  let hasList = false;
  try {
    const files = await fs.readdirSync(dir);
    hasList = files.length > 1;
  } catch (error) {
    logger.error(error);
  }

  return hasList;
}

async function hasRepository(repoName) {
  const repo = `${rootDir}/${repoName}`;
  let repoExist = false;

  try {
    const files = await fs.readdirSync(repo);
    repoExist = files.length > 1;
  } catch (error) {
    logger.error(error);
  }

  return repoExist;
}

function isNumeric(value) {
  return !Number.isNaN(Number(value));
}

module.exports = {
  isNumeric,
  hasRootDir,
  hasRepositoriesList,
  hasRepository
};
