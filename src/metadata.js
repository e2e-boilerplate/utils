import { readFileSync } from "fs";
import { logger, rootDir, author, keywords, miscRepos, username } from "./constants";
import { getFrameworkName, getTech, sortObject } from "./common";
import { write } from "./exec";
import makeDeps from "./deps/deps";

function buildKeywords(name) {
  const keysFromRepoName = name.toLowerCase().split("-");

  let jestCount = 0;

  keysFromRepoName.forEach((part) => {
    if (part === "jest") {
      jestCount += 1;
    }
  });

  const hasTwoJest = jestCount === 2;

  if (keysFromRepoName.includes("ts" && "node")) {
    keysFromRepoName.push("ts-node");
  }

  if (hasTwoJest && keysFromRepoName.includes("ts" && "jest")) {
    keysFromRepoName.push("ts-jest");
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

  const escapeDouble = hasTwoJest
    ? ["modules", "ts", "node", "es", "webdriver", "manager", "jest"]
    : ["modules", "ts", "node", "es", "webdriver", "manager"];

  const keys = keysFromRepoName.filter((word) => !escapeDouble.includes(word));

  if (hasTwoJest) {
    keys.push("jest");
  }

  let keysFromArgs = [];
  if (keywords) {
    keysFromArgs = keywords.toLowerCase().split("-");
  }
  return keys.concat(keysFromArgs).sort();
}

function buildDescription(name) {
  const framework = getFrameworkName(name);
  const tech = getTech(name);
  return `${framework} end-to-end test automation boilerplate. ${tech}`;
}

async function updateMeta(repo) {
  const { name } = repo;

  try {
    const data = readFileSync(`${rootDir}/${name}/package.json`);
    const pkgJson = JSON.parse(data);
    const script = pkgJson.scripts;
    const path = `${rootDir}/${name}/package.json`;

    pkgJson.keywords = buildKeywords(name);
    pkgJson.description = buildDescription(name);
    pkgJson.name = name;
    pkgJson.homepage = `https://github.com/${username}/${name}#readme`;
    pkgJson.repository = {
      type: "git",
      url: `git+https://github.com/${username}/${name}.git`,
    };
    pkgJson.bugs = {
      url: `https://github.com/${username}/${name}/issues`,
    };
    pkgJson.author = author || "";
    pkgJson.scripts = sortObject(script);
    if (pkgJson.main) {
      delete pkgJson.main;
    }
    pkgJson.license = "MIT";

    if (!miscRepos.includes(name)) {
      const { dependencies, devDependencies } = await makeDeps(repo);
      pkgJson.dependencies = sortObject(dependencies);
      pkgJson.devDependencies = sortObject(devDependencies);
    }

    const update = JSON.stringify(sortObject(pkgJson), null, 2);
    await write(path, update, "utf8");
  } catch (error) {
    logger.error(error);
  }
}

export default updateMeta;
