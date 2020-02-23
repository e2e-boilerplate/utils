const user = require("os").userInfo().username;
const fs = require("fs");
const execute = require("./exec");

const root = `/Users/${user}/Documents/e2e-boilerplates`;

async function clone(repo) {
  if (!fs.existsSync(root)) {
    fs.mkdirSync(root);
  }

  await execute(`git clone git@github.com:e2e-boilerplates/${repo.name}.git`, root);
}

async function install(repo) {
  await install(`npm install`, `${root}/${repo.name}`);
}

async function pull(repo) {
  await pull(`git pull`, `${root}/${repo.name}`);
}

module.exports = {
  clone,
  install,
  pull
};
