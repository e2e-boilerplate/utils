import { readdirSync } from "fs";
import {
  audit,
  dependencies,
  eslintrc,
  executeArbitraryCommand,
  genCron,
  generateReadme,
  generateWorkflow,
  genJestConfig,
  genMochaConfig,
  genProtractorConfig,
  genWebdriverioConfig,
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
} from "../src/task";

import { getName } from "../src/common";
import { getRepositoriesList, setRootDir } from "../src/exec";
import { hasMatchingRepositoriesList, hasRepositoriesList, hasRootDirectory } from "../src/validators";
import { task, reposDir, logger, module } from "../src/common/constants";

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
    case "funding":
      await setFunding(repo);
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
    case "dependencies":
      await dependencies(repo);
      break;
    case "cron":
      await genCron(repo);
      break;
    case "jest":
      await genJestConfig(repo);
      break;
    case "mocha":
      await genMochaConfig(repo);
      break;
    case "protractor":
      await genProtractorConfig(repo);
      break;
    case "webdriverio":
      await genWebdriverioConfig(repo);
      break;
    case "traffic":
      await getTraffic(repo);
      break;
    case "dependency":
      await getDependency(repo);
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
      await getRepositoriesList();
    }

    const files = readdirSync(reposDir);

    for (let i = 1; i < files.length; i += 1) {
      const repos = require(`../repos/repo-${i}.json`);
      repos.forEach((repo) => {
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
    logger.error(`${__filename}: ${error}`);
  }
}

runner();
