import { userInfo } from "os";
import minimist from "minimist";

const logger = require("pino")({
  prettyPrint: { colorize: true },
});

const {
  author = "Girma Nigusse <xgirma@gmail.com>",
  command,
  keywords,
  message,
  module,
  pages,
  task,
  token,
  username = "e2e-boilerplate",
} = minimist(process.argv.slice(2));
const user = userInfo().username;
const rootDir = `/Users/${user}/Documents/${username}`;
const reposDir = "./repos";
const miscRepos = ["docs", "e2e-boilerplate", "picker", "resources", "sandbox", "utils", "api", "swagger"];
const frameworks = ["cypress", "nightwatch", "playwright", "protractor", "puppeteer", "testcafe", "wd", "webdriverio"];
const workflow = ["build", "install:linux", "lint", "npm:install", "start:webdriver", "test", "update:webdriver"];
const options = {
  host: "api.github.com",
  method: "GET",
  headers: {
    "user-agent": "node.js",
    "Content-Type": "application/json",
  },
};

if (token) {
  options.headers.Authorization = `token ${token}`;
}

export {
  author,
  command,
  frameworks,
  keywords,
  logger,
  message,
  miscRepos,
  module,
  options,
  pages,
  reposDir,
  rootDir,
  task,
  user,
  username,
  workflow,
};
