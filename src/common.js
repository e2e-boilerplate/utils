import * as rimraf from "rimraf";
import { existsSync, mkdirSync, readFileSync } from "fs";
import { write } from "./exec";
import { frameworks, logger, miscRepos, rootDir } from "./constants";

async function clear(path) {
  try {
    await rimraf.sync(path);
    logger.info(`Clearing: ${path}`);
  } catch (error) {
    logger.info(`${__filename}: Clearing file/folder: ${path}: ${error}`);
  }
}

async function hasPath(path) {
  let has = false;
  try {
    has = await existsSync(path);
  } catch (error) {
    logger.error(`Has path: ${path} : ${error}`);
  }
  logger.info(`${__filename}: Has: ${path}? ${has}`);
  return has;
}

async function createPath(path) {
  try {
    logger.info(`Creating: ${path}`);
    if (!(await hasPath(path))) {
      await mkdirSync(path);
    }
  } catch (error) {
    logger.error(`${__filename}: Creating path: ${path} : ${error}`);
  }
}

async function clearReposList() {
  await rimraf.sync("repos/*.json");
  logger.info("Clearing existing repositories.");
}

function sortObject(obj) {
  const keys = Object.keys(obj).sort();
  const newObj = {};
  keys.forEach((key) => {
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

      techs.forEach((tech) => {
        if (tech === "jest") {
          jestCount += 1;
        }
      });

      const hasTwoJest = jestCount === 2;

      techs.forEach((tech) => {
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

      if (first.join(", ") === "") {
        return `Using ${last}.`;
      }
      return `Using ${first.join(", ")} and ${last}.`;
    }
  } catch (error) {
    logger.error(`${__filename}: Get tech: ${name} ${error}`);
  }

  return [];
}

function getName(name) {
  let frameworkName = "";

  if (!miscRepos.includes(name)) {
    try {
      const parts = name.split("-");
      if (frameworks.includes(parts[0])) {
        frameworkName = `${parts[0]}`;
      } else {
        frameworkName = `${parts[0]}-${parts[1]}`;
      }
    } catch (error) {
      logger.error(`${__filename}: ${error}`);
    }
  }

  return frameworkName;
}

// formatted name
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
        } else if (parts[0] === "testcafe") {
          frameworkName = "TestCafé";
        } else {
          frameworkName = capitalize(parts[0]);
        }
      } else {
        frameworkName = `${capitalize(parts[0])}-${capitalize(parts[1])}`;
      }
    } catch (error) {
      logger.error(`${__filename}: Get framework name: ${name} ${error}`);
    }
  }

  return frameworkName;
}

function writeMeta(data, path) {
  const update = JSON.stringify(sortObject(data), null, 2);
  write(path, update, "utf8");
}

async function getMetaValue(name, key) {
  let value;
  try {
    const path = `${rootDir}/${name}/.github/meta.json`;
    const metaPath = `${rootDir}/${name}/.github`;

    if (!(await hasPath(path))) {
      await createPath(metaPath);
      const obj = {};
      await writeMeta(obj, path);
    } else {
      const metaData = readFileSync(`${metaPath}/meta.json`);
      const metaJson = JSON.parse(metaData);
      value = metaJson[key];
    }
  } catch (error) {
    logger.error(`${__filename}: Get meta value: ${error}`);
  }
  return value;
}

function getRandomCron() {
  const cron = [
    "0 0 1-31/2 * *",
    "5 0 1-31/2 * *",
    "10 0 1-31/2 * *",
    "20 0 1-31/2 * *",
    "30 0 1-31/2 * *",
    "40 0 1-31/2 * *",
    "50 0 1-31/2 * *",
    "59 0 1-31/2 * *",

    "0 1 2-31/2 * *",
    "5 1 2-31/2 * *",
    "10 1 2-31/2 * *",
    "20 1 2-31/2 * *",
    "30 1 2-31/2 * *",
    "40 1 2-31/2 * *",
    "50 1 2-31/2 * *",
    "59 1 2-31/2 * *",

    "0 2 1-31/2 * *",
    "5 0 1-31/2 * *",
    "10 2 1-31/2 * *",
    "20 2 1-31/2 * *",
    "30 2 1-31/2 * *",
    "40 2 1-31/2 * *",
    "50 2 1-31/2 * *",
    "59 2 1-31/2 * *",

    "0 3 2-31/2 * *",
    "5 1 2-31/2 * *",
    "10 3 2-31/2 * *",
    "20 3 2-31/2 * *",
    "30 3 2-31/2 * *",
    "40 3 2-31/2 * *",
    "50 3 2-31/2 * *",
    "59 3 2-31/2 * *",

    "0 4 1-31/2 * *",
    "5 0 1-31/2 * *",
    "10 4 1-31/2 * *",
    "20 4 1-31/2 * *",
    "30 4 1-31/2 * *",
    "40 4 1-31/2 * *",
    "50 4 1-31/2 * *",
    "59 4 1-31/2 * *",

    "0 5 2-31/2 * *",
    "5 1 2-31/2 * *",
    "10 5 2-31/2 * *",
    "20 5 2-31/2 * *",
    "30 5 2-31/2 * *",
    "40 5 2-31/2 * *",
    "50 5 2-31/2 * *",
    "59 5 2-31/2 * *",

    "0 6 1-31/2 * *",
    "5 0 1-31/2 * *",
    "10 6 1-31/2 * *",
    "20 6 1-31/2 * *",
    "30 6 1-31/2 * *",
    "40 6 1-31/2 * *",
    "50 6 1-31/2 * *",
    "59 6 1-31/2 * *",

    "0 7 2-31/2 * *",
    "5 1 2-31/2 * *",
    "10 7 2-31/2 * *",
    "20 7 2-31/2 * *",
    "30 7 2-31/2 * *",
    "40 7 2-31/2 * *",
    "50 7 2-31/2 * *",
    "59 7 2-31/2 * *",

    "0 8 1-31/2 * *",
    "5 0 1-31/2 * *",
    "10 8 1-31/2 * *",
    "20 8 1-31/2 * *",
    "30 8 1-31/2 * *",
    "40 8 1-31/2 * *",
    "50 8 1-31/2 * *",
    "59 8 1-31/2 * *",
  ];
  return cron[Math.floor(Math.random() * cron.length)];
}

function removeDuplicates(array) {
  let filtered = [];
  try {
    filtered = array.filter((a, b) => array.indexOf(a) === b);
  } catch (error) {
    logger.error(`${__filename}: ${error}`);
  }
  return filtered;
}

export {
  clear,
  clearReposList,
  createPath,
  getTech,
  getFrameworkName,
  getRandomCron,
  getName,
  hasPath,
  sortObject,
  removeDuplicates,
  getMetaValue,
};
