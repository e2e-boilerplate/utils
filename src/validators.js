import { existsSync, readdirSync } from "fs";
import { username, rootDir, reposDir, logger } from "./constants";

async function hasRootDirectory() {
  let hasDir = false;
  try {
    hasDir = await existsSync(rootDir);
  } catch (error) {
    logger.error(`${__filename}: ${error}`);
  }
  return hasDir;
}

async function hasRepositoriesList() {
  let hasList = false;
  try {
    const files = await readdirSync(reposDir);
    hasList = files.length > 1;
  } catch (error) {
    logger.error(`${__filename}: ${error}`);
  }

  return hasList;
}

async function hasMatchingRepositoriesList() {
  let hasMatchingRepos = true;
  try {
    const hasList = await hasRepositoriesList();
    if (hasList) {
      const files = readdirSync(reposDir);

      for (let i = 1; i < files.length; i += 1) {
        const repos = require(`../repos/repo-${i}.json`);
        const { login } = repos[0].owner;
        if (login !== username) {
          hasMatchingRepos = false;
          logger.warn(`${__filename}: Found non-matching repository: ${login} and ${username}`);
        }
      }
    }
  } catch (error) {
    logger.error(`${__filename}: ${error}`);
  }

  return hasMatchingRepos;
}

async function hasRepository(repoName) {
  const repo = `${rootDir}/${repoName}`;
  let repoExist = false;

  try {
    const files = await readdirSync(repo);
    repoExist = files.length > 1;
  } catch (error) {
    logger.error(`${__filename}: ${error}`);
  }

  return repoExist;
}

function isNumeric(value) {
  return !Number.isNaN(Number(value));
}

export { isNumeric, hasRootDirectory, hasRepositoriesList, hasRepository, hasMatchingRepositoriesList };
