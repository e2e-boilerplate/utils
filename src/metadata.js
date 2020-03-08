import { writeFileSync, readFileSync } from "fs";
import { logger, rootDir, author, keywords, username } from "./constants";
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

  if (keysFromRepoName.includes("es && modules")) {
    keysFromRepoName.push("es modules");
  }

  if (keysFromRepoName.includes("webdriver" && "manager")) {
    keysFromRepoName.push("webdriver manager");
  }

  const escapeDouble = ["modules", "ts", "node", "es", "webdriver", "manager"];

  const keys = keysFromRepoName.filter(word => !escapeDouble.includes(word));

  let keysFromArgs = [];
  if (keywords) {
    keysFromArgs = keywords.toLowerCase().split("-");
  }
  return keys.concat(keysFromArgs).sort();
}

function buildDescription(name) {
  const framework = getFrameworkName(name);
  const tech = getTech(name);
  return `${framework} end-to-end test automation boilerplate. Using ${tech}`;
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
    pkgJson.homepage = `https://github.com/${username}/${name}#readme`;
    pkgJson.repository = {
      type: "git",
      url: `git+https://github.com/${username}/${name}.git`
    };
    pkgJson.bugs = {
      url: `https://github.com/${username}/${name}/issues`
    };
    pkgJson.author = author || "";
    pkgJson.scripts = sortObject(script);
    if (pkgJson.main) {
      delete pkgJson.main;
    }
    pkgJson.license = "MIT";

    await writeChanges(name, JSON.stringify(sortObject(pkgJson)));
  } catch (error) {
    logger.error(error);
  }
}

export default updateMeta;
