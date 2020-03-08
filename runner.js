import { readdirSync } from "fs";
import {
  executeArbitraryCommand,
  generateWorkflow,
  generateReadme,
  gitAdd,
  gitClone,
  gitCommit,
  gitPush,
  gitPull,
  npmInstall,
  updateMetadata,
  lint
} from "./src/task";

import { hasMatchingRepositoriesList, hasRepositoriesList, hasRootDirectory } from "./src/validators";
import { getRepositoriesList, setRootDir } from "./src/exec";
import { task, reposDir, logger } from "./src/constants";
import { clearReposList } from "./src/common";

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
      await clearReposList();
      await getRepositoriesList();
    }

    const files = readdirSync(reposDir);

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
          case "workflow":
            generateWorkflow(repo);
            break;
          case "readme":
            generateReadme(repo);
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
