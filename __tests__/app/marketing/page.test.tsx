import Whitepaper from "@/app/marketing/page";
import { render, screen } from "@testing-library/react";

// 🔹 Mock WhitepaperPage
jest.mock("@/components/whitepaper-page", () => () => (
  <div data-testid="whitepaper-page">Mock WhitepaperPage</div>
));

describe("Whitepaper Page", () => {
  it("renders the WhitepaperPage component", () => {
    render(<Whitepaper />);
    expect(screen.getByTestId("whitepaper-page")).toBeInTheDocument();
  });
});
