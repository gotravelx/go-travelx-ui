import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import FlightSearch from "@/components/flight-search"
import { flightService } from "@/services/api"
import type { FlightData } from "@/types/flight"

jest.mock("@/services/api", () => ({
  flightService: {
    searchFlight: jest.fn(),
    getSubscribedFlights: jest.fn(),
  },
}))

// Mock child components (so we don’t test their internals here)
jest.mock("@/components/view-flight", () => ({
    __esModule: true,
    default: (props: any) => (
      <div data-testid="mock-view-flight">
        Mock ViewFlight
        <button
          data-testid="trigger-view-search"
          onClick={() => props?.onSearch && props.onSearch()}
        >
          Trigger View Search
        </button>
      </div>
    ),
  }))
  

  jest.mock("@/components/subscribe-flight", () => ({
    __esModule: true,
    default: () => <div data-testid="mock-subscribe-flight">Mock SubscribeFlight</div>,
  }));
  

jest.mock("@/components/unsubscribe-flight-client", () => ({
  __esModule: true,
  default: () => <div data-testid="mock-unsubscribe">Mock Unsubscribe</div>,
}))

jest.mock("@/components/subscribe-card", () => ({
  __esModule: true,
  default: ({ flightData }: { flightData: FlightData }) => (
    <div data-testid="mock-subscribe-card">{flightData.flightNumber}</div>
  ),
}))

jest.mock("@/components/footer", () => ({
  __esModule: true,
  Footer: () => <div data-testid="mock-footer">Mock Footer</div>,
}))

const mockFlight: FlightData = {
  flightNumber: "1234",
  carrierCode: "UA",
  departureAirport: "SFO",
  arrivalAirport: "LAX",
  scheduledDepartureDate: "2025-09-23",
} as FlightData

describe("FlightSearch", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("renders default tab (View Flight Subscription)", () => {
    render(<FlightSearch />)
    expect(screen.getByText(/view flight subscription/i)).toBeInTheDocument()
    expect(screen.getByTestId("mock-view-flight")).toBeInTheDocument()
  })
  
//   it("switches to Subscribe tab and resets state", async () => {
//     render(<FlightSearch />);
  
//     fireEvent.click(screen.getByText(/add flight subscription/i));
  
//     const subscribePanel = await screen.findByTestId("mock-subscribe-flight");
//     expect(subscribePanel).toBeInTheDocument();
//   });
  
  
//   it("switches to Unsubscribe tab", async () => {
//     render(<FlightSearch />);
  
//     fireEvent.click(screen.getByText(/remove flight subscription/i));
  
//     // Wait for Radix to mount and show the panel
//     const unsubscribePanel = await screen.findByTestId("mock-unsubscribe");
//     expect(unsubscribePanel).toBeInTheDocument();
//   });
  

//   it("calls flightService.searchFlight when Subscribe Search is triggered", async () => {
//     ;(flightService.searchFlight as jest.Mock).mockResolvedValue(mockFlight)

//     render(<FlightSearch />)
//     fireEvent.click(screen.getByText(/add flight subscription/i))

//     fireEvent.click(screen.getByText("Trigger Subscribe Search"))

//     await waitFor(() => {
//       expect(flightService.searchFlight).toHaveBeenCalled()
//     })
//   })

//   it("renders SubscribeFlightCard after successful search", async () => {
//     ;(flightService.searchFlight as jest.Mock).mockResolvedValue(mockFlight)

//     render(<FlightSearch />)
//     fireEvent.click(screen.getByText(/add flight subscription/i))

//     fireEvent.click(screen.getByText("Trigger Subscribe Search"))

//     expect(await screen.findByTestId("mock-subscribe-card")).toHaveTextContent(
//       "1234"
//     )
//   })

//   it("calls flightService.getSubscribedFlights when View Search is triggered", async () => {
//     ;(flightService.getSubscribedFlights as jest.Mock).mockResolvedValue([
//       mockFlight,
//     ])

//     render(<FlightSearch />)
//     fireEvent.click(screen.getByTestId("trigger-view-search"))

// await waitFor(() => {
//   expect(flightService.getSubscribedFlights).toHaveBeenCalled()
// })

//   })

  it("always shows footer", () => {
    render(<FlightSearch />)
    expect(screen.getByTestId("mock-footer")).toBeInTheDocument()
  })
})
