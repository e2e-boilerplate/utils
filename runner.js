const fs = require("fs");
const { gitClone, gitPull, npmInstall } = require("./src/task");
const { hasMatchingRepositoriesList, hasRepositoriesList, hasRootDirectory } = require("./src/validators");
const { getRepositoriesList, setRootDir, clearRepositoriesList } = require("./src/exec");
const logger = require("./src/common/logger");
const { task, reposDir } = require("./src/common/constants");

async function runner() {
  try {
    const hasReposList = await hasRepositoriesList();
    if (!hasReposList) {
      await getRepositoriesList();
    }

    const hasMatchingReposList = await hasMatchingRepositoriesList();
    if (!hasMatchingReposList) {
      await clearRepositoriesList();
      await getRepositoriesList();
    }

    const hasRootDir = await hasRootDirectory();
    if (!hasRootDir) {
      await setRootDir();
    }

    const files = fs.readdirSync(reposDir);

    for (let i = 1; i < files.length; i += 1) {
      const repos = require(`./repos/repo-${i}.json`);
      repos.forEach(repo => {
        switch (task) {
          case "clone":
            gitClone(repo);
            break;
          case "install":
            npmInstall(repo);
            break;
          case "pull":
            gitPull(repo);
            break;
          default:
            logger.warn(`Invalid task: ${task}`);
        }
      });
    }
  } catch (error) {
    logger.error(error);
  }
}

runner();
