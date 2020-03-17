import { userInfo } from "os";
import minimist from "minimist";

const { task, username, pages, message, command, keywords, author, module } = minimist(process.argv.slice(2));
const user = userInfo().username;
const rootDir = `/Users/${user}/Documents/${username}`;
const reposDir = "./repos";
const miscRepos = ["sandbox", "utils", "resources"];
const frameworks = ["cypress", "nightwatch", "playwright", "protractor", "puppeteer", "webdriverio", "wd"];
const logger = require("pino")({
  prettyPrint: { colorize: true }
});

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
  module
};
