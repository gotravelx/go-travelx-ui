import { render, screen } from "@testing-library/react";
import FlifoPage from "@/app/flifo/page";

// 🔹 Mock ProtectedRoute
jest.mock("@/components/protected-route", () => ({ children }: any) => (
  <div data-testid="protected-route">{children}</div>
));

// 🔹 Mock FlightSearch
jest.mock("@/components/flight-search", () => () => (
  <div data-testid="flight-search">Mock FlightSearch</div>
));

describe("FlifoPage", () => {
  it("renders inside ProtectedRoute and shows FlightSearch", () => {
    render(<FlifoPage />);

    // Check ProtectedRoute wrapper
    expect(screen.getByTestId("protected-route")).toBeInTheDocument();

    // Check FlightSearch inside it
    expect(screen.getByTestId("flight-search")).toBeInTheDocument();
  });
});
