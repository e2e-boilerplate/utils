import * as rimraf from "rimraf";
import { existsSync, mkdirSync } from "fs";
import { logger, rootDir } from "./constants";

// given path clears file or folder
async function clear(path) {
  try {
    await rimraf.sync(path);
    logger.info(`Clearing: ${path}`);
  } catch (error) {
    logger.info(`${__filename}: Clearing file/folder: ${path}: ${error}`);
  }
}

// check if path exist
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

// creates path
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

async function setRootDir() {
  try {
    await mkdirSync(rootDir);
    logger.info("Writing root directory.");
  } catch (error) {
    logger.error(`${__filename}: ${error}`);
  }
}

export { clear, hasPath, createPath, setRootDir };
