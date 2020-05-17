import { readFileSync, writeFileSync } from "fs";
import { frameworks, logger, miscRepos, rootDir } from "./constants";
import { capitalize, sortObject } from "./formatting";
import { createPath, hasPath } from "./file";

// given repo name extracts techs used
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
          case "tsc":
            format.push("tsc");
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

// extract framework name from repo name
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
  writeFileSync(path, update, "utf8");
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
      logger.info(`writing ${path}`);
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

export { getFrameworkName, getMetaValue, getName, getTech };
