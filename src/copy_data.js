import { copyFile } from "fs";
import { logger } from "./common/constants";

function copyData() {
  try {
    copyFile("./src/dependencies/dependencies.json", "./api/v1/dependencies.json", (err) => {
      if (err) throw err;
    });
  } catch (error) {
    logger.error(`${__filename}: Copy data, ${error}`);
  }
}

export default copyData;
