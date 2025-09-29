// __tests__/ViewFlight.test.tsx

jest.mock("@/components/view-flight-data-table", () => ({
  __esModule: true,
  default: (props: any) => (
    <div data-testid="mock-table">
      {props.flights?.map((f: any) => (
        <div key={f.flightNumber}>{f.flightNumber}</div>
      ))}
    </div>
  ),
}));

import { render, screen } from "@testing-library/react";
import ViewFlight from "@/components/view-flight";
import { flightService } from "@/services/api";
import type { FlightData } from "@/types/flight";

// Mock API service
jest.mock("@/services/api", () => ({
  flightService: {
    getSubscribedFlights: jest.fn(),
  },
}));

const mockFlights: any = [
  {
    flightNumber: "1234",
    carrierCode: "UA",
    departureAirport: "SFO",
    arrivalAirport: "LAX",
    scheduledDepartureDate: "2025-09-23",
  },
];

describe("ViewFlight", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders flights successfully when API returns data", async () => {
    (flightService.getSubscribedFlights as jest.Mock).mockResolvedValue(
      mockFlights
    );

    render(<ViewFlight />);

    expect(await screen.findByTestId("mock-table")).toBeInTheDocument();
    expect(await screen.findByText("1234")).toBeInTheDocument();
  });
});
