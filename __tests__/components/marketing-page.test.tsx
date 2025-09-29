import MarketingPage from "@/components/marketing-page";
import { render, screen, fireEvent } from "@testing-library/react";

// Mock Footer (to isolate MarketingPage)
jest.mock("@/components/footer", () => ({
  Footer: () => <div data-testid="mock-footer">Mock Footer</div>,
}));

describe("MarketingPage", () => {
  it("renders the hero section with heading and CTA buttons", () => {
    render(<MarketingPage />);

    // Hero heading
    expect(
      screen.getByRole("heading", {
        name: /Revolutionizing Flight Information with Blockchain/i,
      }),
    ).toBeInTheDocument();

    // Buttons
    expect(
      screen.getAllByRole("button", { name: /Try Flight Tracking/i })[0],
    ).toBeInTheDocument();
    expect(
      screen.getAllByRole("button", { name: /Read Whitepaper/i })[0],
    ).toBeInTheDocument();
  });

  it("renders the About section with tabs and switches between them", () => {
    render(<MarketingPage />);
  
    // Tabs are visible
    const platformTab = screen.getByRole("tab", { name: /The Platform/i });
    const techTab = screen.getByRole("tab", { name: /Technology/i });
    const teamTab = screen.getByRole("tab", { name: /Our Team/i });
  
    expect(platformTab).toBeInTheDocument();
    expect(techTab).toBeInTheDocument();
    expect(teamTab).toBeInTheDocument();
  
    // Default tab content
    expect(
      screen.getByRole("heading", { name: /Flight Information Oracle/i })
    ).toBeInTheDocument();
  
  });
  

  it("renders CTA section with heading", () => {
    render(<MarketingPage />);

    expect(
      screen.getByRole("heading", { name: /Experience GoTravelX Today/i }),
    ).toBeInTheDocument();
  });

  it("renders Footer", () => {
    render(<MarketingPage />);
    expect(screen.getByTestId("mock-footer")).toBeInTheDocument();
  });
});
