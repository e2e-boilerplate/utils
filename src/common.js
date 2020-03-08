import * as rimraf from "rimraf";
import { existsSync, mkdirSync } from "fs";
import { logger } from "./constants";

const frameworks = ["cypress", "nightwatch", "playwright", "protractor", "puppeteer", "webdriverio", "wd"];
const others = ["actions", "sandbox", "utils"];

async function clear(path) {
  try {
    await rimraf.sync(path);
    logger.info(`Clearing: ${path}`);
  } catch (error) {
    logger.info(`Clearing: ${path}: ${error}`);
  }
}

async function hasPath(path) {
  let has = false;
  try {
    has = await existsSync(path);
  } catch (error) {
    logger.error(`Has: ${path} : ${error}`);
  }
  logger.info(`Has: ${path}? ${has}`);
  return has;
}

async function createPath(path) {
  try {
    logger.info(`Creating: ${path}`);
    await mkdirSync(path);
  } catch (error) {
    logger.error(`Creating: ${path} : ${error}`);
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
  return `${word.charAt(0).toUpperCase()}${word.slice(1)}`;
}

function getTech(name) {
  let techs = [];
  const format = [];

  try {
    if (!others.includes(name)) {
      const parts = name.split("-");
      if (frameworks.includes(parts[0])) {
        techs = parts.slice(1);
      } else {
        techs = parts.slice(2);
      }

      techs.forEach(tech => {
        switch (tech) {
          case "es":
            format.push("ES Modules");
            break;
          case "modules":
            break;
          case "ts":
            format.push("ts-node");
            break;
          case "node":
            break;
          case "esm":
            format.push("esm");
            break;
          case "typescript":
            format.push("TypeScript");
            break;
          default:
            format.push(capitalize(tech));
        }
      });

      const first = format.slice(0, -1);
      const last = format.slice(-1);

      return `Using ${first.join(", ")} and ${last}.`;
    }
  } catch (error) {
    logger.error(error);
  }

  return [];
}

function getFrameworkName(name) {
  let frameworkName = "";

  if (others.includes(name)) {
    frameworkName = capitalize(name);
  } else {
    try {
      const parts = name.split("-");
      if (frameworks.includes(parts[0])) {
        if (parts[0] === "wd") {
          frameworkName = parts[0].toUpperCase();
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
  const crons = [
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
  return crons[Math.floor(Math.random() * crons.length)];
}

export { clear, clearReposList, createPath, getTech, getFrameworkName, getRandomCron, hasPath, sortObject };
