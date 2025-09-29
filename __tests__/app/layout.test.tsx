// __tests__/app/layout.test.tsx
import { render, screen } from "@testing-library/react";
import RootLayout from "@/app/layout";

// Mock child components
jest.mock("@/components/main-nav", () => ({
  MainNav: () => <nav data-testid="main-nav">MainNav</nav>,
}));

jest.mock("sonner", () => ({
  Toaster: ({ position }: { position: string }) => (
    <div data-testid="toaster">Toaster {position}</div>
  ),
}));

jest.mock("@/contexts/auth-context", () => ({
  AuthProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="auth-provider">{children}</div>
  ),
}));

jest.mock("@/components/theme-provider", () => ({
  ThemeProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="theme-provider">{children}</div>
  ),
}));

describe("RootLayout", () => {
  it("renders providers and children", () => {
    const { container } = render(
      <RootLayout>
        <div data-testid="page-content">Page Content</div>
      </RootLayout>
    );

    // Check mocked providers/components
    expect(screen.getByTestId("auth-provider")).toBeInTheDocument();
    expect(screen.getByTestId("theme-provider")).toBeInTheDocument();
    expect(screen.getByTestId("main-nav")).toBeInTheDocument();
    expect(screen.getByTestId("toaster")).toBeInTheDocument();

    // Children should be rendered
    expect(screen.getByTestId("page-content")).toBeInTheDocument();

    // (Optional) snapshot to ensure structure
    expect(container).toMatchSnapshot();
  });
});
