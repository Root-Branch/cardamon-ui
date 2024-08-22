// Mock utility functions to calculate power consumption and CO2 emission based on CPU usage

const BASE_POWER_CONSUMPTION = 100 // Watts
const MAX_POWER_CONSUMPTION = 300 // Watts
const CPU_TO_POWER_FACTOR = 2 // Watts per CPU percentage
const POWER_TO_CO2_FACTOR = 5 // kg CO2 per Watt-hour

interface Usage {
  cpuUsage: number
  timestamp: number
}

export const calculatePowerConsumption = (usage: Usage): number => {
  // Power consumption increases linearly with CPU usage
  const powerFromCpu = usage.cpuUsage * CPU_TO_POWER_FACTOR
  const totalPower = BASE_POWER_CONSUMPTION + powerFromCpu

  // Cap the power consumption at the maximum
  return Math.min(totalPower, MAX_POWER_CONSUMPTION)
}

export const calculateCo2Emission = (usage: Usage): number => {
  // Calculate power consumption first
  const power = calculatePowerConsumption(usage)

  // Convert power (in Watts) to kWh for the given timestamp (assume 1-second interval)
  const kWh = power / 1000 / 3600

  // Calculate CO2 emission based on kWh
  return kWh * POWER_TO_CO2_FACTOR
}
