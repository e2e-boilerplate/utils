import { readdirSync } from "fs";
import { logger, reposDir, username } from "../../constants";

export const chaiAssertionTypes = ["expect", "should", "assert"];
export const assertionType = ["assert", "expect", "chai", "none"];
export const runnerType = ["jasmine", "mocha", "jest", "ava", "tape", "cucumber", "none"];
export const typescriptTranspiler = ["tsc", "ts-node", "ts-jest", "none"];
export const esModuleTranspiler = ["babel", "esm", "none", "babel-jest"];
export const javascriptType = ["non-typescript", "typescript"];
export const moduleType = ["commonjs", "es-modules"];

export function getPaths(root) {
  const paths = [];
  const nodes = [
    {
      obj: root,
      path: [],
    },
  ];
  while (nodes.length > 0) {
    const n = nodes.pop();
    Object.keys(n.obj).forEach((k) => {
      if (typeof n.obj[k] === "object") {
        const path = n.path.concat(k);
        paths.push(path);
        nodes.unshift({
          obj: n.obj[k],
          path,
        });
      }
    });
  }
  return paths;
}

export function implemented(name) {
  let isImplemented = false;
  const BreakException = {};

  try {
    const files = readdirSync(reposDir);
    for (let i = 1; i < files.length; i += 1) {
      const repos = require(`../../../repos/repo-${i}.json`);
      // eslint-disable-next-line no-loop-func
      repos.forEach((repo) => {
        isImplemented = repo.name === name;
        if (isImplemented) {
          throw BreakException;
        }
      });
    }
  } catch (error) {
    if (error !== BreakException) {
      logger.error(`${__filename}: ${error}`);
      throw error;
    }
  }

  return isImplemented;
}

export function actionsStatus(name) {
  return `[![GitHub Actions status &#124; ${username}/${name}](https://github.com/${username}/${name}/workflows/${name}/badge.svg)](https://github.com/${username}/${name}/actions?workflow=${name})`;
}

export function actionsStatusHome(name) {
  return `[![${name}](https://github.com/${username}/${name}/workflows/${name}/badge.svg)](https://github.com/${username}/${name})`;
}

export function all(list) {
  const content = [];
  content.push(["No", "Repository", "Status"]);

  list.reverse().forEach((l, index) => {
    if (implemented(l)) {
      content.push([`${index + 1}`, `${actionsStatus(l)}`, `Implemented`]);
    } else {
      content.push([`${index + 1}`, l, "Not Implemented"]);
    }
  });

  return content;
}

export function implementedOnly(list) {
  const contentImplemented = [];
  contentImplemented.push(["No", "Status"]);

  list.sort().forEach((i, index) => {
    if (implemented(i)) {
      contentImplemented.push([`${index + 1}`, `${actionsStatus(i)}`]);
    }
  });
  return contentImplemented;
}

export function implementedOnlyHome(list) {
  const contentImplemented = [];
  contentImplemented.push(["No", "Boilerplate"]);

  list.sort().forEach((i, index) => {
    if (implemented(i)) {
      contentImplemented.push([`${index + 1}`, `${actionsStatusHome(i)}`]);
    }
  });

  return contentImplemented;
}

export function notImplementedOnly(list) {
  const notContentImplemented = [];
  notContentImplemented.push(["No", "Repository", "Status"]);

  list.sort().forEach((i, index) => {
    if (!implemented(i)) {
      notContentImplemented.push([`${index + 1}`, i, `Not Implemented`]);
    }
  });
  return notContentImplemented;
}
