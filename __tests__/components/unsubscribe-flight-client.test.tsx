import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import UnsubscribeFlightClient from "@/components/unsubscribe-flight-client";
import { flightService } from "@/services/api";

// Mock toast since it just shows notifications
jest.mock("sonner", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    info: jest.fn(),
  },
}));

// Mock child table so we don’t need to test its internals
jest.mock("@/components/unsubscribe-flight-data-table", () => ({
    __esModule: true,
    default: ({ subscriptions, onSelectionChange }: any) => {
      return (
        <div data-testid="mock-table">
          {subscriptions.map((s: any) => (
            <div key={s.subscription._id}>
              <span>{s.flight.flightNumber}</span>
              <button
                onClick={() =>
                  onSelectionChange([{ subscription: s.subscription, flight: s.flight }])
                }
              >
                Select {s.flight.flightNumber}
              </button>
            </div>
          ))}
        </div>
      );
    },
  }));

  jest.mock("@/services/api", () => ({
    flightService: {
      getSubscribedFlightsDetails: jest.fn(),
      unsubscribeFlights: jest.fn(),
    },
  }));
  
  

describe("UnsubscribeFlightClient", () => {
  const mockSubscriptions = [
    {
      subscription: {
        _id: "sub1",
        flightNumber: "1234",
        departureAirport: "DEL",
      },
      flight: {
        flightNumber: "1234",
        carrierCode: "UA",
        departureAirport: "DEL",
        arrivalAirport: "SFO",
        scheduledDepartureDate: "2025-09-24",
      },
    },
    {
      subscription: {
        _id: "sub2",
        flightNumber: "5678",
        departureAirport: "BOM",
      },
      flight: {
        flightNumber: "5678",
        carrierCode: "UA",
        departureAirport: "BOM",
        arrivalAirport: "NYC",
        scheduledDepartureDate: "2025-09-25",
      },
    },
  ];

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("renders loading state then subscription list", async () => {
    (flightService.getSubscribedFlightsDetails as jest.Mock) = jest
      .fn()
      .mockResolvedValue(mockSubscriptions);

    render(<UnsubscribeFlightClient />);

    expect(
      screen.getByText(/Loading subscriptions.../i)
    ).toBeInTheDocument();

    // Wait for data to load
    await waitFor(() =>
      expect(screen.getByTestId("mock-table")).toBeInTheDocument()
    );

    expect(screen.getByText("1234")).toBeInTheDocument();
    expect(screen.getByText("5678")).toBeInTheDocument();
  });

  it("renders empty state if no subscriptions", async () => {
    (flightService.getSubscribedFlightsDetails as jest.Mock) = jest
      .fn()
      .mockResolvedValue([]);

    render(<UnsubscribeFlightClient />);

    await waitFor(() =>
      expect(
        screen.getByText(/You don't have any flight subscriptions yet/i)
      ).toBeInTheDocument()
    );
  });

  it("validates flight number input", async () => {
    (flightService.getSubscribedFlightsDetails as jest.Mock) = jest
      .fn()
      .mockResolvedValue(mockSubscriptions);

    render(<UnsubscribeFlightClient />);

    await waitFor(() => screen.getByTestId("mock-table"));

    const flightInput = screen.getByPlaceholderText(/Enter Flight Number/i);
    fireEvent.change(flightInput, { target: { value: "12" } });

    fireEvent.click(screen.getByText(/Search/i));

    expect(
      await screen.findByText(/Flight number must be 4 digits/i)
    ).toBeInTheDocument();
  });

//   it("opens unsubscribe confirmation dialog after selecting a flight", async () => {
//     (flightService.getSubscribedFlightsDetails as jest.Mock).mockResolvedValue(mockSubscriptions);
  
//     render(<UnsubscribeFlightClient />);
  
//     await waitFor(() => screen.getByText("1234"));
  
//     // Use our mock select button
//     fireEvent.click(screen.getByText(/Select 1234/i));
  
//     // Now unsubscribe button should be visible
//     fireEvent.click(screen.getByRole("button", { name: /Unsubscribe Selected/i }));
  
//     expect(screen.getByText(/Confirm Unsubscription/i)).toBeInTheDocument();
//   });
  
  
  
  

// it("calls unsubscribe service on confirm", async () => {
//     (flightService.getSubscribedFlightsDetails as jest.Mock).mockResolvedValue(mockSubscriptions);
//     (flightService.unsubscribeFlights as jest.Mock).mockResolvedValue(true);
  
//     render(<UnsubscribeFlightClient />);
  
//     await waitFor(() => screen.getByTestId("mock-table"));
  
//     // Select first subscription in mocked table
//     fireEvent.click(screen.getByText(/Select 1234/i));
  
//     // Now unsubscribe button should appear
//     fireEvent.click(screen.getByRole("button", { name: /Unsubscribe Selected/i }));
  
//     // Confirm unsubscribe
//     fireEvent.click(screen.getByRole("button", { name: /^Unsubscribe$/i }));
  
//     // Assert API was called
//     await waitFor(() =>
//       expect(flightService.unsubscribeFlights).toHaveBeenCalledWith(["sub1"])
//     );
//   });
  
  
});
