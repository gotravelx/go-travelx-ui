import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import ViewFlightDatTable from "@/components/view-flight-data-table"
import { FlightData } from "@/types/flight"

// Mock data
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

describe("ViewFlightDatTable", () => {
 
  it("renders 'No flights found' when no data", () => {
    render(<ViewFlightDatTable flights={[]} totalItems={0} />)
    expect(screen.getByText(/No flights found/i)).toBeInTheDocument()
  })

  it("renders flights in the table", () => {
    render(<ViewFlightDatTable flights={mockFlights} totalItems={1} />)
    expect(screen.getByTestId("flight-table")).toBeInTheDocument()
    expect(screen.getByText(/AA 123/i)).toBeInTheDocument()
  })

  it("opens and closes the details dialog", async () => {
    render(<ViewFlightDatTable flights={mockFlights} totalItems={1} />)

    fireEvent.click(screen.getByText(/Details/i))
    expect(screen.getByText(/Flight AA 123 Status/i)).toBeInTheDocument()

    fireEvent.keyDown(document, { key: "Escape" })
    await waitFor(() =>
      expect(screen.queryByText(/Flight AA 123 Status/i)).not.toBeInTheDocument()
    )
  })


  it("handles pagination controls", () => {
    const handlePageChange = jest.fn()

    render(
      <ViewFlightDatTable
        flights={mockFlights}
        totalItems={10}
        itemsPerPage={5}
        currentPage={1}
        onPageChange={handlePageChange}
      />
    )

    fireEvent.click(screen.getByText("»")) // last page button
    expect(handlePageChange).toHaveBeenCalled()
  })
})
