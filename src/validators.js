const fs = require("fs");
const logger = require("./common/logger");
const { username, rootDir, reposDir } = require("./common/constants");

async function hasRootDirectory() {
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
    const files = await fs.readdirSync(reposDir);
    hasList = files.length > 1;
  } catch (error) {
    logger.error(error);
  }

  return hasList;
}

async function hasMatchingRepositoriesList() {
  let hasMatchingRepos = true;
  try {
    const hasList = await hasRepositoriesList();
    if (hasList) {
      const files = fs.readdirSync(reposDir);

      for (let i = 1; i < files.length; i += 1) {
        const repos = require(`../repos/repo-${i}.json`);
        const { login } = repos[0].owner;
        if (login !== username) {
          hasMatchingRepos = false;
          logger.warn(`Found non-matching repository: ${login} and ${username}`);
        }
      }
    }
  } catch (error) {
    logger.error(error);
  }

  return hasMatchingRepos;
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
  hasRootDirectory,
  hasRepositoriesList,
  hasRepository,
  hasMatchingRepositoriesList
};
