/* eslint no-unused-vars: 0 */
import https from "https";
import fs from "fs";
import { hasRepositoriesList, isNumeric } from "../src/validators";
import getRepositories from "../src/repositories";
import { clearRepositoriesList } from "../src/exec";
import { username, pages, logger } from "../src/constants";

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

describe("repositories", () => {
  beforeEach(() => {
    hasRepositoriesList.mockClear();
    isNumeric.mockClear();
  });

  it("it should clear repositories list before creating new", () => {
    // TODO
  });
});
