import * as rimraf from "rimraf";
import { existsSync, mkdirSync } from "fs";
import { frameworks, logger, miscRepos } from "./constants";

async function clear(path) {
  try {
    await rimraf.sync(path);
    logger.info(`Clearing: ${path}`);
  } catch (error) {
    logger.info(`Clearing file/folder: ${path}: ${error}`);
  }
}

async function hasPath(path) {
  let has = false;
  try {
    has = await existsSync(path);
  } catch (error) {
    logger.error(`Has path: ${path} : ${error}`);
  }
  logger.info(`Has: ${path}? ${has}`);
  return has;
}

async function createPath(path) {
  try {
    logger.info(`Creating: ${path}`);
    await mkdirSync(path);
  } catch (error) {
    logger.error(`Creating path: ${path} : ${error}`);
  }
}

async function clearReposList() {
  await rimraf.sync("repos/*.json");
  logger.info("Clearing existing repositories.");
}

function sortObject(obj) {
  const keys = Object.keys(obj).sort();
  const newObj = {};
  keys.forEach(key => {
    newObj[key] = obj[key];
  });
  return newObj;
}

function capitalize(word) {
  if (word === "webdriver") {
    return "WebDriver";
  }
  return `${word.charAt(0).toUpperCase()}${word.slice(1)}`;
}

function getTech(name) {
  let techs = [];
  const format = [];

  try {
    if (!miscRepos.includes(name)) {
      const parts = name.split("-");
      if (frameworks.includes(parts[0])) {
        techs = parts.slice(1);
      } else {
        techs = parts.slice(2);
      }

      let jestCount = 0;

      techs.forEach(tech => {
        if (tech === "jest") {
          jestCount += 1;
        }
      });

      const hasTwoJest = jestCount === 2;

      techs.forEach(tech => {
        switch (tech) {
          case "es":
            format.push("ES Modules");
            break;
          case "modules":
            break;
          case "ts":
            // eslint-disable-next-line no-unused-expressions
            hasTwoJest ? format.push("ts-jest") : format.push("ts-node");
            break;
          case "node":
            break;
          case "jest":
            if (!hasTwoJest) {
              format.push("Jest");
            }
            break;
          case "esm":
            format.push("esm");
            break;
          case "webdriver":
            format.push("Webdriver-Manager");
            break;
          case "manager":
            break;
          case "ava":
            format.push("AVA");
            break;
          case "typescript":
            format.push("TypeScript");
            break;
          default:
            format.push(capitalize(tech));
        }
      });

      const first = format.slice(0, -1);
      if (hasTwoJest) {
        first.push("Jest");
      }
      const last = format.slice(-1);

      return `Using ${first.join(", ")} and ${last}.`;
    }
  } catch (error) {
    logger.error(`Get tech: ${name} ${error}`);
  }

  return [];
}

function getFrameworkName(name) {
  let frameworkName = "";

  if (miscRepos.includes(name)) {
    frameworkName = capitalize(name);
  } else {
    try {
      const parts = name.split("-");
      if (frameworks.includes(parts[0])) {
        if (parts[0] === "wd") {
          frameworkName = parts[0].toUpperCase();
        } else if (parts[0] === "webdriverio") {
          frameworkName = "WebdriverIO";
        } else {
          frameworkName = capitalize(parts[0]);
        }
      } else {
        frameworkName = `${capitalize(parts[0])}-${capitalize(parts[1])}`;
      }
    } catch (error) {
      logger.error(`Get framework name: ${name} ${error}`);
    }
  }

  return frameworkName;
}

function getRandomCron() {
  const cron = [
    "0 0 1-31/2 * *",
    "10 1 1-31/2 * *",
    "20 2 1-31/2 * *",
    "30 3 1-31/2 * *",
    "40 4 1-31/2 * *",
    "50 5 1-31/2 * *",
    "5 0 1-31/2 * *",
    "10 1 1-31/2 * *",
    "20 2 1-31/2 * *",
    "30 3 1-31/2 * *",
    "40 4 1-31/2 * *",
    "50 5 1-31/2 * *"
  ];
  return cron[Math.floor(Math.random() * cron.length)];
}

export { clear, clearReposList, createPath, getTech, getFrameworkName, getRandomCron, hasPath, sortObject };
