// playwright
import playwrightCommonjs from "./playwright/commonjs";

async function createGist() {
  // playwright
  await playwrightCommonjs();
}

createGist().then((r) => {});

export default createGist;
