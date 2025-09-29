import React from "react"
import { render, screen, fireEvent } from "@testing-library/react"
import { showCustomToast, CustomToastComponent } from "@/components/custom-toast"
import { toast } from "sonner"

// Mock sonner's toast
jest.mock("sonner", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    info: jest.fn(),
    dismiss: jest.fn(),
  },
}))

describe("showCustomToast", () => {
  it("calls toast.success when type is success", () => {
    showCustomToast({ title: "Success!", description: "It worked", type: "success" })
    expect(toast.success).toHaveBeenCalled()
  })

  it("calls toast.error when type is error", () => {
    showCustomToast({ title: "Error!", description: "It failed", type: "error" })
    expect(toast.error).toHaveBeenCalled()
  })

  it("calls toast.info when type is info (default)", () => {
    showCustomToast({ title: "Info!", description: "Heads up" })
    expect(toast.info).toHaveBeenCalled()
  })
})

describe("CustomToastComponent", () => {
  const baseToast = {
    id: "123",
    title: "Test Toast",
    description: "Some description",
    type: "success" as const,
  }

  it("renders title and description", () => {
    render(<CustomToastComponent toast={{ ...baseToast, dismiss: jest.fn() }} />)
    expect(screen.getByText("Test Toast")).toBeInTheDocument()
    expect(screen.getByText("Some description")).toBeInTheDocument()
  })

  it("renders correct icon for success", () => {
    render(<CustomToastComponent toast={{ ...baseToast, dismiss: jest.fn() }} />)
    // fallback: check for SVG via class (lucide-react does not add role="img")
    expect(document.querySelector("svg.lucide-circle-check-big")).toBeInTheDocument()
  })

  it("calls toast.dismiss when close button is clicked", () => {
    const mockToast = {
      ...baseToast,
      dismiss: jest.fn((id: string) => toast.dismiss(id)), // bridge to sonner mock
    }

    render(<CustomToastComponent toast={mockToast} />)
    fireEvent.click(screen.getByTitle("Close"))
    expect(toast.dismiss).toHaveBeenCalledWith("123")
  })
})
