// UnSubscribeDataTable.test.tsx
import { render, screen, fireEvent, waitFor, within } from "@testing-library/react";
import { flightService } from "@/services/api";
import type { SubscriptionDetails } from "@/types/flight";
import UnSubscribeDataTable from "@/components/unsubscribe-flight-data-table";

jest.mock("@/services/api", () => ({
  flightService: {
    unsubscribeFlights: jest.fn(),
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
          walletAddress: "",
          arrivalAirport: "",
          flightSubscriptionStatus: "",
          createdAt: "",
          updatedAt: ""
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
          isSubscribed: false
      },
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders subscriptions and unsubscribes after confirmation", async () => {
    (flightService.unsubscribeFlights as jest.Mock).mockResolvedValue(true);

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

    // Subscription should be in the document
    expect(screen.getByText(/AA 1234/i)).toBeInTheDocument();

    // Click unsubscribe button in row
    fireEvent.click(screen.getByRole("button", { name: /Unsubscribe/i }));

    // Confirmation dialog should appear
    const dialog = await screen.findByText(/Confirm Unsubscription/i);

    // Find confirm button *inside* dialog
    const confirmButton = within(dialog.closest("div")!)
      .getByRole("button", { name: /^Unsubscribe$/i });

    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(flightService.unsubscribeFlights).toHaveBeenCalledWith(
        ["1234"],
        ["AA"],
        ["JFK"]
      );
    });

    expect(mockOnSubscriptionSelect).toHaveBeenCalledWith("sub1");
    expect(mockOnUnsubscribe).toHaveBeenCalled();
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
});
