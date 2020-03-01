const user = require("os").userInfo().username;
const { task, username, pages, message, command, keywords, author } = require("minimist")(process.argv.slice(2));

const rootDir = `/Users/${user}/Documents/${username}`;
const reposDir = "./repos";

const logger = require("pino")({
  prettyPrint: { colorize: true }
});

module.exports = {
  rootDir,
  user,
  username,
  task,
  pages,
  reposDir,
  logger,
  message,
  command,
  keywords,
  author
};
