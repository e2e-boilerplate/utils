const { hasRepoNameList, hasRepo, hasRootDir } = require("./validators");
const { getRepNameList, getRepo, writeRootDir, clearRepList } = require("./exec");

async function checkRootDir() {
  const hasRoot = await hasRootDir();
  if (!hasRoot) {
    await writeRootDir();
  }
}

async function checkRepoNameList(shouldExist = true) {
  const hasList = await hasRepoNameList();

  if (shouldExist && !hasList) {
    await getRepNameList();
  }

  if (!shouldExist && hasList) {
    await clearRepList();
  }
}

async function checkRepo(repo) {
  const repoExist = await hasRepo(repo);
  if (!repoExist) {
    await getRepo(repo);
  }
}

module.exports = {
  checkRootDir,
  checkRepo,
  checkRepoNameList
};
