import { readFileSync } from "fs";
import { logger, rootDir, author, keywords, miscRepos, username } from "./common/constants";
import { getFrameworkName, getTech, sortObject } from "./common";
import { write } from "./exec";
import makeDeps from "./deps/deps";

const lintStagedTypescript = {
  "*.{js,ts,json,md}": ["prettier --write"], // eslint-disable-line
};

const lintStaged = {
  "*.{js,json,md}": ["prettier --write"], // eslint-disable-line
};

const husky = {
  hooks: {
    "pre-commit": "lint-staged --allow-empty", // eslint-disable-line
  }, // eslint-disable-line
};

const cypressCucumberPreprocessor = {
  nonGlobalStepDefinitions: true, // eslint-disable-line
};

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

  if (keysFromRepoName.includes("selenium" && "webdriver") && !keysFromRepoName.includes("manager")) {
    keysFromRepoName.push("selenium-webdriver");
  }

  if (keysFromRepoName.includes("selenium" && "manager") && !keysFromRepoName.includes("webdriver")) {
    keysFromRepoName.push("webdriver manager");
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

export default function updateMeta(repo) {
  const { name } = repo;

  try {
    const data = readFileSync(`${rootDir}/${name}/package.json`);
    const pkgJson = JSON.parse(data);
    const script = pkgJson.scripts;
    const path = `${rootDir}/${name}/package.json`;
    const parts = name.split("-");

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
    pkgJson.husky = husky;

    if (!parts.includes("typescript")) {
      pkgJson["lint-staged"] = lintStaged;
    } else {
      pkgJson["lint-staged"] = lintStagedTypescript;
    }

    if (parts.includes("cypress") && parts.includes("cucumber")) {
      pkgJson["cypress-cucumber-preprocessor"] = cypressCucumberPreprocessor;
    }

    if (!miscRepos.includes(name)) {
      const { dependencies, devDependencies } = makeDeps(repo);
      pkgJson.dependencies = sortObject(dependencies);
      pkgJson.devDependencies = sortObject(devDependencies);
    }

    const update = JSON.stringify(sortObject(pkgJson), null, 2);
    write(path, update, "utf8");
  } catch (error) {
    logger.error(`${__filename}: ${error}`);
  }
}
