// __tests__/components/flight-updates-view.test.tsx
import { render, screen } from "@testing-library/react"
import type { FlightUpdates } from "@/types/flight"
import { FlightUpdatesView } from "@/components/flight-updates"

const mockUpdates: FlightUpdates = {
  flightNumber: "GTX123",
  updates: [
    {
      field: "Gate",
      newValue: "B12",
      timestamp: 1695472496000, 
    },
    {
      field: "Status",
      newValue: "Boarding",
      timestamp: 1695474000000,
    },
  ],
}

describe("FlightUpdatesView", () => {
  it("renders nothing when no updates are provided", () => {
    const { container } = render(
      <FlightUpdatesView updates={{ flightNumber: "GTX123", updates: [] }} />
    )
    expect(container).toBeEmptyDOMElement()
  })

  it("renders the Flight Updates card with updates", () => {
    render(<FlightUpdatesView updates={mockUpdates} />)

    // Card title
    expect(screen.getByText("Flight Updates")).toBeInTheDocument()

    // Fields
    expect(screen.getByText("Gate")).toBeInTheDocument()
    expect(screen.getByText("Status")).toBeInTheDocument()

    // Updated values
    expect(screen.getByText(/Updated to: B12/i)).toBeInTheDocument()
    expect(screen.getByText(/Updated to: Boarding/i)).toBeInTheDocument()

    // Timestamps (formatted via toLocaleTimeString in component)
    const timeRegex = /\d{1,2}:\d{2}(:\d{2})?/ // loose match, accounts for env differences
    const timestampBadges = screen.getAllByText(timeRegex)
    expect(timestampBadges.length).toBeGreaterThanOrEqual(2)
  })

  it("handles undefined or null updates gracefully", () => {
    const { container, rerender } = render(
      <FlightUpdatesView updates={{ flightNumber: "GTX123", updates: [] }} />
    )
    expect(container).toBeEmptyDOMElement()

    rerender(
          // @ts-expect-error simulating runtime null
      <FlightUpdatesView updates={null} />
    )
    expect(container).toBeEmptyDOMElement()

    rerender(
              // @ts-expect-error simulating runtime undefined

      <FlightUpdatesView updates={undefined} />
    )
    expect(container).toBeEmptyDOMElement()
  })
})
