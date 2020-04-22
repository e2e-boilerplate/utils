import { readdirSync } from "fs";
import { hasMatchingRepositoriesList, hasRepositoriesList, hasRootDirectory } from "../../validators";
import { getRepositoriesList, setRootDir } from "../../exec";
import { clearReposList, getName } from "../../common";
import { logger, reposDir } from "../../constants";

async function getGistId() {
  let id;
  const gists = require(`./gists/gists.json`);
  gists.forEach((gist) => {
    if (gist.description === "e2e-boilerplate") {
      id = gist.id;
    }
  });
  return id;
}

async function getRepos(x, y, z) {
  const list = [];
  try {
    const hasRootDir = await hasRootDirectory();
    if (!hasRootDir) {
      await setRootDir();
    }

    const hasReposList = await hasRepositoriesList();
    if (!hasReposList) {
      await getRepositoriesList();
    }

    const hasMatchingReposList = await hasMatchingRepositoriesList();
    if (!hasMatchingReposList) {
      await clearReposList();
      await getRepositoriesList();
    }

    const files = readdirSync(reposDir);

    for (let i = 1; i < files.length; i += 1) {
      const repos = require(`./repos/repo-${i}.json`);
      repos.forEach((repo) => {
        const name = getName(repo.name);
        const parts = name.split("-");
        if (parts.includes(x) && parts.includes(y)) {
          if (z) {
            if (parts.includes(z)) {
              list.push(name);
            }
          } else {
            list.push(name);
          }
        }
      });
    }
  } catch (error) {
    logger.error(error);
  }

  return list;
}

async function writeGist(content, fileName) {}

export { getGistId, getRepos };
