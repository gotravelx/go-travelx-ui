"use client"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { format } from "date-fns"
import { AlertCircle, CalendarIcon } from "lucide-react"
import { memo, useState, useEffect, useRef } from "react"
import { flightService } from "@/services/api"
import type { AirportCode } from "@/types/flight"

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
    setDepartureStation,
    arrivalStation,
    setArrivalStation,
    onDepartureStationChange,
    onArrivalStationChange,
    onCarrierChange,
    setSearchError,
  }: {
    flightNumber: string
    onFlightNumberChange: (value: string) => void
    onSearch: () => void
    isLoading: boolean
    searchError: string
    selectedDate: Date | undefined
    onDateChange: (value: Date) => void
    carrier: string
    departureStation: string
    setDepartureStation: (value: string) => void
    arrivalStation: string
    setArrivalStation: (value: string) => void
    onDepartureStationChange: (value: string) => void
    onArrivalStationChange: (value: string) => void
    onCarrierChange: (value: string) => void
    setSearchError: (value: string) => void
  }) => {
    const [isCalendarOpen, setIsCalendarOpen] = useState(false)

    // Airport suggestions state
    const [departureAirports, setDepartureAirports] = useState<AirportCode[]>([])
    const [arrivalAirports, setArrivalAirports] = useState<AirportCode[]>([])
    const [showDepartureSuggestions, setShowDepartureSuggestions] = useState(false)
    const [showArrivalSuggestions, setShowArrivalSuggestions] = useState(false)
    const [isLoadingAirports, setIsLoadingAirports] = useState(false)
    const [allAirports, setAllAirports] = useState<AirportCode[]>([])

    // Refs for dropdown positioning
    const departureInputRef = useRef<HTMLInputElement>(null)
    const arrivalInputRef = useRef<HTMLInputElement>(null)
    const departureSuggestionsRef = useRef<HTMLDivElement>(null)
    const arrivalSuggestionsRef = useRef<HTMLDivElement>(null)

    // Load all airports on component mount
    useEffect(() => {
      const loadAirports = async () => {
        try {
          setIsLoadingAirports(true)
          const response = await flightService.searchAirportCodes()
          if (response.success && response.data) {
            setAllAirports(response.data)
          }
        } catch (error) {
          console.error("Error loading airports:", error)
        } finally {
          setIsLoadingAirports(false)
        }
      }
      loadAirports()
    }, [])

    const handleFlightNumberChange = (value: string) => {
      const numericValue = value.replace(/\D/g, "").slice(0, 4)
      onFlightNumberChange(numericValue)
    }

    const filterAirports = (query: string): AirportCode[] => {
      if (query.length < 1) return []
      
      const filtered = allAirports.filter((airport) =>
        airport.airPortCode.toLowerCase().includes(query.toLowerCase())
      )
      return filtered.slice(0, 10) // Limit to 10 suggestions
    }

    const handleDepartureStationChange = async (value: string) => {
      const formattedValue = value.toUpperCase().slice(0, 3)
      setDepartureStation(formattedValue)
      onDepartureStationChange(formattedValue)

      if (formattedValue.length >= 1) {
        const suggestions = filterAirports(formattedValue)
        setDepartureAirports(suggestions)
        setShowDepartureSuggestions(true)
      } else {
        setShowDepartureSuggestions(false)
        setDepartureAirports([])
      }
    }

    const handleArrivalStationChange = async (value: string) => {
      const formattedValue = value.toUpperCase().slice(0, 3)
      setArrivalStation(formattedValue)
      onArrivalStationChange(formattedValue)

      if (formattedValue.length >= 1) {
        const suggestions = filterAirports(formattedValue)
        setArrivalAirports(suggestions)
        setShowArrivalSuggestions(true)
      } else {
        setShowArrivalSuggestions(false)
        setArrivalAirports([])
      }
    }

    const selectDepartureAirport = (airportCode: string) => {
      setDepartureStation(airportCode)
      onDepartureStationChange(airportCode)
      setShowDepartureSuggestions(false)
      setDepartureAirports([])
    }

    const selectArrivalAirport = (airportCode: string) => {
      setArrivalStation(airportCode)
      onArrivalStationChange(airportCode)
      setShowArrivalSuggestions(false)
      setArrivalAirports([])
    }

    const handleDepartureInputFocus = () => {
      if (departureStation.length >= 1) {
        const suggestions = filterAirports(departureStation)
        setDepartureAirports(suggestions)
        setShowDepartureSuggestions(true)
      }
    }

    const handleArrivalInputFocus = () => {
      if (arrivalStation.length >= 1) {
        const suggestions = filterAirports(arrivalStation)
        setArrivalAirports(suggestions)
        setShowArrivalSuggestions(true)
      }
    }

    // Close suggestions when clicking outside
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          departureSuggestionsRef.current &&
          !departureSuggestionsRef.current.contains(event.target as Node) &&
          !departureInputRef.current?.contains(event.target as Node)
        ) {
          setShowDepartureSuggestions(false)
        }

        if (
          arrivalSuggestionsRef.current &&
          !arrivalSuggestionsRef.current.contains(event.target as Node) &&
          !arrivalInputRef.current?.contains(event.target as Node)
        ) {
          setShowArrivalSuggestions(false)
        }
      }

      document.addEventListener("mousedown", handleClickOutside)
      return () => {
        document.removeEventListener("mousedown", handleClickOutside)
      }
    }, [])

    const handleSearch = () => {
      let hasError = false
      let errorMessage = ""

      if (!flightNumber || flightNumber.length !== 4 || !/^\d+$/.test(flightNumber)) {
        errorMessage = "Flight number must be 4 digits"
        hasError = true
      }

      if (!departureStation || departureStation.length !== 3) {
        errorMessage = "Departure station must be 3 characters"
        hasError = true
      }

      if (hasError) {
        if (typeof setSearchError === "function") {
          setSearchError(errorMessage)
        }
        return
      }

      if (searchError && typeof setSearchError === "function") {
        setSearchError("")
      }

      onSearch()
    }

    return (
      <div className="w-full mx-auto min-h-[100vh]">
        <style jsx global>{`
          .form-input-enhanced ::placeholder {
            color: rgba(115, 115, 115, 0.8);
            font-weight: 500;
          }
        `}</style>
        <div className="flex flex-col form-input-enhanced w-full gap-4 md:flex-row">
          <div className="flex flex-col w-full md:w-auto">
            <label htmlFor="carrier-select" className="text-sm font-medium mb-1">
              Carrier
            </label>
            <Select value={carrier} onValueChange={onCarrierChange}>
              <SelectTrigger className="bg-background/90 border-2 border-primary/50 shadow-sm w-full focus:border-primary md:w-[120px]">
                <SelectValue placeholder="Carrier" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="UA">UA</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-3 flex-col">
            <label htmlFor="flight-number" className="text-sm font-medium mb-1">
              Flight
            </label>
            <Input
              id="flight-number"
              placeholder="Enter Flight Number"
              value={flightNumber}
              onChange={(e) => handleFlightNumberChange(e.target.value)}
              disabled={isLoading}
              className="bg-background/90 border-2 border-primary/50 shadow-sm w-full focus-visible:border-primary"
              maxLength={4}
            />
          </div>

          <div className="flex flex-5 flex-col justify-center items-center">
            <div className="pt-4">and </div>
          </div>

          {/* Departure Station with Autocomplete */}
          <div className="flex flex-col w-full md:w-auto relative">
            <label htmlFor="departure-station" className="text-sm font-medium mb-1">
              From
            </label>
            <Input
              ref={departureInputRef}
              id="departure-station"
              placeholder="Enter Station Code"
              value={departureStation}
              onChange={(e) => handleDepartureStationChange(e.target.value)}
              className="bg-background/90 border-2 border-primary/50 shadow-sm w-full focus-visible:border-primary md:w-[120px]"
              maxLength={3}
              onFocus={handleDepartureInputFocus}
            />

            {/* Departure Suggestions Dropdown */}
            {showDepartureSuggestions && (
              <div
                ref={departureSuggestionsRef}
                className="absolute top-full left-0 right-0 z-50 mt-1 bg-background border border-border rounded-md shadow-lg max-h-48 overflow-y-auto"
                style={{ minWidth: '200px' }}
              >
                {isLoadingAirports ? (
                  <div className="p-2 text-sm text-muted-foreground">Loading...</div>
                ) : departureAirports.length > 0 ? (
                  departureAirports.map((airport) => (
                    <div
                      key={airport.airPortCode}
                      className="p-2 hover:bg-accent cursor-pointer text-sm"
                      onClick={() => selectDepartureAirport(airport.airPortCode)}
                    >
                      {airport.airPortCode}
                    </div>
                  ))
                ) : (
                  <div className="p-2 text-sm text-muted-foreground">No airports found</div>
                )}
              </div>
            )}
          </div>

          {/* Arrival Station with Autocomplete */}
          <div className="flex flex-col w-full md:w-auto relative">
            <label htmlFor="arrival-station" className="text-sm font-medium mb-1">
              To
            </label>
            <Input
              ref={arrivalInputRef}
              id="arrival-station"
              placeholder="Enter Station Code"
              value={arrivalStation}
              onChange={(e) => handleArrivalStationChange(e.target.value)}
              className="bg-background/90 border-2 border-primary/50 shadow-sm w-full focus-visible:border-primary md:w-[120px]"
              maxLength={3}
              onFocus={handleArrivalInputFocus}
            />

            {/* Arrival Suggestions Dropdown */}
            {showArrivalSuggestions && (
              <div
                ref={arrivalSuggestionsRef}
                className="absolute top-full left-0 right-0 z-50 mt-1 bg-background border border-border rounded-md shadow-lg max-h-48 overflow-y-auto"
                style={{ minWidth: '200px' }}
              >
                {isLoadingAirports ? (
                  <div className="p-2 text-sm text-muted-foreground">Loading...</div>
                ) : arrivalAirports.length > 0 ? (
                  arrivalAirports.map((airport) => (
                    <div
                      key={airport.airPortCode}
                      className="p-2 hover:bg-accent cursor-pointer text-sm"
                      onClick={() => selectArrivalAirport(airport.airPortCode)}
                    >
                      {airport.airPortCode}
                    </div>
                  ))
                ) : (
                  <div className="p-2 text-sm text-muted-foreground">No airports found</div>
                )}
              </div>
            )}
          </div>

          {/* Date Picker */}
          <div className="flex flex-col w-full md:w-auto">
            <label className="text-sm font-medium mb-1">Sch Dpt Dt</label>
            <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="bg-background/90 border-2 border-primary/50 justify-start shadow-sm w-full hover:border-primary md:w-auto"
                >
                  <CalendarIcon className="h-4 w-4 mr-2" />
                  {selectedDate ? format(selectedDate, "PPP") : format(new Date(), "PPP")}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="p-0 w-auto" align="start">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(selectedDate) => {
                    if (selectedDate) {
                      const normalizedDate = new Date(
                        Date.UTC(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate()),
                      )
                      onDateChange(normalizedDate)
                    }
                    setIsCalendarOpen(false)
                  }}
                  disabled={(d) => d > new Date() || d < new Date("2023-01-01")}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Search Button */}
          <div className="flex justify-end mt-auto">
            <Button onClick={handleSearch} className="h-10 w-full gradient-border md:w-auto" disabled={isLoading}>
              {isLoading ? "Searching..." : "Search"}
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
    )
  },
)

SubscribeFlight.displayName = "SubscribeFlight"

export default SubscribeFlight