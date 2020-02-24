const user = require("os").userInfo().username;
const { task, username, pages } = require("minimist")(process.argv.slice(2));

const rootDir = `/Users/${user}/Documents/${username}`;
const reposDir = "./repos";

module.exports = {
  rootDir,
  user,
  username,
  task,
  pages,
  reposDir
};
