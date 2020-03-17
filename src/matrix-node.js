import { readdirSync } from "fs";
import table from "markdown-table";
import { frameworks, logger, reposDir, rootDir, username } from "./constants";
import { write } from "./exec";

frameworks.push("selenium-webdriver");

const chai = {};
const assertion = {};
const runner = {};
const typescript = {};
const esModule = {};
const javascript = {};
const module = {};
const framework = {};

const chaiAssertionTypes = ["expect", "should", "assert"];
const assertionType = ["assert", "expect", "chai", "none"];
const runnerType = ["jasmine", "mocha", "jest", "ava", "tape", "cucumber", "none"];
const typescriptTranspiler = ["tsc", "ts-node", "ts-jest", "none"];
const esModuleTranspiler = ["babel", "esm", "none"];
const javascriptType = ["non-typescript", "typescript"];
const moduleType = ["commonjs", "es-modules"];

function buildList() {
  chaiAssertionTypes.forEach(c => {
    chai[c] = {};
  });

  assertionType.forEach(a => {
    assertion[a] = a === "chai" ? chai : {};
  });

  runnerType.forEach(r => {
    runner[r] = r === "ava" || r === "tape" || r === "none" ? {} : assertion;
  });

  typescriptTranspiler.forEach(t => {
    typescript[t] = runner;
  });

  esModuleTranspiler.forEach(e => {
    esModule[e] = runner;
  });

  javascriptType.forEach(j => {
    javascript[j] = j === "non-typescript" ? esModule : typescript;
  });

  moduleType.forEach(m => {
    module[m] = m === "commonjs" ? runner : javascript;
  });

  frameworks.forEach(f => {
    if (f !== "cypress") {
      framework[f] = module;
    }
  });
}

function getPaths(root) {
  const paths = [];
  const nodes = [
    {
      obj: root,
      path: []
    }
  ];
  while (nodes.length > 0) {
    const n = nodes.pop();
    Object.keys(n.obj).forEach(k => {
      if (typeof n.obj[k] === "object") {
        const path = n.path.concat(k);
        paths.push(path);
        nodes.unshift({
          obj: n.obj[k],
          path
        });
      }
    });
  }
  return paths;
}

function implemented(name) {
  let isImplemented = false;
  const BreakException = {};

  try {
    const files = readdirSync(reposDir);
    for (let i = 1; i < files.length; i += 1) {
      const repos = require(`../repos/repo-${i}.json`);
      // eslint-disable-next-line no-loop-func
      repos.forEach(repo => {
        isImplemented = repo.name === name;
        if (isImplemented) {
          throw BreakException;
        }
      });
    }
  } catch (error) {
    if (error !== BreakException) {
      logger.error(error);
      throw error;
    }
  }

  return isImplemented;
}

function actionsStatus(name) {
  return `[![GitHub Actions status &#124; ${username}/${name}](https://github.com/${username}/${name}/workflows/${name}/badge.svg)](https://github.com/${username}/${name}/actions?workflow=${name})`;
}

async function matrix() {
  buildList();
  const results = getPaths(framework);

  const list = [];
  const implementedList = [];
  const notImplementedList = [];

  results.forEach(result => {
    const path = Array.from(result.toString().split(","));
    const noNonTypeScript = path.filter(part => part !== "non-typescript");
    const noNone = noNonTypeScript.filter(part => part !== "none");

    if (noNone.includes("es-modules") && noNone.includes("typescript")) {
      delete noNone[1];
    }

    const name = noNone.filter(n => n !== "");

    if (!(!path.includes("jest") && path.includes("ts-jest"))) {
      list.push(name.join("-"));
      if (implemented(name.join("-"))) {
        implementedList.push(name.join("-"));
      } else {
        notImplementedList.push(name.join("-"));
      }
    }
  });

  const content = [];
  const contentImplemented = [];
  const notContentImplemented = [];

  content.push(["No", "Repository", "Status"]);
  contentImplemented.push(["No", "Status"]);
  notContentImplemented.push(["No", "Repository", "Status"]);

  list.reverse().forEach((l, index) => {
    if (implemented(l)) {
      content.push([`${index + 1}`, `${actionsStatus(l)}`, `Implemented`]);
    } else {
      content.push([`${index + 1}`, l, "Not Implemented"]);
    }
  });

  implementedList.sort().forEach((i, index) => {
    if (implemented(i)) {
      contentImplemented.push([`${index + 1}`, `${actionsStatus(i)}`]);
    }
  });

  notImplementedList.sort().forEach((i, index) => {
    if (!implemented(i)) {
      notContentImplemented.push([`${index + 1}`, i, `Not Implemented`]);
    }
  });

  try {
    const path = `${rootDir}/utils/docs/list.md`;
    const pathImplemented = `${rootDir}/utils/docs/list-implemented.md`;
    const pathNotImplemented = `${rootDir}/utils/docs/list-not-implemented.md`;
    await write(path, table(content, { align: "l" }), "utf8");
    await write(pathImplemented, table(contentImplemented, { align: "l" }), "utf8");
    await write(pathNotImplemented, table(notContentImplemented, { align: "l" }), "utf8");
  } catch (error) {
    logger.error(error);
  }
}

matrix();
