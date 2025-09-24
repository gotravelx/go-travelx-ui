import { render, screen, waitFor } from "@testing-library/react"
import ProtectedRoute from "@/components/protected-route"
import React from "react"

// 🟢 Mock next/navigation
const pushMock = jest.fn()
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock }),
  usePathname: () => "/protected-page",
}))

// 🟢 Mock useAuth
const mockUseAuth = jest.fn()
jest.mock("@/contexts/auth-context", () => ({
  useAuth: () => mockUseAuth(),
}))

describe("ProtectedRoute", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("renders loading skeleton when loading", () => {
    mockUseAuth.mockReturnValue({ isAuthenticated: false, isLoading: true })

    render(
      <ProtectedRoute>
        <div data-testid="protected-content">Protected</div>
      </ProtectedRoute>
    )

    // Instead of looking for text, check skeletons
    expect(document.querySelectorAll(".animate-pulse").length).toBeGreaterThan(0)
    expect(screen.queryByTestId("protected-content")).toBeNull()
  })

  it("redirects to login if not authenticated", async () => {
    mockUseAuth.mockReturnValue({ isAuthenticated: false, isLoading: false })

    render(
      <ProtectedRoute>
        <div data-testid="protected-content">Protected</div>
      </ProtectedRoute>
    )

    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith("/login?redirect=%2Fprotected-page")
    })

    // Should not render children
    expect(screen.queryByTestId("protected-content")).toBeNull()
  })

  it("renders children if authenticated", () => {
    mockUseAuth.mockReturnValue({ isAuthenticated: true, isLoading: false })

    render(
      <ProtectedRoute>
        <div data-testid="protected-content">Protected</div>
      </ProtectedRoute>
    )

    expect(screen.getByTestId("protected-content")).toBeInTheDocument()
  })
})
