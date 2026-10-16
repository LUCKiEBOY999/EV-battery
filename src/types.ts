export type VehicleModel = 'Model 3' | 'Model Y' | 'Model S' | 'Model X' | 'Others';
export type ChargingType = 'AC' | 'DC Fast' | 'Home';
export type DataQualityStatus = 'Clean' | 'Missing' | 'Error';

export interface VehicleRecord {
  id: string;
  vehicleModel: VehicleModel;
  vehicleAge: number; // in years (e.g. 1 to 8)
  accumulatedMileage: number; // in km
  chargingCycles: number | null; // null if missing
  chargingType: ChargingType;
  operatingTemperature: number | null; // in °C (null if missing or extreme anomaly)
  batteryHealth: number; // in %
  batteryCapacityKWh: number;
  nominalRangeKm: number;
  currentRangeKm: number | null; // null if missing
  status: 'Optimal' | 'Normal' | 'Degraded';
  dataQuality: DataQualityStatus;
  errorDetail?: string | null;
}

export interface FilterState {
  vehicleModel: string;
  chargingType: string;
  vehicleAgeRange: string;
  mileageRange: string;
  temperatureRange: string;
  dataQuality?: string; // 'All' | 'Clean' | 'Missing' | 'Error'
  searchQuery?: string;
}

export interface KPIStats {
  averageBatteryHealth: number;
  totalVehicles: number;
  averageMileage: number;
  averageChargingCycles: number;
  averageOperatingTemperature: number;
  cleanVehiclesCount: number;
  missingValuesCount: number;
  errorValuesCount: number;
}

export type NavigationTab = 
  | 'home' 
  | 'battery-health-prediction';

export interface ModelFeatureImportance {
  feature: string;
  importance: number; // 0 to 100
  description: string;
}
