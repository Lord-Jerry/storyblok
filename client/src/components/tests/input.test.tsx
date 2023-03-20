import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Input from "../input";

describe("Input component", () => {
  const defaultProps = {
    type: "text",
    name: "test-input",
    value: "",
    placeholder: "Test input",
    onChange: jest.fn(),
  };

  it("renders correctly", () => {
    const { asFragment } = render(<Input {...defaultProps} />);
    expect(asFragment()).toMatchSnapshot();
  });

  it("renders with provided props", () => {
    render(<Input {...defaultProps} />);

    const inputElement = screen.getByPlaceholderText(
      defaultProps.placeholder
    ) as HTMLInputElement;
    expect(inputElement).toBeInTheDocument();
    expect(inputElement.type).toBe(defaultProps.type);
    expect(inputElement.name).toBe(defaultProps.name);
    expect(inputElement.value).toBe(defaultProps.value);
  });

  it("handles onChange event", async () => {
    const user = userEvent.setup();
    render(<Input {...defaultProps} />);

    const inputElement = screen.getByPlaceholderText(defaultProps.placeholder);
    await user.type(inputElement, "Hello, World!");

    await waitFor(() => {
      expect(defaultProps.onChange).toHaveBeenCalledTimes(13);
    });
  });
});
