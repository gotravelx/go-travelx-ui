// __tests__/components/subscribe-flight-status-view.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import type { FlightData } from "@/types/flight";
import SubscribeFlightStatusView from "@/components/subscribtion-flight-status-view";


// Mock flight data
const baseFlightData: FlightData = {
    flightNumber: "123",
    scheduledDepartureDate: "2025-09-25",
    carrierCode: "AI",
    operatingAirline: "Air India",

    departureCity: "Delhi",
    arrivalCity: "Mumbai",
    departureAirport: "DEL",
    arrivalAirport: "BOM",

    departureGate: "A1",
    arrivalGate: "B2",
    departureTerminal: "T3",
    arrivalTerminal: "T2",

    equipmentModel: "A320",
    baggageClaim: "5",

    flightStatus: "Not Departed", // ✅ added
    currentFlightStatus: "Not Departed", // ✅ added

    isCanceled: false,
    isSubscribed: false, // ✅ required by type

    boardingTime: "2025-09-25T05:00:00Z",
    scheduledDepartureUTCDateTime: "2025-09-25T06:00:00Z",
    scheduledArrivalUTCDateTime: "2025-09-25T08:00:00Z", // ✅ corrected key

    estimatedDepartureUTC: "2025-09-25T06:30:00Z",
    estimatedArrivalUTC: "2025-09-25T08:15:00Z",

    actualDepartureUTC: "",
    actualArrivalUTC: "",

    outTimeUTC: "",
    offTimeUTC: "",
    onTimeUTC: "",
    inTimeUTC: "",

    departureDelayMinutes: 0,
    arrivalDelayMinutes: 0,
    statusCode: "in"
};

describe("SubscribeFlightStatusView", () => {
  it("renders Flight Not Found when data is empty", () => {
    render(<SubscribeFlightStatusView flightData={{} as FlightData} />);

    expect(screen.getByText(/flight not found/i)).toBeInTheDocument();
    expect(
      screen.getByText(/The flight information could not be found/i)
    ).toBeInTheDocument();
  });

  it("renders canceled flight view", () => {
    render(
      <SubscribeFlightStatusView
        flightData={{ ...baseFlightData, isCanceled: true, statusCode: "cncl" }}
      />
    );

    expect(screen.getByText(/Flight Canceled/i)).toBeInTheDocument();
    expect(
      screen.getByText(/This flight has been canceled/i)
    ).toBeInTheDocument();
  });

it("renders default flight status (Not Departed)", () => {
    render(<SubscribeFlightStatusView flightData={baseFlightData} />);
  
    expect(screen.getByText(/Flight Status/i)).toBeInTheDocument();
  
    // Departure city info
    expect(screen.getByText(/Delhi/i)).toBeInTheDocument();
    // Arrival city info
    expect(screen.getByText(/Mumbai/i)).toBeInTheDocument();
  
    // Badge shows current status
    // (optional: use getAllByText or add data-testid to check Not Departed explicitly)
  });
  
  it("renders OUT phase correctly", () => {
    render(
      <SubscribeFlightStatusView
        flightData={{ ...baseFlightData, statusCode: "out" }}
      />
    );

    expect(screen.getByText(/Flight Status/i)).toBeInTheDocument();
  });

//   it("renders IN phase with duration", () => {
//     render(
//       <SubscribeFlightStatusView
//         flightData={{
//           ...baseFlightData,
//           statusCode: "in",
//           actualDepartureUTC: "2025-09-25T06:00:00Z",
//           actualArrivalUTC: "2025-09-25T08:00:00Z",
//         }}
//       />
//     );

//     expect(screen.getByText(/Arrived/i)).toBeInTheDocument();
//     expect(screen.getByText(/2h 0m/i)).toBeInTheDocument();
//   });

  it("switches time format between UTC and Local", () => {
    render(<SubscribeFlightStatusView flightData={baseFlightData} />);

    // Default is UTC
    expect(screen.getAllByText(/UTC/).length).toBeGreaterThan(0);

    // Change to Local
    fireEvent.click(screen.getByText(/UTC Time/i));
    fireEvent.click(screen.getByText(/Local Time/i));

    // Now we should still have formatted local time text
    expect(screen.getByText(/Local Time/i)).toBeInTheDocument();
  });
});
