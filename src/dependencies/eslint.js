import * as deps from "./dependencies.json";

export default function eslint(name) {
  const parts = name.split("-");
  const dependencies = {};
  const devDependencies = {
    eslint: deps.eslint,
  };

  devDependencies["eslint-config-airbnb-base"] = deps["eslint-config-airbnb-base"];
  devDependencies["eslint-config-prettier"] = deps["eslint-config-prettier"];
  devDependencies["eslint-plugin-import"] = deps["eslint-plugin-import"];
  devDependencies["eslint-plugin-prettier"] = deps["eslint-plugin-prettier"];
  devDependencies["pretty-quick"] = deps["pretty-quick"];
  if (parts.includes("cucumber")) {
    devDependencies["eslint-plugin-cucumber"] = deps["eslint-plugin-cucumber"];
  }

  if (parts.includes("webdriverio")) {
    devDependencies["eslint-plugin-wdio"] = deps["eslint-plugin-wdio"];
  }

  if (parts.includes("testcafe")) {
    devDependencies["eslint-plugin-testcafe"] = deps["eslint-plugin-testcafe"];
  }

  if (parts.includes("cypress")) {
    devDependencies["eslint-plugin-cypress"] = deps["eslint-plugin-cypress"];
  }

  return { dependencies, devDependencies };
}
