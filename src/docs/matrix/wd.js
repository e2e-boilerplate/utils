import table from "markdown-table";
import { writeFileSync } from "fs";
import { logger, rootDir } from "../../common/constants";
import {
  all,
  assertionType,
  chaiAssertionTypes,
  esModuleTranspiler,
  getPaths,
  implemented,
  implementedOnly,
  javascriptType,
  moduleType,
  notImplementedOnly,
  runnerType,
  typescriptTranspiler,
} from "./common";
import { removeDuplicates } from "../../common";

const frameworks = ["wd"];
const driverType = ["webdriver-manager"];

// TODO make sure webdriver-manager comes after commonjs,es-modules, & type-script
const chai = {};
const assertion = {};
const runner = {};
const driver = {};
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

  runnerType.forEach((r) => {
    runner[r] = r === "ava" || r === "tape" || r === "none" ? {} : assertion;
  });

  driverType.forEach((d) => {
    driver[d] = runner;
  });

  typescriptTranspiler.forEach((t) => {
    typescript[t] = driver;
  });

  esModuleTranspiler.forEach((e) => {
    esModule[e] = driver;
  });

  javascriptType.forEach((j) => {
    javascript[j] = j === "non-typescript" ? esModule : typescript;
  });

  moduleType.forEach((m) => {
    module[m] = m === "commonjs" ? driver : javascript;
  });

  frameworks.forEach((f) => {
    framework[f] = module;
  });
}

export default function wd() {
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

    if (!(!path.includes("jest") && path.includes("ts-jest"))) {
      list.push(name.join("-"));
      if (implemented(name.join("-"))) {
        implementedList.push(name.join("-"));
      } else {
        notImplementedList.push(name.join("-"));
      }
    }
  });

  const content = all(removeDuplicates(list));
  const contentImplemented = implementedOnly(removeDuplicates(implementedList));
  const notContentImplemented = notImplementedOnly(removeDuplicates(notImplementedList));

  try {
    const path = `${rootDir}/docs/matrix/wd/all.md`;
    const pathImplemented = `${rootDir}/docs/matrix/wd/implemented.md`;
    const pathNotImplemented = `${rootDir}/docs/matrix/wd/not-implemented.md`;
    writeFileSync(path, table(content, { align: "l" }), "utf8");
    writeFileSync(pathImplemented, table(contentImplemented, { align: "l" }), "utf8");
    writeFileSync(pathNotImplemented, table(notContentImplemented, { align: "l" }), "utf8");
    logger.info(`\nWrite: ${path} \nWrite: ${pathImplemented} \nWrite: ${pathNotImplemented}`);
  } catch (error) {
    logger.error(`${__filename}: ${error}`);
  }
}
