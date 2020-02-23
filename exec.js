const util = require("util");
const exec = util.promisify(require("child_process").exec);

const logger = require("./logger");

async function execute(cmd, cwd) {
  try {
    const { error, stdout, stderr } = await exec(cmd, { cwd });
    if (error) {
      throw error;
    }
    logger.info(stdout);
    logger.info(stderr);
  } catch (error) {
    logger.error(error);
  }
}

module.exports = execute;
