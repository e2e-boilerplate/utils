import { writeFileSync, readFileSync } from "fs";
import { logger, rootDir, author, keywords } from "./constants";
import { getFrameworkName, getTech, sortObject } from "./common";

async function writeChanges(name, data) {
  try {
    writeFileSync(`${rootDir}/${name}/package.json`, data);
    logger.info(`Update metadata for ${name}`);
  } catch (error) {
    logger.error(error);
  }
}

function buildKeywords(name) {
  const keysFromRepoName = name.toLowerCase().split("-");

  if (keysFromRepoName.includes("ts" && "node")) {
    keysFromRepoName.push("ts-node");
  }
  if (keysFromRepoName.includes("selenium" && "webdriver")) {
    keysFromRepoName.push("selenium-webdriver");
  }
  if (keysFromRepoName.includes("es6")) {
    keysFromRepoName.push("es modules");
  }

  const keys = keysFromRepoName.filter(
    word => word !== "modules" && word !== "ts" && word !== "node" && word !== "es6"
  );
  let keysFromArgs = [];
  if (keywords) {
    keysFromArgs = keywords.toLowerCase().split("-");
  }
  return keys.concat(keysFromArgs).sort();
}

function buildDescription(name) {
  const framework = getFrameworkName(name);
  const tech = getTech(name);
  return `${framework} end-to-end test automation boilerplate. using ${tech}`;
}

async function updateMeta(repo) {
  const { name } = repo;

  try {
    const data = readFileSync(`${rootDir}/${name}/package.json`);
    const pkgJson = JSON.parse(data);
    const script = pkgJson.scripts;

    pkgJson.keywords = buildKeywords(name);
    pkgJson.description = buildDescription(name);
    pkgJson.name = name;
    pkgJson.repository = {
      type: "git",
      url: `git+https://github.com/e2e-boilerplates/${name}.git`
    };
    pkgJson.author = author || "";
    pkgJson.scripts = sortObject(script);

    await writeChanges(name, JSON.stringify(sortObject(pkgJson)));
  } catch (error) {
    logger.error(error);
  }
}

export default updateMeta;
