const fs = require("fs");
const {
  executeArbitraryCommand,
  gitAdd,
  gitClone,
  gitCommit,
  gitPush,
  gitPull,
  npmInstall,
  updateMetadata,
  lint
} = require("./src/task");
const { hasMatchingRepositoriesList, hasRepositoriesList, hasRootDirectory } = require("./src/validators");
const { getRepositoriesList, setRootDir, clearRepositoriesList } = require("./src/exec");
const { task, reposDir, logger } = require("./src/constants");

async function runner() {
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
      await clearRepositoriesList();
      await getRepositoriesList();
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
          case "add":
            gitAdd(repo);
            break;
          case "commit":
            gitCommit(repo);
            break;
          case "push":
            gitPush(repo);
            break;
          case "metadata":
            updateMetadata(repo);
            break;
          case "command":
            executeArbitraryCommand(repo);
            break;
          case "lint":
            lint(repo);
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
