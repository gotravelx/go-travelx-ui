import { render, screen, fireEvent } from "@testing-library/react";
import { Footer } from "@/components/footer";

// ✅ Mock sonner toast
jest.mock("sonner", () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
  },
}));

import { toast } from "sonner";

describe("Footer", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("shows error when subscribing with invalid email", () => {
    render(<Footer />);

    const input = screen.getByPlaceholderText("Your email address");
    const form = input.closest("form")!; // grab the form element

    fireEvent.change(input, { target: { value: "invalid-email" } });
    fireEvent.submit(form); // ✅ submit the form instead of clicking the button

    expect(toast.error).toHaveBeenCalledWith(
      "Please enter a valid email address"
    );
  });

  it("shows success when subscribing with valid email", () => {
    render(<Footer />);

    const input = screen.getByPlaceholderText("Your email address");
    const form = input.closest("form")!;

    fireEvent.change(input, { target: { value: "test@example.com" } });
    fireEvent.submit(form);

    expect(toast.success).toHaveBeenCalledWith(
      "Thanks for subscribing to our newsletter!"
    );
  });
});
