import * as deps from "./dependencies.json";

export default function babel(name) {
  const parts = name.split("-");
  const dependencies = {};
  const devDependencies = {};

  devDependencies["@babel/register"] = deps["@babel/register"];
  devDependencies["@babel/cli"] = deps["@babel/cli"];
  devDependencies["@babel/core"] = deps["@babel/core"];
  devDependencies["@babel/plugin-transform-runtime"] = deps["@babel/plugin-transform-runtime"];
  devDependencies["@babel/preset-env"] = deps["@babel/preset-env"];
  devDependencies["@babel/runtime"] = deps["@babel/runtime"];

  if (parts.includes("jest")) {
    devDependencies["babel-jest"] = deps["babel-jest"];
  }

  if (parts.includes("ava")) {
    devDependencies["@ava/babel"] = deps["@ava/babel"];
  }

  return { dependencies, devDependencies };
}
