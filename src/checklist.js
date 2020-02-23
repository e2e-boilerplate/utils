const { hasRepositoriesList, hasRepository, hasRootDir, isNumeric } = require("./validators");
const { getRepository, getRepositoriesList, setRootDir, clearRepositoriesList } = require("./exec");

async function checkRootDir() {
  const hasRoot = await hasRootDir();
  if (!hasRoot) {
    await setRootDir();
  }
}

async function checkRepositoriesList(listShouldExist = true) {
  const hasRepoList = await hasRepositoriesList();

  if (listShouldExist && !hasRepoList) {
    await getRepositoriesList();
  }

  if (!listShouldExist && hasRepoList) {
    await clearRepositoriesList();
  }
}

async function checkRepository(repo) {
  const hasRepo = await hasRepository(repo);
  if (!hasRepo) {
    await getRepository(repo);
  }
}

function checkIsNumeric(value) {
  return isNumeric(value);
}

module.exports = {
  checkRootDir,
  checkRepository,
  checkRepositoriesList,
  checkIsNumeric
};
