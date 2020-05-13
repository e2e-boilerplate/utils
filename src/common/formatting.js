/* eslint-disable no-param-reassign */
import { logger } from "./constants";

function sortObject(obj) {
  const keys = Object.keys(obj).sort();
  const newObj = {};
  keys.forEach((key) => {
    newObj[key] = obj[key];
  });
  return newObj;
}

function capitalize(word) {
  if (word === "webdriver") {
    return "WebDriver";
  }
  return `${word.charAt(0).toUpperCase()}${word.slice(1)}`;
}

function removeDuplicates(array) {
  let filtered = [];
  try {
    filtered = array.filter((a, b) => array.indexOf(a) === b);
  } catch (error) {
    logger.error(`${__filename}: ${error}`);
  }
  return filtered;
}

function linkTech(tech) {
  let formatted;
  try {
    const chai = tech.replace("Chai", "[Chai](https://www.chaijs.com)");
    const cucumber = chai.replace("Cucumber", "[Cucumber](https://github.com/cucumber/cucumber-js)");
    const browserify = cucumber.replace("Browserify", "[Browserify](http://browserify.org)");
    const webpack = browserify.replace("Webpack", "[Webpack](https://webpack.js.org)");
    const babel = webpack.replace("Babel", "[Babel](https://babeljs.io)");
    const typescript = babel.replace("TypeScript", "[TypeScript](https://www.typescriptlang.org)");
    const jasmine = typescript.replace("Jasmine", "[Jasmine](https://jasmine.github.io)");
    const jest = jasmine.replace("Jest", "[Jest](https://jestjs.io)");
    const mocha = jest.replace("Mocha", "[Mocha](https://mochajs.org)");
    const esm = mocha.replace("esm", "[esm](https://www.npmjs.com/package/esmjs)");
    const tsJest = esm.replace("ts-jest", "[ts-jest](https://github.com/kulshekhar/ts-jest)");
    const tsNode = tsJest.replace("ts-node", "[ts-jest](https://github.com/TypeStrong/ts-node)");
    const ava = tsNode.replace("AVA", "[AVA](https://github.com/avajs/ava)");
    const tape = ava.replace("Tape", "[Tape](https://github.com/substack/tape)");
    const commonjs = tape.replace("Commonjs", "[Commonjs](https://requirejs.org/docs/commonjs.html)");
    const esModules = commonjs.replace(
      "ES Modules",
      "[ES Modules](https://hacks.mozilla.org/2018/03/es-modules-a-cartoon-deep-dive/)"
    );
    const wm = esModules.replace(
      "Webdriver-Manager",
      "[Webdriver-Manager](https://github.com/angular/webdriver-manager#readme)"
    );

    if (wm.includes("Chai")) {
      let matcher;
      if (wm.includes("Assert")) {
        matcher = wm.replace("Assert", "[Commonjs](https://www.chaijs.com/api/assert/)");
      }
      if (wm.includes("Expect")) {
        matcher = wm.replace("Expect", "[Commonjs](https://www.chaijs.com/api/bdd/)");
      }
      if (wm.includes("Should")) {
        matcher = wm.replace("Should", "[Commonjs](https://www.chaijs.com/api/bdd/)");
      }
      formatted = matcher;
    } else if (wm.includes("Assert")) {
      let matcher;
      if (wm.includes("Assert")) {
        matcher = wm.replace("Assert", "[Commonjs](https://nodejs.org/api/assert.html)");
      }
      formatted = matcher;
    } else {
      formatted = wm;
    }
  } catch (error) {
    logger.error(`${__filename}: ${error}`);
  }

  return formatted;
}

const bubbleSort = (inputArr) => {
  const len = inputArr.length;
  let swapped;
  do {
    swapped = false;
    for (let i = 0; i < len - 1; i += 1) {
      if (inputArr[i][0] < inputArr[i + 1][0]) {
        const tmp = inputArr[i];
        inputArr[i] = inputArr[i + 1];
        inputArr[i + 1] = tmp;
        swapped = true;
      }
    }
  } while (swapped);
  return inputArr;
};

export { bubbleSort, capitalize, linkTech, removeDuplicates, sortObject };
