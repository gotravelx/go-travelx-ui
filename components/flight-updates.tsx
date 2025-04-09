import type { FlightUpdates } from "@/types/flight"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface FlightUpdatesProps {
  updates: FlightUpdates
}

export function FlightUpdatesView({ updates }: FlightUpdatesProps) {
  if (!updates || updates.updates.length === 0) return null

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>Flight Updates</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {updates.updates.map((update, index) => (
            <div key={index} className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
              <div>
                <p className="text-sm font-medium">{update.field}</p>
                <p className="text-xs text-muted-foreground">Updated to: {update.newValue}</p>
              </div>
              <Badge variant="outline">{new Date(update.timestamp).toLocaleTimeString()}</Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
