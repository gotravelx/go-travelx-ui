import { render, screen, fireEvent } from "@testing-library/react";
import SubscribeFlight from "@/components/subscribe-flight";
import { format } from "date-fns";

// Common props with jest.fn mocks
const defaultProps = {
  flightNumber: "",
  onFlightNumberChange: jest.fn(),
  onSearch: jest.fn(),
  isLoading: false,
  searchError: "",
  selectedDate: undefined,
  onDateChange: jest.fn(),
  carrier: "UA",
  departureStation: "",
  setDepartureStation: jest.fn(),
  arrivalStation: "",
  setArrivalStation: jest.fn(),
  onDepartureStationChange: jest.fn(),
  onArrivalStationChange: jest.fn(),
  onCarrierChange: jest.fn(),
  setSearchError: jest.fn(),
};

describe("SubscribeFlight", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it("renders all form fields", () => {
    render(<SubscribeFlight {...defaultProps} />);
  
    // Carrier (shadcn Select renders a combobox, not a label-input pair)
    expect(screen.getByRole("combobox")).toBeInTheDocument();
  
    // Standard inputs
    expect(screen.getByLabelText(/Flight/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/From/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/To/i)).toBeInTheDocument();
  
    // Departure Date button
    expect(screen.getByText(/Departure Date/i)).toBeInTheDocument();
  
    // Search button
    expect(screen.getByRole("button", { name: /Search/i })).toBeInTheDocument();
  });
  

  it("only allows numeric flight number and max 4 digits", () => {
    render(<SubscribeFlight {...defaultProps} />);

    const input = screen.getByPlaceholderText(/Enter Flight Number/i);

    fireEvent.change(input, { target: { value: "12AB56" } });
    expect(defaultProps.onFlightNumberChange).toHaveBeenCalledWith("1256");
  });

  it("formats departure and arrival station inputs to 3 uppercase chars", () => {
    render(<SubscribeFlight {...defaultProps} />);
  
    // Departure input (label: "From")
    const depInput = screen.getByLabelText(/From/i);
    fireEvent.change(depInput, { target: { value: "delhi" } });
  
    expect(defaultProps.setDepartureStation).toHaveBeenCalledWith("DEL");
    expect(defaultProps.onDepartureStationChange).toHaveBeenCalledWith("DEL");
  
    // Arrival input (label: "To")
    const arrInput = screen.getByLabelText(/To/i);
    fireEvent.change(arrInput, { target: { value: "mum" } });
  
    expect(defaultProps.setArrivalStation).toHaveBeenCalledWith("MUM");
    expect(defaultProps.onArrivalStationChange).toHaveBeenCalledWith("MUM");
  });
  

  it("validates flight number before calling onSearch", () => {
    render(<SubscribeFlight {...defaultProps} flightNumber="12" />);

    fireEvent.click(screen.getByRole("button", { name: /Search/i }));

    expect(defaultProps.setSearchError).toHaveBeenCalledWith(
      "Flight number must be 4 digits"
    );
    expect(defaultProps.onSearch).not.toHaveBeenCalled();
  });

  it("calls onSearch when valid flight number is provided", () => {
    render(<SubscribeFlight {...defaultProps} flightNumber="1234" />);

    fireEvent.click(screen.getByRole("button", { name: /Search/i }));

    expect(defaultProps.onSearch).toHaveBeenCalled();
  });

  it("shows error alert when searchError is set", () => {
    render(<SubscribeFlight {...defaultProps} searchError="Invalid input" />);

    expect(screen.getByText(/Invalid input/i)).toBeInTheDocument();
  });

  it("renders selected date correctly", () => {
    const today = new Date();
    render(<SubscribeFlight {...defaultProps} selectedDate={today} />);

    // Button label contains formatted date
    expect(
      screen.getByRole("button", { name: new RegExp(format(today, "PPP")) })
    ).toBeInTheDocument();
  });

  it("disables search button when loading", () => {
    render(<SubscribeFlight {...defaultProps} isLoading={true} />);

    const button = screen.getByRole("button", { name: /Searching.../i });
    expect(button).toBeDisabled();
  });
});
