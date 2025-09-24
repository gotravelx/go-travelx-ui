import LoginPage from "@/app/login/page";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";

// 🔹 Mock next/navigation
const pushMock = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock }),
  useSearchParams: () => new URLSearchParams(""),
}));

// 🔹 Mock useAuth
const loginMock = jest.fn();
let isAuthenticated = false;

jest.mock("@/contexts/auth-context", () => ({
  useAuth: () => ({
    login: loginMock,
    isAuthenticated,
  }),
}));

describe("LoginPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    isAuthenticated = false;
  });

  it("renders login form", () => {
    render(<LoginPage />);

    expect(screen.getByText(/Welcome to GoTravelX/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /sign in/i })).toBeInTheDocument();
  });

  it("calls login on form submit with credentials", async () => {
    render(<LoginPage />);

    fireEvent.change(screen.getByLabelText(/Username/i), {
      target: { value: "testuser" },
    });
    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() =>
      expect(loginMock).toHaveBeenCalledWith("testuser", "password123")
    );
  });

  it("shows error message when login fails", async () => {
    loginMock.mockRejectedValueOnce(new Error("Invalid credentials"));

    render(<LoginPage />);

    fireEvent.change(screen.getByLabelText(/Username/i), {
      target: { value: "wrong" },
    });
    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: { value: "bad" },
    });

    fireEvent.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() =>
      expect(
        screen.getByText(/Invalid username or password/i)
      ).toBeInTheDocument()
    );
  });

  it("redirects if already authenticated", () => {
    isAuthenticated = true;
    render(<LoginPage />);
    expect(pushMock).toHaveBeenCalledWith("/");
  });

  it("navigates back to home when Back To Home button clicked", () => {
    render(<LoginPage />);
    fireEvent.click(screen.getByRole("button", { name: /Back To Home/i }));
    expect(pushMock).toHaveBeenCalledWith("/");
  });
});
