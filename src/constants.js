import { userInfo } from "os";
import minimist from "minimist";

const { task, username, pages, message, command, keywords, author } = minimist(process.argv.slice(2));
const user = userInfo().username;
const rootDir = `/Users/${user}/Documents/${username}`;
const reposDir = "./repos";
const logger = require("pino")({
  prettyPrint: { colorize: true }
});

export { rootDir, user, username, task, pages, reposDir, logger, message, command, keywords, author };
