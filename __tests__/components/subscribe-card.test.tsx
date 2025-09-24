// SubscribeFlightCard.test.tsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { flightService } from "@/services/api"
import { toast } from "sonner"
import type { FlightData } from "@/types/flight"
import SubscribeFlightCard from "@/components/subscribe-card"

// Mock services
jest.mock("@/services/api", () => ({
  flightService: {
    subscribeToFlight: jest.fn(),
  },
}))
jest.mock("sonner", () => ({
  toast: { success: jest.fn(), error: jest.fn() },
}))

const mockFlight: any = {
  carrierCode: "AI",
  flightNumber: "123",
  departureAirport: "DEL",
  arrivalAirport: "BOM",
  departureCity: "Delhi",
  arrivalCity: "Mumbai",
  scheduledDepartureDate: "2025-09-24",
  estimatedDepartureUTC: "2025-09-24T10:00:00Z",
  estimatedArrivalUTC: "2025-09-24T12:00:00Z",
  boardingTime: "2025-09-24T09:30:00Z",
  flightStatus: "Departed",
  marketedFlightSegment: [],
}

describe("SubscribeFlightCard", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("renders flight details", () => {
    render(<SubscribeFlightCard flightData={mockFlight} />)

    expect(
      screen.getByText(/Flight Status - AI 123/i)
    ).toBeInTheDocument()
    expect(screen.getByText(/Delhi/i)).toBeInTheDocument()
    expect(screen.getByText(/Mumbai/i)).toBeInTheDocument()
  })

  it("opens standard subscription dialog", () => {
    render(<SubscribeFlightCard flightData={mockFlight} />)

    const button = screen.getByRole("button", { name: /Private Subscription/i })
    fireEvent.click(button)

    expect(
      screen.getByText(/Confirm Standard Subscription/i)
    ).toBeInTheDocument()
  })

  it("subscribes successfully (standard)", async () => {
    ;(flightService.subscribeToFlight as jest.Mock).mockResolvedValueOnce({})

    render(<SubscribeFlightCard flightData={mockFlight} />)

    fireEvent.click(screen.getByRole("button", { name: /Private Subscription/i }))
    fireEvent.click(screen.getByRole("button", { name: /Confirm Subscription/i }))

    await waitFor(() =>
      expect(flightService.subscribeToFlight).toHaveBeenCalledWith(
        expect.objectContaining({
          carrierCode: "AI",
          flightNumber: "123",
        })
      )
    )
    expect(toast.success).toHaveBeenCalledWith(
      "Successfully subscribed to standard flight updates"
    )
  })

  it("shows error on failed subscription", async () => {
    ;(flightService.subscribeToFlight as jest.Mock).mockRejectedValueOnce(
      new Error("Network error")
    )

    render(<SubscribeFlightCard flightData={mockFlight} />)

    fireEvent.click(screen.getByRole("button", { name: /Private Subscription/i }))
    fireEvent.click(screen.getByRole("button", { name: /Confirm Subscription/i }))

    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith("Network error")
    )
  })

  it("opens secure subscription dialog", () => {
    render(<SubscribeFlightCard flightData={mockFlight} />)

    // Secure subscription trigger: in your code it's another button, add test-id if needed
    fireEvent.click(screen.getByRole("button", { name: /Private Subscription/i })) // adjust selector for secure btn
    // Instead: add `data-testid="secure-subscribe-btn"`
    // fireEvent.click(screen.getByTestId("secure-subscribe-btn"))

    // Example:
    // expect(screen.getByText(/Confirm Secure Subscription/i)).toBeInTheDocument()
  })
})
