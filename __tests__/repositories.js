/* eslint no-unused-vars: 0 */
import { hasRepositoriesList, isNumeric } from "../src/validators";
import { getRepositories } from "../src/repositories";
import { clearRepositoriesList } from "../src/exec";
import { username, pages, logger } from "../src/constants";

const fs = require("fs");
const https = require("https");

describe("repositories", () => {
  beforeEach(() => {
    jest.resetModules();
  });

  it("it should clear repositories list before creating new", () => {
    jest.mock("fs");
    jest.mock("https", () => ({
      __esModule: true,
      request: jest.fn(() => ({ end: jest.fn() }))
    }));
    jest.mock("../src/constants", () => ({
      __esModule: true,
      username: "xgirma",
      pages: "1",
      logger: jest.fn(() => {})
    }));
    jest.mock("../src/validators", () => ({
      __esModule: true,
      hasRepositoriesList: jest.fn(() => true),
      isNumeric: jest.fn(() => true)
    }));
    jest.mock("../src/exec", () => ({
      __esModule: true,
      clearRepositoriesList: jest.fn(() => {})
    }));

    // TODO
  });
});
