import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ViewFlight from "@/components/view-flight";
import { flightService } from "@/services/api";
import { toast } from "sonner";
import type { FlightData } from "@/types/flight";

// Mock API service
jest.mock("@/services/api", () => ({
  flightService: {
    getSubscribedFlights: jest.fn(),
  },
}));

// Mock toast
jest.mock("sonner", () => ({
  toast: {
    error: jest.fn(),
    info: jest.fn(),
  },
}));

const mockFlights: FlightData[] = [
  {
    flightNumber: "1234",
    carrierCode: "UA",
    departureAirport: "SFO",
    arrivalAirport: "LAX",
    scheduledDepartureDate: "2025-09-23",
  } as FlightData,
];

describe("ViewFlight", () => {
  const defaultProps = {
    flightNumber: "",
    onFlightNumberChange: jest.fn(),
    onSearch: jest.fn(),
    isLoading: false,
    searchError: "",
    selectedDate: undefined,
    onDateChange: jest.fn(),
    carrier: "UA",
    onCarrierChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("with mocked child", () => {
    beforeAll(() => {
      // Mock the child here so only these tests use it
      jest.doMock("@/components/view-flight-data-table", () => ({
        __esModule: true,
        default: ({ flights }: { flights: FlightData[] }) => (
          <div data-testid="mock-table">
            {flights.map((f) => (
              <div key={f.flightNumber}>{f.flightNumber}</div>
            ))}
          </div>
        ),
      }));
    });

    // it("renders flights after fetching subscriptions", async () => {
    //   (flightService.getSubscribedFlights as jest.Mock).mockResolvedValue(
    //     mockFlights
    //   );

    //   render(<ViewFlight {...defaultProps} />);

    //   expect(await screen.findByTestId("mock-table")).toBeInTheDocument();
    //   expect(await screen.findByText("1234")).toBeInTheDocument();
    // });

    it("shows error toast if fetch fails", async () => {
      (flightService.getSubscribedFlights as jest.Mock).mockRejectedValue(
        new Error("API error")
      );

      render(<ViewFlight {...defaultProps} />);

      await waitFor(() =>
        expect(toast.error).toHaveBeenCalledWith(
          "Failed to fetch subscribed flights"
        )
      );
    });

    // it("applies filters and shows validation error for invalid flight number", async () => {
    //   (flightService.getSubscribedFlights as jest.Mock).mockResolvedValue(
    //     mockFlights
    //   );

    //   render(<ViewFlight {...defaultProps} />);

    //   const input = await screen.findByPlaceholderText(/enter flight number/i);

    //   fireEvent.change(input, { target: { value: "12" } }); // invalid (not 4 digits)
    //   fireEvent.click(screen.getByText(/search/i));

    //   expect(await screen.findByTestId("flight-error")).toHaveTextContent(
    //     /flight number must be 4 digits/i
    //   );
    // });

    it("resets filters when clicking Clear Filters", async () => {
      (flightService.getSubscribedFlights as jest.Mock).mockResolvedValue(
        mockFlights
      );

      render(<ViewFlight {...defaultProps} flightNumber="9999" />);

      const clearButton = await screen.findByText(/clear filters/i);
      fireEvent.click(clearButton);

      expect(defaultProps.onFlightNumberChange).toHaveBeenCalledWith("");
      expect(defaultProps.onCarrierChange).toHaveBeenCalledWith("UA");
      expect(defaultProps.onDateChange).toHaveBeenCalledWith(undefined);
    });
  });
});
