import * as deps from "./dependencies.json";

export default function cypress(name) {
  const parts = name.split("-");
  const dependencies = {
    cypress: deps.cypress,
    rimraf: deps.rimraf, // to clear video/screen-shoots
  };
  const devDependencies = {};

  if (parts.includes("browserify")) {
    devDependencies["@cypress/browserify-preprocessor"] = deps["@cypress/browserify-preprocessor"];
  }

  if (parts.includes("webpack")) {
    dependencies.webpack = deps.webpack;
    dependencies["@cypress/webpack-preprocessor"] = deps["@cypress/webpack-preprocessor"];
    devDependencies["webpack-cli"] = deps["webpack-cli"];
  }

  // cypress uses cypress-jest-adapter instead of jest
  if (parts.includes("jest")) {
    dependencies["cypress-jest-adapter"] = deps["cypress-jest-adapter"];
  }

  if (parts.includes("cucumber")) {
    dependencies["cypress-cucumber-preprocessor"] = deps["cypress-cucumber-preprocessor"];
  }

  return { dependencies, devDependencies };
}
