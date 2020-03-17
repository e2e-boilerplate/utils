import table from "markdown-table";
import { logger, rootDir } from "../constants";
import { write } from "../exec";
import { all, getPaths, implemented, implementedOnly, notImplementedOnly } from "./common";

// browser
const frameworks = ["cypress"];

const chai = {};
const assertion = {};
const bundler = {};
const typescript = {};
const esModule = {};
const javascript = {};
const module = {};
const framework = {};

const chaiAssertionTypes = ["expect", "should", "assert"];
const assertionType = ["assert", "expect", "chai", "none"];
const bundlerType = ["webpack", "browserify", "none"];
const typescriptTranspiler = ["tsc", "ts-node", "none"];
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

  bundlerType.forEach(b => {
    bundler[b] = assertion;
  });

  typescriptTranspiler.forEach(t => {
    typescript[t] = bundler;
  });

  esModuleTranspiler.forEach(e => {
    esModule[e] = bundler;
  });

  javascriptType.forEach(j => {
    javascript[j] = j === "non-typescript" ? esModule : typescript;
  });

  moduleType.forEach(m => {
    module[m] = m === "commonjs" ? bundler : javascript;
  });

  frameworks.forEach(f => {
    framework[f] = module;
  });
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

    list.push(name.join("-"));
    if (implemented(name.join("-"))) {
      implementedList.push(name.join("-"));
    } else {
      notImplementedList.push(name.join("-"));
    }
  });

  const content = all(list);
  const contentImplemented = implementedOnly(implementedList);
  const notContentImplemented = notImplementedOnly(notImplementedList);

  try {
    const path = `${rootDir}/utils/docs/cypress/all.md`;
    const pathImplemented = `${rootDir}/utils/docs/cypress/implemented.md`;
    const pathNotImplemented = `${rootDir}/utils/docs/cypress/not-implemented.md`;
    await write(path, table(content, { align: "l" }), "utf8");
    await write(pathImplemented, table(contentImplemented, { align: "l" }), "utf8");
    await write(pathNotImplemented, table(notContentImplemented, { align: "l" }), "utf8");
  } catch (error) {
    logger.error(error);
  }
}

matrix();
