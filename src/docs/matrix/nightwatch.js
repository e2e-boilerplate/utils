import table from "markdown-table";
import { logger, rootDir } from "../../constants";
import { write } from "../../exec";
import {
  all,
  getPaths,
  implemented,
  implementedOnly,
  notImplementedOnly,
  chaiAssertionTypes,
  assertionType,
  typescriptTranspiler,
  esModuleTranspiler,
  javascriptType,
  moduleType,
} from "./common";
import { removeDuplicates } from "../../common";

// built-in test runner
const frameworks = ["nightwatch"];

const chai = {};
const assertion = {};
const typescript = {};
const esModule = {};
const javascript = {};
const module = {};
const framework = {};

function buildList() {
  chaiAssertionTypes.forEach((c) => {
    chai[c] = {};
  });

  assertionType.forEach((a) => {
    assertion[a] = a === "chai" ? chai : {};
  });

  typescriptTranspiler.forEach((t) => {
    typescript[t] = assertion;
  });

  esModuleTranspiler.forEach((e) => {
    esModule[e] = assertion;
  });

  javascriptType.forEach((j) => {
    javascript[j] = j === "non-typescript" ? esModule : typescript;
  });

  moduleType.forEach((m) => {
    module[m] = m === "commonjs" ? assertion : javascript;
  });

  frameworks.forEach((f) => {
    framework[f] = module;
  });
}

export default function nightwatch() {
  buildList();
  const results = getPaths(framework);

  const list = [];
  const implementedList = [];
  const notImplementedList = [];

  results.forEach((result) => {
    const path = Array.from(result.toString().split(","));
    const noNonTypeScript = path.filter((part) => part !== "non-typescript");
    const noNone = noNonTypeScript.filter((part) => part !== "none");

    if (noNone.includes("es-modules") && noNone.includes("typescript")) {
      delete noNone[1];
    }

    const name = noNone.filter((n) => n !== "");

    list.push(name.join("-"));
    if (implemented(name.join("-"))) {
      implementedList.push(name.join("-"));
    } else {
      notImplementedList.push(name.join("-"));
    }
  });

  const content = all(removeDuplicates(list));
  const contentImplemented = implementedOnly(removeDuplicates(implementedList));
  const notContentImplemented = notImplementedOnly(removeDuplicates(notImplementedList));

  try {
    const path = `${rootDir}/utils/docs/nightwatch/all.md`;
    const pathImplemented = `${rootDir}/utils/docs/nightwatch/implemented.md`;
    const pathNotImplemented = `${rootDir}/utils/docs/nightwatch/not-implemented.md`;
    write(path, table(content, { align: "l" }), "utf8");
    write(pathImplemented, table(contentImplemented, { align: "l" }), "utf8");
    write(pathNotImplemented, table(notContentImplemented, { align: "l" }), "utf8");
  } catch (error) {
    logger.error(`${__filename}: ${error}`);
  }
}