"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Plane, Bell } from "lucide-react";
import { FlightStatusViewProps } from "./subscribtion-flight-status-view";

export default function SubscribeFlightCard({
  flightData,
}: FlightStatusViewProps) {
  return (
    <Card className="p-8  w-full max-w-3xl  bg-gradient-to-br from-background to-muted/20">
      <div className="pb-6">
        <div className="text-2xl font-semibold">
          Flight Status - {flightData.carrierCode} {flightData.flightNumber}
        </div>
        <span>Wednesday, March 21, 2025</span>
      </div>
      <CardContent className="p-4 border-[3px] rounded-xl border-[#0F172A] ">
        <div className="flex flex-col gap-8 ">
          <div className="flex justify-between relative">
            {/* Departure Section */}
            <div className="flex-1 text-left pr-12">
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground tracking-wider">
                    DEPARTURE
                  </p>
                  <p className="text-2xl font-bold mt-1">7:20 AM</p>
                </div>
                <div>
                  <span className="text-2xl font-bold text-primary">ASE</span>
                  <p className="text-sm text-muted-foreground mt-2">
                    Aspen, CO, US
                  </p>
                </div>
              </div>
            </div>

            {/* Center Line and Button */}
            <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center gap-6 z-10">
              <div className="relative h-32 flex items-center">
                <div className="w-[2px] h-full bg-gradient-to-b from-primary/20 via-primary to-primary/20"></div>
                <Button
                  size="icon"
                  className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 rounded-full w-12 h-12 bg-primary hover:bg-primary/90"
                >
                  <Plane className="w-6 h-6 rotate-90" />
                </Button>
              </div>
              <p className="text-sm font-medium text-muted-foreground">
                2h 48m
              </p>
            </div>

            {/* Arrival Section */}
            <div className="flex-1 text-right pl-12">
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground tracking-wider">
                    ARRIVAL
                  </p>
                  <p className="text-2xl font-bold mt-1">11:08 AM</p>
                </div>
                <div>
                  <span className="text-2xl font-bold text-primary">IAH</span>
                  <p className="text-sm text-muted-foreground mt-2">
                    Houston, TX, US
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Subscribe Button */}
          <div className="flex justify-end">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 transition-colors gap-2">
              <Bell className="h-4 w-4" />
              Subscribe to Updates
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
