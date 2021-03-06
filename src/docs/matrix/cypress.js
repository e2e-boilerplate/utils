import table from "markdown-table";
import { writeFileSync } from "fs";
import { logger, rootDir } from "../../common/constants";

import {
  all,
  chaiAssertionTypes,
  getPaths,
  implemented,
  implementedOnly,
  javascriptType,
  notImplementedOnly,
} from "./common";
import { removeDuplicates } from "../../common";

const frameworks = ["cypress"];
const moduleType = ["es-modules"];
const cucumberType = ["cucumber", "no-cucumber"];
const preprocessorType = ["browserify", "webpack", "no-preprocessor"];
const assertionType = ["chai", "jest"];
const jestAssertionType = ["expect"];

const chai = {};
const assertion = {};
const jestAssertion = {};
const javascript = {};
const module = {};
const framework = {};
const cucumber = {};
const preprocessor = {};

function buildList() {
  chaiAssertionTypes.forEach((c) => {
    chai[c] = {};
  });

  jestAssertionType.forEach((a) => {
    jestAssertion[a] = {};
  });

  assertionType.forEach((a) => {
    assertion[a] = a === "chai" ? chai : jestAssertion;
  });

  cucumberType.forEach((c) => {
    cucumber[c] = assertion;
  });

  preprocessorType.forEach((p) => {
    preprocessor[p] = cucumber;
  });

  javascriptType.forEach((j) => {
    javascript[j] = j === "non-typescript" ? cucumber : preprocessor;
  });

  moduleType.forEach((m) => {
    module[m] = javascript;
  });

  frameworks.forEach((f) => {
    framework[f] = module;
  });
}

export default function cypress() {
  buildList();
  const results = getPaths(framework);

  const list = [];
  const implementedList = [];
  const notImplementedList = [];

  results.forEach((result) => {
    const path = Array.from(result.toString().split(","));
    const noNonTypeScript = path.filter((part) => part !== "non-typescript");
    const noNonTranspiler = noNonTypeScript.filter((part) => part !== "no-preprocessor");
    const noCucumber = noNonTranspiler.filter((part) => part !== "no-cucumber");

    if (noCucumber.includes("es-modules") && noCucumber.includes("typescript")) {
      delete noCucumber[1];
    }

    const name = noCucumber.filter((n) => n !== "");

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
    const path = `${rootDir}/docs/matrix/cypress/all.md`;
    const pathImplemented = `${rootDir}/docs/matrix/cypress/implemented.md`;
    const pathNotImplemented = `${rootDir}/docs/matrix/cypress/not-implemented.md`;
    writeFileSync(path, table(content, { align: "l" }), "utf8");
    writeFileSync(pathImplemented, table(contentImplemented, { align: "l" }), "utf8");
    writeFileSync(pathNotImplemented, table(notContentImplemented, { align: "l" }), "utf8");
    logger.info(`\nWrite: ${path} \nWrite: ${pathImplemented} \nWrite: ${pathNotImplemented}`);
  } catch (error) {
    logger.error(`${__filename}: ${error}`);
  }
}
