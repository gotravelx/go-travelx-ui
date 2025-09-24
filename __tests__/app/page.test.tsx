import Home from "@/app/page";
import { render, screen } from "@testing-library/react";

// Mock the LandingPage component so we don’t depend on its implementation
jest.mock("@/components/landing-page", () => () => (
  <div data-testid="landing-page">Landing Page Mock</div>
));

describe("Home Page", () => {
  it("renders the LandingPage component", () => {
    render(<Home />);
    expect(screen.getByTestId("landing-page")).toBeInTheDocument();
  });
});
    