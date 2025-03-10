import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { AlertCircle, CalendarIcon, Search } from "lucide-react";
import { memo, useState } from "react";

const SubscribeFlight = memo(
  ({
    flightNumber,
    onFlightNumberChange,
    onSearch,
    isLoading,
    searchError,
    selectedDate,
    onDateChange,
    carrier,
    departureStation,
    onDepartureStationChange,
    onCarrierChange,
  }: {
    flightNumber: string;
    onFlightNumberChange: (value: string) => void;
    onSearch: () => void;
    isLoading: boolean;
    searchError: string;
    selectedDate: Date | undefined;
    onDateChange: (value: Date) => void;
    carrier: string;
    departureStation: string;
    onDepartureStationChange: (value: string) => void;
    onCarrierChange: (value: string) => void;
  }) => {
    let [isCalendarOpen, setIsCalendarOpen] = useState(false);

    return (
      <div className="w-full max-w-4xl mx-auto">
        <style jsx global>{`
          .form-input-enhanced ::placeholder {
            color: rgba(115, 115, 115, 0.8);
            font-weight: 500;
          }
        `}</style>
        <div className="flex flex-col md:flex-row gap-4 w-full form-input-enhanced">
          <div className="flex flex-col w-full md:w-auto">
            <label
              htmlFor="carrier-select"
              className="text-sm font-medium mb-1"
            >
              Carrier
            </label>
            <Select value={carrier} onValueChange={onCarrierChange}>
              <SelectTrigger className="w-full md:w-[120px] border-2 border-primary/50 focus:border-primary bg-background/90 shadow-sm">
                <SelectValue placeholder="Carrier" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="UA">UA</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col flex-1">
            <label htmlFor="flight-number" className="text-sm font-medium mb-1">
              Flight Number
            </label>
            <Input
              id="flight-number"
              placeholder="Enter flight number..."
              value={flightNumber}
              onChange={(e) => onFlightNumberChange(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && onSearch()}
              disabled={isLoading}
              className="w-full border-2 border-primary/50 focus-visible:border-primary bg-background/90 shadow-sm"
            />
          </div>

          {/* departure station*/}

          <div className="flex flex-col w-full md:w-auto">
            <label
              htmlFor="carrier-select"
              className="text-sm font-medium mb-1"
            >
              Departure Station
            </label>
            <Select
              value={departureStation}
              onValueChange={onDepartureStationChange}
            >
              <SelectTrigger className="w-full md:w-[120px] border-2 border-primary/50 focus:border-primary bg-background/90 shadow-sm">
                <SelectValue placeholder="Departure Station" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="IAS">IAS</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {/* {departure station } */}
          <div className="flex flex-col w-full md:w-auto">
            <label className="text-sm font-medium mb-1">
              Scheduled Departure Date
            </label>
            <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full md:w-auto justify-start border-2 border-primary/50 hover:border-primary bg-background/90 shadow-sm"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate
                    ? format(selectedDate, "PPP")
                    : format(new Date(), "PPP")}{" "}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(selectedDate) => {
                    if (selectedDate) {
                      onDateChange(selectedDate); // ✅ Update date from parent
                    }
                    setIsCalendarOpen(false);
                  }}
                  disabled={(d) => d > new Date() || d < new Date("2023-01-01")}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="flex flex-col justify-end mt-auto">
            <Button
              onClick={onSearch}
              className="gradient-border w-full md:w-auto h-10"
              disabled={isLoading}
            >
              {isLoading ? "Searching..." : "Submit"}
            </Button>
          </div>
        </div>

        {searchError && (
          <Alert variant="destructive" className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{searchError}</AlertDescription>
          </Alert>
        )}
      </div>
    );
  }
);

export default SubscribeFlight;
