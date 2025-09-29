import Marketing from "@/app/about/page";
import { render, screen } from "@testing-library/react";

// 🔹 Mock MarketingPage component
jest.mock("@/components/marketing-page", () => () => (
  <div data-testid="marketing-page">Mock MarketingPage</div>
));

describe("Marketing page", () => {
  it("renders the MarketingPage component", () => {
    render(<Marketing />);
    expect(screen.getByTestId("marketing-page")).toBeInTheDocument();
  });
});
