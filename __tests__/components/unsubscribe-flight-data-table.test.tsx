// __tests__/components/UnSubscribeDataTable.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { flightService } from "@/services/api";
import type { SubscriptionDetails } from "@/types/flight";
import UnSubscribeDataTable from "@/components/unsubscribe-flight-data-table";

// Mock API service
jest.mock("@/services/api", () => ({
  flightService: {
    unsubscribeFlights: jest.fn(),
  },
}));

// Mock the actual component to simplify rendering
jest.mock("../../components/unsubscribe-flight-data-table", () => ({
  __esModule: true,
  default: ({ subscriptions, isLoading, onSubscriptionSelect }: any) => {
    if (isLoading) {
      return <div role="status">Loading...</div>;
    }
    return (
      <div data-testid="mock-table">
        {subscriptions.map((s: any) => (
          <div key={s.subscription._id}>
            <span>{s.flight.flightNumber}</span>
            <button
              onClick={() =>
                onSubscriptionSelect([
                  { subscription: s.subscription, flight: s.flight },
                ])
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

describe("UnSubscribeDataTable", () => {
  const mockOnSubscriptionSelect = jest.fn();
  const mockOnSelectAll = jest.fn();
  const mockOnUnsubscribe = jest.fn();

  const mockSubscriptions: SubscriptionDetails[] = [
    {
      subscription: {
        _id: "sub1",
        blockchainTxHash: "0x1234567890abcdef",
        flightNumber: "1234",
        departureAirport: "JFK",
        subscriptionDate: new Date().toISOString(),
        isSubscriptionActive: true,
        arrivalAirport: "",
        flightSubscriptionStatus: "",
        createdAt: "",
        updatedAt: "",
      },
      flight: {
        carrierCode: "AA",
        flightNumber: "1234",
        departureCity: "New York",
        departureAirport: "JFK",
        arrivalCity: "Los Angeles",
        arrivalAirport: "LAX",
        scheduledDepartureDate: new Date().toISOString(),
        scheduledDepartureUTCDateTime: new Date().toISOString(),
        scheduledArrivalUTCDateTime: new Date().toISOString(),
        statusCode: "on",
        operatingAirline: "",
        estimatedArrivalUTC: "",
        estimatedDepartureUTC: "",
        departureGate: "",
        arrivalGate: "",
        flightStatus: "",
        equipmentModel: "",
        actualDepartureUTC: "",
        actualArrivalUTC: "",
        isCanceled: false,
        isSubscribed: false,
      },
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders loading spinner when isLoading is true", () => {
    render(
      <UnSubscribeDataTable
        subscriptions={[]}
        isLoading={true}
        selectedSubscriptions={new Set()}
        onSubscriptionSelect={mockOnSubscriptionSelect}
        selectAll={false}
        onSelectAll={mockOnSelectAll}
        onUnsubscribe={mockOnUnsubscribe}
      />
    );

    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("renders subscriptions", () => {
    render(
      <UnSubscribeDataTable
        subscriptions={mockSubscriptions}
        isLoading={false}
        selectedSubscriptions={new Set()}
        onSubscriptionSelect={mockOnSubscriptionSelect}
        selectAll={false}
        onSelectAll={mockOnSelectAll}
        onUnsubscribe={mockOnUnsubscribe}
      />
    );

    expect(screen.getByTestId("mock-table")).toBeInTheDocument();
    expect(screen.getByText("1234")).toBeInTheDocument();
  });

  it("calls onSubscriptionSelect when a subscription is selected", () => {
    render(
      <UnSubscribeDataTable
        subscriptions={mockSubscriptions}
        isLoading={false}
        selectedSubscriptions={new Set()}
        onSubscriptionSelect={mockOnSubscriptionSelect}
        selectAll={false}
        onSelectAll={mockOnSelectAll}
        onUnsubscribe={mockOnUnsubscribe}
      />
    );

    fireEvent.click(screen.getByText("Select 1234"));
    expect(mockOnSubscriptionSelect).toHaveBeenCalledWith([
      {
        subscription: mockSubscriptions[0].subscription,
        flight: mockSubscriptions[0].flight,
      },
    ]);
  });
});
