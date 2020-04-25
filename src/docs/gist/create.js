import { createGist } from "./common";
import combs from "./combs";

function create() {
  let body = {};
  combs.forEach((fileName) => {
    body = {
      description: `${fileName}.md`,
      public: true,
      files: {},
    };

    body.files[`${fileName}.md`] = {
      content: "...",
    };

    createGist(body, `${fileName}.md`);
  });
}

export default create;
