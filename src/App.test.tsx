// @ts-ignore
// eslint-disable
import React from "react";
import { act, render, screen } from "@testing-library/react";
import { queryHelpers } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import App from "./App";
import * as api from "./api";

jest.mock("./api");

export const queryByTestSubj = queryHelpers.queryByAttribute.bind(
  null,
  "data-test-subj"
);
export const queryAllByTestSubj = queryHelpers.queryAllByAttribute.bind(
  null,
  "data-test-subj"
);

export function getAllByTestSubj(container, id, ...rest) {
  const els = queryAllByTestSubj(container, id, ...rest);
  if (!els.length) {
    throw queryHelpers.getElementError(
      `Unable to find an element by: [data-test-subj="${id}"]`,
      container
    );
  }
  return els;
}

export function getByTestSubj(...args) {
  const result = getAllByTestSubj(...args);
  if (result.length > 0) {
    return result[0];
  }
  return null;
}

test("renders the search box", () => {
  render(<App />);
  const searchBoxEl = screen.getByLabelText("Search for a gene");
  expect(searchBoxEl).toBeInTheDocument();
});

test("does not render the DataTable if no search term", () => {
  render(<App />);
  const dataTableEl = screen.queryByLabelText("Gene data table");
  console.log(dataTableEl);
  expect(dataTableEl).toBeNull();
});

test("renders the data table when a search term is provided", async () => {
  api.list.mockResolvedValue(["test"]);
  api.details.mockResolvedValue([{ gene: "test" }]);
  render(<App />);
  const searchBoxInputEl = getByTestSubj(document.body, "comboBoxSearchInput");
  console.log(searchBoxInputEl);
  expect(searchBoxInputEl).toBeInTheDocument();
  act(() => userEvent.type(searchBoxInputEl as HTMLElement, "test"));

  await screen.findByRole("option");
  userEvent.click(screen.getByRole("option") as HTMLElement);
  await screen.findByTestId("data-table");
});
