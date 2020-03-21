import { readdirSync } from "fs";
import {
  audit,
  eslintrc,
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
  lint,
  tsconfig,
  tslint
} from "./src/task";

import { hasMatchingRepositoriesList, hasRepositoriesList, hasRootDirectory } from "./src/validators";
import { getRepositoriesList, setRootDir } from "./src/exec";
import { task, reposDir, logger, module } from "./src/constants";
import { clearReposList, getName } from "./src/common";

async function taskPicker(repo) {
  switch (task) {
    case "clone":
      await gitClone(repo);
      break;
    case "install":
      await npmInstall(repo);
      break;
    case "pull":
      await gitPull(repo);
      break;
    case "add":
      await gitAdd(repo);
      break;
    case "commit":
      await gitCommit(repo);
      break;
    case "push":
      await gitPush(repo);
      break;
    case "metadata":
      await updateMetadata(repo);
      break;
    case "workflow":
      await generateWorkflow(repo);
      break;
    case "readme":
      await generateReadme(repo);
      break;
    case "command":
      await executeArbitraryCommand(repo);
      break;
    case "lint":
      await lint(repo);
      break;
    case "audit":
      await audit(repo);
      break;
    case "eslintrc":
      await eslintrc(repo);
      break;
    case "tsconfig":
      await tsconfig(repo);
      break;
    case "tslint":
      await tslint(repo);
      break;
    default:
      logger.warn(`Invalid task: ${task}`);
  }
}

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
        const name = getName(repo.name);

        if (module) {
          if (module === name) {
            taskPicker(repo);
          }
        } else {
          taskPicker(repo);
        }
      });
    }
  } catch (error) {
    logger.error(error);
  }
}

runner();
