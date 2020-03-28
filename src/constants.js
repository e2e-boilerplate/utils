import { userInfo } from "os";
import minimist from "minimist";

const logger = require("pino")({
  prettyPrint: { colorize: true },
});

const { task, username, pages, message, command, keywords, author, module } = minimist(process.argv.slice(2));
const user = userInfo().username;
const rootDir = `/Users/${user}/Documents/${username}`;
const reposDir = "./repos";
const miscRepos = ["sandbox", "utils", "resources", "e2e-boilerplate"];
const frameworks = ["cypress", "nightwatch", "playwright", "protractor", "puppeteer", "webdriverio", "wd"];
const options = {
  host: "api.github.com",
  method: "GET",
  headers: {
    "user-agent": "node.js",
    "Content-Type": "application/json",
  },
};

export {
  frameworks,
  rootDir,
  user,
  username,
  task,
  pages,
  reposDir,
  logger,
  message,
  miscRepos,
  command,
  keywords,
  author,
  module,
  options,
};
