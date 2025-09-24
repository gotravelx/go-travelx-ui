import { render, screen, fireEvent, within } from "@testing-library/react"
import { MainNav } from "@/components/main-nav"

// Mock auth context
jest.mock("@/contexts/auth-context", () => ({
  useAuth: () => ({
    user: { name: "John Doe", username: "jdoe" },
    isAuthenticated: true,
    logout: jest.fn(),
  }),
}))

describe("MainNav - mobile menu", () => {
  it("toggles mobile menu", () => {
    render(<MainNav />)

    const toggleButton = screen.getByRole("button", { name: /toggle mobile menu/i })

    // Initially closed
    expect(screen.queryByRole("navigation", { name: /mobile menu/i })).not.toBeInTheDocument()

    // Open menu
    fireEvent.click(toggleButton)
    const mobileMenu = screen.getByRole("navigation", { name: /mobile menu/i })

    // ✅ Scope the query to the mobile menu only
    expect(within(mobileMenu).getByText("Home")).toBeInTheDocument()

    // Close menu
    fireEvent.click(toggleButton)
    expect(screen.queryByRole("navigation", { name: /mobile menu/i })).not.toBeInTheDocument()
  })
})
