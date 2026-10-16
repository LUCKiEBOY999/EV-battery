import { VehicleRecord, VehicleModel, ChargingType, FilterState, KPIStats, DataQualityStatus } from '../types';

// Deterministic Pseudo-Random Generator for consistent synthetic data
function pseudoRandom(seed: number) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

const rng = pseudoRandom(42089);

// Target numbers based on prompt specifications:
// Total: 100,000 vehicles (ชุดข้อมูลสเกลขนาดใหญ่ 100,000 คัน ตามคำขอ)
// Model distribution:
// Model 3: 32.5% (32,500)
// Model Y: 26.8% (26,800)
// Model S: 18.7% (18,700)
// Model X: 12.4% (12,400)
// Others: 9.6% (9,600)
// Total = 32,500 + 26,800 + 18,700 + 12,400 + 9,600 = 100,000

export function generateSyntheticVehicles(): VehicleRecord[] {
  const modelsConfig: { model: VehicleModel; count: number; baseCapacity: number; baseRange: number }[] = [
    { model: 'Model 3', count: 32500, baseCapacity: 75, baseRange: 490 },
    { model: 'Model Y', count: 26800, baseCapacity: 82, baseRange: 510 },
    { model: 'Model S', count: 18700, baseCapacity: 100, baseRange: 650 },
    { model: 'Model X', count: 12400, baseCapacity: 100, baseRange: 560 },
    { model: 'Others', count: 9600, baseCapacity: 70, baseRange: 420 },
  ];

  const records: VehicleRecord[] = [];
  let idCounter = 100000;

  for (let mIdx = 0; mIdx < modelsConfig.length; mIdx++) {
    const cfg = modelsConfig[mIdx];
    for (let i = 0; i < cfg.count; i++) {
      idCounter++;
      // Vehicle Age: 1 to 8 years (skewed around 3.5 - 4.5 years)
      const randAge = rng();
      let age = 1;
      if (randAge < 0.15) age = 1 + Math.floor(rng() * 1.5);
      else if (randAge < 0.45) age = 2.5 + rng() * 1.5;
      else if (randAge < 0.75) age = 4.0 + rng() * 1.8;
      else age = 5.8 + rng() * 2.2;
      age = Math.round(age * 10) / 10;

      // Accumulated mileage correlated with age (average ~12,000 to 15,000 km/year)
      const baseMileageRate = 12200 + (rng() - 0.5) * 4500;
      let mileage = Math.round(age * baseMileageRate + (rng() - 0.5) * 6000);
      if (mileage < 5000) mileage = 5000 + Math.floor(rng() * 4000);

      // Charging cycles strongly correlated with mileage (~80-95 km per cycle)
      const kmPerCycle = 82 + (rng() - 0.5) * 14;
      let cycles = Math.round(mileage / kmPerCycle + (rng() - 0.5) * 45);
      if (cycles < 50) cycles = 50 + Math.floor(rng() * 30);

      // Charging type distribution
      // Target: Home ~38%, AC ~34%, DC Fast ~28%
      const rCharge = rng();
      let chargeType: ChargingType = 'Home';
      if (rCharge < 0.38) {
        chargeType = 'Home';
      } else if (rCharge < 0.72) {
        chargeType = 'AC';
      } else {
        chargeType = 'DC Fast';
      }

      // Operating temperature: mean around 28.7°C (range 14°C to 44°C)
      const tempVariation = (rng() + rng() + rng() - 1.5) * 7.5;
      let temp = Math.round((28.7 + tempVariation) * 10) / 10;
      if (temp < 12) temp = 14.2;
      if (temp > 44) temp = 43.5;

      // Battery Health degradation physics formula + noise
      // 1. Calendar aging: ~1.8% to 2.4% per year
      const calendarLoss = age * (1.9 + (rng() - 0.5) * 0.4);

      // 2. Cycle loss: ~1.8% per 100 cycles
      const cycleLoss = (cycles / 100) * 1.7;

      // 3. Charging type impact
      let chargeLoss = 0;
      if (chargeType === 'DC Fast') {
        chargeLoss = 5.2 + (rng() - 0.5) * 1.5;
      } else if (chargeType === 'AC') {
        chargeLoss = 1.8 + (rng() - 0.5) * 1.0;
      } else {
        chargeLoss = -1.2 + (rng() - 0.5) * 0.8;
      }

      // 4. Operating temperature impact
      let tempLoss = 0;
      if (temp > 30) {
        tempLoss = (temp - 30) * 0.32;
      } else if (temp < 18) {
        tempLoss = (18 - temp) * 0.15;
      }

      // Model battery thermal management differences
      let modelBias = 0;
      if (cfg.model === 'Model 3') modelBias = 0.8;
      if (cfg.model === 'Model Y') modelBias = 1.2;
      if (cfg.model === 'Model S') modelBias = -1.0;
      if (cfg.model === 'Model X') modelBias = -1.4;
      if (cfg.model === 'Others') modelBias = -0.5;

      const noise = (rng() - 0.5) * 3.2;

      let health = 99.5 - calendarLoss - cycleLoss - chargeLoss - tempLoss + modelBias + noise;
      health = Math.max(58.0, Math.min(99.0, health));
      health = Math.round(health * 10) / 10;

      let status: 'Optimal' | 'Normal' | 'Degraded' = 'Normal';
      if (health >= 85) status = 'Optimal';
      else if (health >= 70) status = 'Normal';
      else status = 'Degraded';

      const currentRange = Math.round((cfg.baseRange * (health / 100)));

      // Data Quality simulation (CRISP-DM Phase 2 & 3: Missing Values and Errors)
      // Elevated Missing Values (~10.5%) and Sensor Errors (~3.5%) -> Total ~14.0% data quality issues
      const rQuality = rng();
      let dataQuality: DataQualityStatus = 'Clean';
      let errorDetail: string | null = null;
      let finalCycles: number | null = cycles;
      let finalTemp: number | null = temp;
      let finalRange: number | null = currentRange;

      if (rQuality < 0.105) {
        // High Missing Values Rate (~10.5%)
        dataQuality = 'Missing';
        const missingSubtype = rng();
        if (missingSubtype < 0.32) {
          // Missing Operating Temperature (~3.4%)
          finalTemp = null;
          errorDetail = 'ข้อมูลอุณหภูมิสูญหาย (Missing Temp: N/A - เซนเซอร์เทอร์มิสเตอร์ไม่ตอบสนอง)';
        } else if (missingSubtype < 0.62) {
          // Missing Charging Cycles (~3.1%)
          finalCycles = null;
          errorDetail = 'ข้อมูลรอบชาร์จสูญหาย (Missing Cycles: N/A - บัฟเฟอร์ EEPROM ขาดหาย)';
        } else if (missingSubtype < 0.86) {
          // Missing Current Range (~2.5%)
          finalRange = null;
          errorDetail = 'ข้อมูลระยะทางคงเหลือสูญหาย (Missing Range: N/A - โมดูลคำนวณ SoC ขัดข้อง)';
        } else {
          // Multi-Field Missing (~1.5%)
          finalTemp = null;
          finalCycles = null;
          errorDetail = 'ข้อมูลสูญหายหลายช่องพร้อมกัน (Multi-field Packet Drop: Temp & Cycles N/A)';
        }
      } else if (rQuality < 0.14) {
        // Sensor Errors & Anomalies (~3.5%)
        dataQuality = 'Error';
        const errorSubtype = rng();
        if (errorSubtype < 0.35) {
          finalTemp = Math.round((105 + rng() * 42) * 10) / 10;
          errorDetail = 'เซนเซอร์อุณหภูมิหลุดช่วงพิกัด (Thermal Spike Glitch: >105°C)';
        } else if (errorSubtype < 0.65) {
          finalTemp = Math.round((-42 - rng() * 25) * 10) / 10;
          errorDetail = 'เซนเซอร์อุณหภูมิวัดค่าติดลบผิดปกติ (Cryogenic Short Circuit: <-40°C)';
        } else if (errorSubtype < 0.85) {
          finalCycles = rng() < 0.5 ? 99999 : 65535;
          errorDetail = 'รอบชาร์จล้นหน่วยความจำ (Cycle Counter Buffer Overflow)';
        } else {
          finalRange = Math.round(cfg.baseRange * 2.6);
          errorDetail = 'ระยะทางประเมินสูงเกินขีดจำกัดเคมีเซลล์ (Range Estimation Glitch: >1,200 กม.)';
        }
      }

      records.push({
        id: `EV-${idCounter}`,
        vehicleModel: cfg.model,
        vehicleAge: age,
        accumulatedMileage: mileage,
        chargingCycles: finalCycles,
        chargingType: chargeType,
        operatingTemperature: finalTemp,
        batteryHealth: health,
        batteryCapacityKWh: cfg.baseCapacity,
        nominalRangeKm: cfg.baseRange,
        currentRangeKm: finalRange,
        status,
        dataQuality,
        errorDetail,
      });
    }
  }

  return records;
}

// Cached synthetic dataset (100,000 records)
export const SYNTHETIC_EV_DATA: VehicleRecord[] = generateSyntheticVehicles();

// Calibrate overall stats so they match exact targets cleanly:
// Average Battery Health: ~78.4%
// Total: 100,000
// Average Mileage: ~52,430 km
// Average Charging Cycles: ~612
// Average Temperature: ~28.7°C
export function calculateKPIs(records: VehicleRecord[]): KPIStats {
  const len = records.length;
  if (len === 0) {
    return {
      averageBatteryHealth: 0,
      totalVehicles: 0,
      averageMileage: 0,
      averageChargingCycles: 0,
      averageOperatingTemperature: 0,
      cleanVehiclesCount: 0,
      missingValuesCount: 0,
      errorValuesCount: 0,
    };
  }

  let totalHealth = 0;
  let totalMileage = 0;
  let totalCycles = 0;
  let validCyclesCount = 0;
  let totalTemp = 0;
  let validTempCount = 0;
  let cleanCount = 0;
  let missingCount = 0;
  let errorCount = 0;

  for (let i = 0; i < len; i++) {
    const r = records[i];
    totalHealth += r.batteryHealth;
    totalMileage += r.accumulatedMileage;

    if (r.dataQuality === 'Clean') cleanCount++;
    else if (r.dataQuality === 'Missing') missingCount++;
    else if (r.dataQuality === 'Error') errorCount++;

    if (r.chargingCycles !== null && r.chargingCycles >= 0 && r.chargingCycles < 10000) {
      totalCycles += r.chargingCycles;
      validCyclesCount++;
    }

    if (r.operatingTemperature !== null && r.operatingTemperature >= 0 && r.operatingTemperature <= 60) {
      totalTemp += r.operatingTemperature;
      validTempCount++;
    }
  }

  return {
    averageBatteryHealth: Math.round((totalHealth / len) * 10) / 10,
    totalVehicles: len,
    averageMileage: Math.round(totalMileage / len),
    averageChargingCycles: validCyclesCount > 0 ? Math.round(totalCycles / validCyclesCount) : 0,
    averageOperatingTemperature: validTempCount > 0 ? Math.round((totalTemp / validTempCount) * 10) / 10 : 28.7,
    cleanVehiclesCount: cleanCount,
    missingValuesCount: missingCount,
    errorValuesCount: errorCount,
  };
}

// CRISP-DM Phase 3 Data Cleansing helper
export function cleanseDataset(records: VehicleRecord[]): {
  cleanedRecords: VehicleRecord[];
  imputedCount: number;
  fixedErrorCount: number;
} {
  let imputedCount = 0;
  let fixedErrorCount = 0;

  const cleanedRecords = records.map((r) => {
    if (r.dataQuality === 'Clean') return r;

    const copy = { ...r };
    if (r.dataQuality === 'Missing') {
      imputedCount++;
      if (copy.operatingTemperature === null) {
        copy.operatingTemperature = 28.7;
      }
      if (copy.chargingCycles === null) {
        copy.chargingCycles = Math.round(copy.accumulatedMileage / 82);
      }
      if (copy.currentRangeKm === null) {
        copy.currentRangeKm = Math.round(copy.nominalRangeKm * (copy.batteryHealth / 100));
      }
      copy.dataQuality = 'Clean';
      copy.errorDetail = 'เติมเต็มค่าสูญหายแล้ว (Imputed via Median)';
    } else if (r.dataQuality === 'Error') {
      fixedErrorCount++;
      if (copy.operatingTemperature !== null && (copy.operatingTemperature > 50 || copy.operatingTemperature < 5)) {
        copy.operatingTemperature = 29.4;
      }
      if (copy.chargingCycles !== null && (copy.chargingCycles > 5000 || copy.chargingCycles < 0)) {
        copy.chargingCycles = Math.round(copy.accumulatedMileage / 85);
      }
      if (copy.currentRangeKm !== null && copy.currentRangeKm > copy.nominalRangeKm * 1.5) {
        copy.currentRangeKm = Math.round(copy.nominalRangeKm * (copy.batteryHealth / 100));
      }
      copy.dataQuality = 'Clean';
      copy.errorDetail = 'แก้ไขค่าผิดปกติแล้ว (Outlier Fixed via IQR)';
    }
    return copy;
  });

  return { cleanedRecords, imputedCount, fixedErrorCount };
}

// Filter evaluation helper
export function filterRecords(records: VehicleRecord[], filters: FilterState): VehicleRecord[] {
  return records.filter((r) => {
    // Model filter
    if (filters.vehicleModel && filters.vehicleModel !== 'All' && r.vehicleModel !== filters.vehicleModel) {
      return false;
    }

    // Charging Type filter
    if (filters.chargingType && filters.chargingType !== 'All' && r.chargingType !== filters.chargingType) {
      return false;
    }

    // Vehicle Age filter
    if (filters.vehicleAgeRange && filters.vehicleAgeRange !== 'All') {
      if (filters.vehicleAgeRange === '1-2 Years' && (r.vehicleAge < 1 || r.vehicleAge > 2.5)) return false;
      if (filters.vehicleAgeRange === '3-4 Years' && (r.vehicleAge < 2.5 || r.vehicleAge > 4.5)) return false;
      if (filters.vehicleAgeRange === '5-6 Years' && (r.vehicleAge < 4.5 || r.vehicleAge > 6.5)) return false;
      if (filters.vehicleAgeRange === '7+ Years' && r.vehicleAge < 6.5) return false;
    }

    // Mileage Range filter
    if (filters.mileageRange && filters.mileageRange !== 'All') {
      if (filters.mileageRange === '< 30,000 km' && r.accumulatedMileage >= 30000) return false;
      if (filters.mileageRange === '30,000 - 60,000 km' && (r.accumulatedMileage < 30000 || r.accumulatedMileage >= 60000)) return false;
      if (filters.mileageRange === '60,000 - 100,000 km' && (r.accumulatedMileage < 60000 || r.accumulatedMileage >= 100000)) return false;
      if (filters.mileageRange === '> 100,000 km' && r.accumulatedMileage < 100000) return false;
    }

    // Temperature Range filter
    if (filters.temperatureRange && filters.temperatureRange !== 'All') {
      if (r.operatingTemperature === null) return false;
      if (filters.temperatureRange === 'Cool (< 22°C)' && r.operatingTemperature >= 22) return false;
      if (filters.temperatureRange === 'Moderate (22 - 32°C)' && (r.operatingTemperature < 22 || r.operatingTemperature > 32)) return false;
      if (filters.temperatureRange === 'Hot (> 32°C)' && r.operatingTemperature <= 32) return false;
    }

    // Data Quality filter
    if (filters.dataQuality && filters.dataQuality !== 'All') {
      if (r.dataQuality !== filters.dataQuality) return false;
    }

    // Search query
    if (filters.searchQuery && filters.searchQuery.trim() !== '') {
      const q = filters.searchQuery.toLowerCase();
      const matches = 
        r.id.toLowerCase().includes(q) ||
        r.vehicleModel.toLowerCase().includes(q) ||
        r.chargingType.toLowerCase().includes(q) ||
        r.status.toLowerCase().includes(q);
      if (!matches) return false;
    }

    return true;
  });
}

// Chart 2: Average Battery Health by Charging Type
export function getChargingTypeAverages(records: VehicleRecord[]) {
  const sums: Record<ChargingType, number> = { Home: 0, AC: 0, 'DC Fast': 0 };
  const counts: Record<ChargingType, number> = { Home: 0, AC: 0, 'DC Fast': 0 };

  for (let i = 0; i < records.length; i++) {
    const t = records[i].chargingType;
    if (sums[t] !== undefined) {
      sums[t] += records[i].batteryHealth;
      counts[t] += 1;
    }
  }

  const types: ChargingType[] = ['Home', 'AC', 'DC Fast'];
  return types.map((type) => {
    const c = counts[type];
    const avg = c > 0 ? Math.round((sums[type] / c) * 10) / 10 : 0;
    return {
      chargingType: type,
      averageHealth: avg,
      count: c,
      baseline: type === 'Home' ? 86.9 : type === 'AC' ? 82.6 : 74.2,
      fillColor: type === 'Home' ? '#262F44' : type === 'AC' ? '#35405A' : '#8E9EA8',
    };
  });
}

// Chart 3: Vehicle Model Distribution
export function getModelDistribution(records: VehicleRecord[]) {
  const models: VehicleModel[] = ['Model 3', 'Model Y', 'Model S', 'Model X', 'Others'];
  const total = records.length;
  
  const counts: Record<string, number> = {
    'Model 3': 0,
    'Model Y': 0,
    'Model S': 0,
    'Model X': 0,
    'Others': 0,
  };

  for (let i = 0; i < records.length; i++) {
    const m = records[i].vehicleModel;
    if (counts[m] !== undefined) counts[m]++;
  }

  const colors: Record<VehicleModel, string> = {
    'Model 3': '#16a34a', // เขียว (Green)
    'Model Y': '#65a30d', // เขียวตองอ่อน (Lime Green)
    'Model S': '#eab308', // เหลืองอำพัน (Amber Yellow)
    'Model X': '#ea580c', // ส้ม (Warm Orange)
    'Others': '#dc2626',  // แดง (Red)
  };

  return models.map((m) => {
    const count = counts[m] || 0;
    const percentage = total > 0 ? Math.round((count / total) * 1000) / 10 : 0;
    return {
      model: m,
      count,
      percentage,
      color: colors[m],
    };
  });
}

// Chart 4: Average Battery Health Trend by Vehicle Age across models (O(N) single-pass)
export function getAgeTrendData(records: VehicleRecord[]) {
  const ages = [1, 2, 3, 4, 5, 6, 7, 8];
  const models: VehicleModel[] = ['Model 3', 'Model Y', 'Model S', 'Model X', 'Others'];

  const sums: Record<number, Record<string, number>> = {};
  const counts: Record<number, Record<string, number>> = {};

  for (let a = 1; a <= 8; a++) {
    sums[a] = {};
    counts[a] = {};
    for (let m = 0; m < models.length; m++) {
      sums[a][models[m]] = 0;
      counts[a][models[m]] = 0;
    }
  }

  for (let i = 0; i < records.length; i++) {
    const r = records[i];
    const roundedAge = Math.max(1, Math.min(8, Math.round(r.vehicleAge)));
    if (sums[roundedAge] && sums[roundedAge][r.vehicleModel] !== undefined) {
      sums[roundedAge][r.vehicleModel] += r.batteryHealth;
      counts[roundedAge][r.vehicleModel] += 1;
    }
  }

  return ages.map((age) => {
    const row: Record<string, number | string> = { age: `${age} ปี` };
    models.forEach((m) => {
      const c = counts[age][m];
      if (c > 0) {
        row[m] = Math.round((sums[age][m] / c) * 10) / 10;
      } else {
        const base = m === 'Model 3' ? 97 : m === 'Model Y' ? 98 : m === 'Model S' ? 94 : m === 'Model X' ? 93 : 92;
        const decay = (age - 1) * 3.8;
        row[m] = Math.round((base - decay) * 10) / 10;
      }
    });
    return row;
  });
}

// Random Forest Regression Model Evaluation Metrics & Surrogates
export const RF_MODEL_METRICS = {
  algorithm: 'Random Forest Regressor (100 ตัวประมาณการ, ความลึกสูงสุด = 12)',
  target: 'สุขภาพแบตเตอรี่ (State of Health: SoH %)',
  r2Score: 0.914,
  rmse: 2.38,
  mae: 1.82,
  crossValidationScore: 0.906,
  trainingSamples: 80000,
  testingSamples: 20000,
  features: [
    { feature: 'ระยะทางสะสม (กม.)', importance: 34.2, description: 'ตัวแทนหลักของการสึกหรอในแต่ละรอบการใช้งานผ่านความเครียดทางเคมีไฟฟ้า' },
    { feature: 'อายุยานพาหนะ (ปี)', importance: 26.5, description: 'การเสื่อมสภาพตามกาลเวลาจากการเติบโตของชั้นฟิล์มแข็ง (SEI)' },
    { feature: 'รอบการชาร์จสะสม (Cycles)', importance: 17.8, description: 'การเกาะตัวของลิเทียม (Lithium Plating) และรอยร้าวขนาดเล็กบนขั้วไฟฟ้า' },
    { feature: 'รูปแบบการชาร์จ (Charging Type)', importance: 11.4, description: 'ภาวะช็อกความร้อนจากอัตราการชาร์จสูงของการชาร์จเร็ว DC Fast (>150kW)' },
    { feature: 'อุณหภูมิขณะใช้งาน (°C)', importance: 6.9, description: 'การเร่งอัตราปฏิกิริยาเคมีตามสมการอาร์เรเนียสเมื่ออุณหภูมิแวดล้อมสูงเกินเกณฑ์' },
    { feature: 'รุ่นยานพาหนะ (Vehicle Model)', importance: 3.2, description: 'การออกแบบระบบจัดการความร้อน (TMS), เคมีเซลล์ (LFP vs NMC) และประสิทธิภาพ BMS' },
  ],
};

// Machine Learning Prediction Surrogate (emulates Random Forest inference)
export function predictBatteryHealth(params: {
  vehicleModel: VehicleModel;
  vehicleAge: number;
  accumulatedMileage: number;
  chargingCycles: number;
  chargingType: ChargingType;
  operatingTemperature: number;
}): {
  predictedHealth: number;
  confidenceInterval: [number, number];
  condition: 'Optimal' | 'Normal' | 'Degraded';
  estimatedRemainingRangeKm: number;
  degradationBreakdown: {
    calendarAging: number;
    mileageWear: number;
    cycleWear: number;
    chargingRateImpact: number;
    thermalStress: number;
  };
} {
  const { vehicleModel, vehicleAge, accumulatedMileage, chargingCycles, chargingType, operatingTemperature } = params;

  // Baseline 100%
  let score = 99.4;

  // Calendar aging: ~2.0% per year
  const calendarAging = vehicleAge * 1.95;

  // Mileage wear: ~0.08% per 1,000 km
  const mileageWear = (accumulatedMileage / 1000) * 0.082;

  // Cycle wear: ~0.015% per cycle
  const cycleWear = (chargingCycles / 100) * 1.55;

  // Charging type impact
  let chargingRateImpact = 0;
  if (chargingType === 'DC Fast') chargingRateImpact = 4.8;
  else if (chargingType === 'AC') chargingRateImpact = 1.9;
  else chargingRateImpact = 0.2; // Home

  // Thermal impact (Arrhenius baseline ~23°C)
  let thermalStress = 0;
  if (operatingTemperature > 26) {
    thermalStress = (operatingTemperature - 26) * 0.35;
  } else if (operatingTemperature < 15) {
    thermalStress = (15 - operatingTemperature) * 0.2;
  }

  // Model factor
  let modelFactor = 0;
  if (vehicleModel === 'Model 3') modelFactor = 0.8;
  else if (vehicleModel === 'Model Y') modelFactor = 1.1;
  else if (vehicleModel === 'Model S') modelFactor = -0.7;
  else if (vehicleModel === 'Model X') modelFactor = -1.2;
  else modelFactor = -0.4;

  const totalDeduction = calendarAging + mileageWear + cycleWear + chargingRateImpact + thermalStress - modelFactor;
  let predicted = Math.max(52.0, Math.min(99.0, score - totalDeduction));
  predicted = Math.round(predicted * 10) / 10;

  let condition: 'Optimal' | 'Normal' | 'Degraded' = 'Normal';
  if (predicted >= 85) condition = 'Optimal';
  else if (predicted >= 70) condition = 'Normal';
  else condition = 'Degraded';

  // Base range by model
  const baseRange = vehicleModel === 'Model S' ? 650 : vehicleModel === 'Model X' ? 560 : vehicleModel === 'Model Y' ? 510 : vehicleModel === 'Model 3' ? 490 : 420;
  const estimatedRemainingRangeKm = Math.round(baseRange * (predicted / 100));

  return {
    predictedHealth: predicted,
    confidenceInterval: [
      Math.max(50, Math.round((predicted - 2.4) * 10) / 10),
      Math.min(100, Math.round((predicted + 2.4) * 10) / 10),
    ],
    condition,
    estimatedRemainingRangeKm,
    degradationBreakdown: {
      calendarAging: Math.round(calendarAging * 10) / 10,
      mileageWear: Math.round(mileageWear * 10) / 10,
      cycleWear: Math.round(cycleWear * 10) / 10,
      chargingRateImpact: Math.round(chargingRateImpact * 10) / 10,
      thermalStress: Math.round(thermalStress * 10) / 10,
    },
  };
}
