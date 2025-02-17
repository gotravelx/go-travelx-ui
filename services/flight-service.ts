import type { ethers } from "ethers"
import { getFlightStatus } from "./flight-api"

export async function getAndUpdateFlightData(contract: ethers.Contract, flightNumber: string) {
  try {
    // First try to get data from smart contract
    const contractData = await contract.getFlightData(flightNumber)

    // If flight exists in contract
    if (contractData[10]) {
      // exists boolean is the last item
      // Get fresh data from API
      const apiData = await getFlightStatus(flightNumber)

      // Compare and update if needed
      const needsUpdate =
        contractData[0] !== apiData.estimatedArrivalUTC ||
        contractData[1] !== apiData.estimatedDepartureUTC ||
        contractData[2] !== apiData.arrivalCity ||
        contractData[3] !== apiData.departureCity ||
        contractData[4] !== apiData.operatingAirline ||
        contractData[5] !== apiData.departureGate ||
        contractData[6] !== apiData.arrivalGate ||
        contractData[7] !== apiData.flightStatus ||
        contractData[8] !== apiData.equipmentModel

      if (needsUpdate) {
        // Update contract with new data
        await contract.setFlightData(
          flightNumber,
          apiData.estimatedArrivalUTC,
          apiData.estimatedDepartureUTC,
          apiData.arrivalCity,
          apiData.departureCity,
          apiData.operatingAirline,
          apiData.departureGate,
          apiData.arrivalGate,
          apiData.flightStatus,
          apiData.equipmentModel,
        )
      }

      // Return the most recent data
      return apiData
    } else {
      // If flight doesn't exist in contract, get from API and store
      const apiData = await getFlightStatus(flightNumber)

      // Store in contract
      await contract.setFlightData(
        flightNumber,
        apiData.estimatedArrivalUTC,
        apiData.estimatedDepartureUTC,
        apiData.arrivalCity,
        apiData.departureCity,
        apiData.operatingAirline,
        apiData.departureGate,
        apiData.arrivalGate,
        apiData.flightStatus,
        apiData.equipmentModel,
      )

      return apiData
    }
  } catch (error) {
    console.error("Error in getAndUpdateFlightData:", error)
    throw error
  }
}

