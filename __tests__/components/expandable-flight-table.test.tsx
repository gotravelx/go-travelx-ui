// ExpandableFlightTable.test.tsx
import { render, screen, fireEvent, waitForElementToBeRemoved } from "@testing-library/react"
import type { FlightData } from "@/types/flight"
import ExpandableFlightTable from "@/components/expandable-flight-table"

const mockFlights: FlightData[] = [
  {
    flightNumber: "123",
    scheduledDepartureDate: "2025-09-21",
    carrierCode: "AA",
    operatingAirline: "American Airlines",
    estimatedArrivalUTC: "2025-09-21T14:30:00Z",
    estimatedDepartureUTC: "2025-09-21T10:30:00Z",
    arrivalAirport: "LAX",
    departureAirport: "JFK",
    arrivalCity: "Los Angeles",
    departureCity: "New York",
    departureGate: "22",
    arrivalGate: "15",
    statusCode: "ndpt",
    flightStatus: "Scheduled",
    equipmentModel: "Boeing 737",
    actualDepartureUTC: "2025-09-21T10:35:00Z",
    actualArrivalUTC: "2025-09-21T14:35:00Z",
    isCanceled: false,
    scheduledArrivalUTCDateTime: "2025-09-21T14:00:00Z",
    scheduledDepartureUTCDateTime: "2025-09-21T10:00:00Z",
    isSubscribed: false,
    departureTerminal: "4",
    arrivalTerminal: "B",
    departureDelayMinutes: 30,
    arrivalDelayMinutes: 30,
    boardingTime: "2025-09-21T09:30:00Z",
    baggageClaim: "C5",
  },
]

describe("ExpandableFlightTable", () => {
  it("renders loading state", () => {
    render(<ExpandableFlightTable isLoading />)
    expect(screen.getByRole("status")).toBeInTheDocument()
  })

  it("renders flights", () => {
    render(<ExpandableFlightTable flights={mockFlights} />)
    expect(screen.getByText("AA 123")).toBeInTheDocument()
    expect(screen.getByText("JFK")).toBeInTheDocument()
    expect(screen.getByText("LAX")).toBeInTheDocument()
  })

  it("expands and collapses a row", async () => {
    render(<ExpandableFlightTable flights={mockFlights} />)
    const row = screen.getByText("AA 123").closest("tr")!

    // Expand row
    fireEvent.click(row)
    expect(await screen.findByText("Flight Details")).toBeInTheDocument()

    // Collapse row
    fireEvent.click(row)
    await waitForElementToBeRemoved(() => screen.queryByText("Flight Details"))
  })

  it("shows canceled status correctly", () => {
    const canceledFlight: FlightData = {
      ...mockFlights[0],
      isCanceled: true,
      statusCode: "ndpt",
      departureDelayMinutes: 0,
    }

    render(<ExpandableFlightTable flights={[canceledFlight]} />)
    expect(screen.getByText("Canceled")).toBeInTheDocument()
  })
})
