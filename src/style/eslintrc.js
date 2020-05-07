import { logger, miscRepos, rootDir } from "../constants";
import { write } from "../exec";

function makeEslintrc(repo) {
  const { name } = repo;
  const parts = name.split("-");
  const data = {
    env: {
      commonjs: true,
    },
    extends: ["airbnb-base", "plugin:prettier/recommended"],
    plugins: [],
  };

  try {
    if (!parts.includes("typescript") && !miscRepos.includes(name)) {
      if (parts.includes("es")) {
        data.env.es6 = true;
      }

      if (parts.includes("jasmine")) {
        data.env.jasmine = true;
      }

      if (parts.includes("jest")) {
        data.env.jest = true;
      }

      if (parts.includes("mocha")) {
        data.env.mocha = true;
      }

      if (parts.includes("protractor")) {
        data.env.protractor = true;
      }

      if (parts.includes("cypress")) {
        data.env["cypress/globals"] = true;
        data.env.browser = true;
        data.plugins.push("cypress");
      } else {
        data.env.node = true;
      }

      if (parts.includes("webdriverio")) {
        data.extends.push("plugin:wdio/recommended");
        data.plugins.push("wdio");
      }

      if (parts.includes("wd")) {
        data.globals = {
          $: true,
          browser: true,
        };
      }

      if (parts.includes("testcafe")) {
        data.extends.push("plugin:testcafe/recommended");
        data.plugins.push("testcafe");
        data.rules = {};
        data.rules["no-unused-expressions"] = 0;
      }

      if (!parts.includes("cypress") && !parts.includes("webdriverio") && !parts.includes("testcafe")) {
        delete data.plugins;
      }

      const eslintrc = JSON.stringify(data, null, 2);
      const path = `${rootDir}/${name}/.eslintrc.json`;
      write(path, eslintrc, "utf8");
      logger.info(`eslintrc ${name}`);
    }
  } catch (error) {
    logger.error(`${__filename}: ${error}`);
  }
}

export default makeEslintrc;
