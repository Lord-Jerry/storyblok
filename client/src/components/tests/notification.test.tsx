import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import Notification from "../notification";

const defaultProps = {
  show: true,
  isError: false,
  message: "Test message",
  handleClose: jest.fn(),
};

describe("Notification component", () => {
  test("renders success notification", () => {
    render(<Notification {...defaultProps} />);

    const notification = screen.getByText(defaultProps.message);
    expect(notification).toBeInTheDocument();
    expect(screen.getByRole("success-circle", { hidden: true })).toHaveClass("text-green-400");
  });

  test("renders error notification", () => {
    const errorProps = { ...defaultProps, isError: true };
    render(<Notification {...errorProps} />);

    const notification = screen.getByText("Error: " + defaultProps.message);
    expect(notification).toBeInTheDocument();
    expect(screen.getByRole("error-circle", { hidden: true })).toHaveClass("text-red-400");
  });

  test("closes notification on button click", () => {
    render(<Notification {...defaultProps} />);
    const closeButton = screen.getByRole("button", { name: "Close" });

    fireEvent.click(closeButton);
    expect(defaultProps.handleClose).toHaveBeenCalled();
  });

  test("doesn't render notification when show is false", () => {
    const hiddenProps = { ...defaultProps, show: false };
    const { container } = render(<Notification {...hiddenProps} />);

    expect(container.querySelector(".opacity-100")).toBeNull();
  });
});
