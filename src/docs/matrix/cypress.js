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
  javascriptType,
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

export default async function cypress() {
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
    const path = `${rootDir}/utils/docs/cypress/all.md`;
    const pathImplemented = `${rootDir}/utils/docs/cypress/implemented.md`;
    const pathNotImplemented = `${rootDir}/utils/docs/cypress/not-implemented.md`;
    await write(path, table(content, { align: "l" }), "utf8");
    await write(pathImplemented, table(contentImplemented, { align: "l" }), "utf8");
    await write(pathNotImplemented, table(notContentImplemented, { align: "l" }), "utf8");
  } catch (error) {
    logger.error(`${__filename}: ${error}`);
  }
}
