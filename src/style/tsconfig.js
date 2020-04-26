import { logger, rootDir } from "../constants";
import { write } from "../exec";

async function makeTsconfig(repo) {
  const { name } = repo;
  const parts = name.split("-");
  const data = {
    compilerOptions: {
      strict: true,
      moduleResolution: "node",
      resolveJsonModule: true,
      lib: [],
      types: ["node"],
      typeRoots: ["node_modules/@types"],
      outDir: "build",
    },
  };

  try {
    if (parts.includes("typescript")) {
      if (parts.includes("es")) {
        data.compilerOptions.target = "es6";
      } else {
        data.compilerOptions.target = "es5";
      }

      if (parts.includes("nightwatch")) {
        data.compilerOptions.types.push("nightwatch");
      }

      if (parts.includes("jasmine")) {
        data.compilerOptions.types.push("jasmine");
      }

      if (parts.includes("jest")) {
        data.compilerOptions.types.push("jest");
      }

      if (parts.includes("mocha")) {
        data.compilerOptions.types.push("mocha");
      }

      if (parts.includes("chai") && !parts.includes("browserify")) {
        data.compilerOptions.types.push("chai");
      }

      if (parts.includes("protractor") && parts.includes("jasmine")) {
        data.compilerOptions.types.push("jasminewd2");
      }

      if (parts.includes("cypress")) {
        data.compilerOptions.lib.push("dom");
        data.compilerOptions.lib.push("es2015");

        delete data.compilerOptions.outDir;

        if (parts.includes("typescript") && parts.includes("jest")) {
          data.compilerOptions.types[0] = "jest";
          data.compilerOptions.types[1] = "cypress";
          data.compilerOptions.skipLibCheck = true;
          data.compilerOptions.paths = {
            chai: ["./noop.d.ts"], // eslint-disable-line
          };
          data.compilerOptions.baseUrl = "../node_modules";
        } else {
          data.compilerOptions.types[0] = "cypress";
        }
      }

      if (parts.includes("webdriverio") && parts.includes("jasmine")) {
        data.compilerOptions.types.push("@wdio/sync");
        data.compilerOptions.types.push("@wdio/jasmine-framework");
      }

      if (parts.includes("webdriverio") && parts.includes("mocha")) {
        data.compilerOptions.types.push("@wdio/sync");
        data.compilerOptions.types.push("@wdio/mocha-framework");
      }

      if (parts.includes("puppeteer")) {
        data.compilerOptions.types.push("puppeteer");
      }

      if (parts.includes("selenium") && parts.includes("webdriver")) {
        data.compilerOptions.types.push("selenium-webdriver");
      }

      if (data.compilerOptions.lib.length === 0) {
        delete data.compilerOptions.lib;
      }

      const eslintrc = JSON.stringify(data, null, 2);
      const path = `${rootDir}/${name}/tsconfig.json`;
      await write(path, eslintrc, "utf8");
      logger.info(`eslintrc ${name}`);
    }
  } catch (error) {
    logger.error(`${__filename}: ${error}`);
  }
}

export default makeTsconfig;
