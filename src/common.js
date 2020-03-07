import * as rimraf from "rimraf";
import { existsSync, mkdirSync } from "fs";
import { logger } from "./constants";

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

function getFrameworkName(name) {
  const parts = name.split("-");
  const frameworks = ["cypress", "nightwatch", "playwright", "protractor", "puppeteer", "webdriverio", "wd"];
  if (frameworks.includes(parts[0])) {
    return parts[0];
  }
  return `${parts[0]} ${parts[1]}`;
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

export { clear, clearReposList, createPath, getFrameworkName, getRandomCron, hasPath, sortObject };
