import React, { useState, useMemo } from 'react';
import { Car, Zap, BatteryCharging, Gauge, ArrowUpRight, Wind, ShieldAlert, CheckCircle2, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { VehicleRecord, VehicleModel } from '../types';
import evCarImg from '../assets/images/ev_car_showcase_1789101036451.jpg';

interface EVModelShowcaseCardProps {
  data: VehicleRecord[];
  onSelectModel?: (model: VehicleModel) => void;
}

export const EVModelShowcaseCard: React.FC<EVModelShowcaseCardProps> = ({ data, onSelectModel }) => {
  const [selectedModel, setSelectedModel] = useState<VehicleModel>('Model 3');

  // Compute model specific statistics from current active filtered dataset
  const modelStats = useMemo(() => {
    const records = data.filter((v) => v.vehicleModel === selectedModel);
    if (records.length === 0) {
      return {
        count: 0,
        avgHealth: 0,
        avgMileage: 0,
        avgAge: 0,
        dcPercent: 0,
        avgTemp: 0,
      };
    }
    const count = records.length;
    const avgHealth = records.reduce((s, v) => s + v.batteryHealth, 0) / count;
    const avgMileage = records.reduce((s, v) => s + v.accumulatedMileage, 0) / count;
    const avgAge = records.reduce((s, v) => s + v.vehicleAge, 0) / count;
    const dcCount = records.filter((v) => v.chargingType === 'DC Fast').length;
    const dcPercent = Math.round((dcCount / count) * 100);
    const avgTemp = records.reduce((s, v) => s + v.operatingTemperature, 0) / count;

    return {
      count,
      avgHealth,
      avgMileage,
      avgAge,
      dcPercent,
      avgTemp,
    };
  }, [data, selectedModel]);

  const modelMetadata: Record<VehicleModel, {
    fullName: string;
    batteryType: string;
    capacity: string;
    maxChargingSpeed: string;
    dragCoefficient: string;
    driveType: string;
  }> = {
    'Model 3': {
      fullName: 'Tesla Model 3 Long Range',
      batteryType: 'Lithium Nickel Cobalt Aluminum (NCA)',
      capacity: '78.1 kWh',
      maxChargingSpeed: '250 kW DC Fast',
      dragCoefficient: 'Cd 0.23',
      driveType: 'Dual Motor All-Wheel Drive (AWD)',
    },
    'Model Y': {
      fullName: 'Tesla Model Y Performance',
      batteryType: 'Lithium Nickel Manganese Cobalt (NMC 811)',
      capacity: '82.0 kWh',
      maxChargingSpeed: '250 kW DC Fast',
      dragCoefficient: 'Cd 0.23',
      driveType: 'Dual Motor AWD Crossover',
    },
    'Model S': {
      fullName: 'Tesla Model S Plaid / Long Range',
      batteryType: 'High-Density Lithium-Ion Matrix',
      capacity: '100.0 kWh',
      maxChargingSpeed: '250 kW DC Fast',
      dragCoefficient: 'Cd 0.208',
      driveType: 'Tri-Motor All-Wheel Drive',
    },
    'Model X': {
      fullName: 'Tesla Model X Long Range SUV',
      batteryType: 'Extended Range Pack with Thermal Jacket',
      capacity: '100.0 kWh',
      maxChargingSpeed: '250 kW DC Fast',
      dragCoefficient: 'Cd 0.24',
      driveType: 'Dual Motor Full-Size SUV',
    },
    'Others': {
      fullName: 'EV Multi-Brand Fleet (BYD, Porsche, Hyundai)',
      batteryType: 'LFP Blade Battery / 800V NMC',
      capacity: '60 – 93.4 kWh',
      maxChargingSpeed: '150 – 350 kW Ultra-Fast',
      dragCoefficient: 'Cd 0.22 – 0.26',
      driveType: 'Rear-Wheel / All-Wheel Drive',
    },
  };

  const meta = modelMetadata[selectedModel];
  const modelsList: VehicleModel[] = ['Model 3', 'Model Y', 'Model S', 'Model X', 'Others'];

  return (
    <div 
      id="ev-model-showcase-card"
      className="bg-[#FCFAF6] rounded-xl border border-[#DEE5ED] shadow-xs overflow-hidden relative"
    >
      {/* Visual Background Accent */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#DEE5ED]/30 rounded-full blur-3xl pointer-events-none -z-0" />

      <div className="grid grid-cols-1 lg:grid-cols-12 relative z-10">
        {/* Left Side: EV Car Image Studio Render with Specs Overlay */}
        <div className="lg:col-span-6 xl:col-span-5 relative bg-[#262F44] overflow-hidden flex flex-col justify-between min-h-[260px] p-4 text-[#F6F4EB]">
          <img 
            src={evCarImg} 
            alt="Aerodynamic Modern EV Sedan"
            referrerPolicy="no-referrer"
            className="absolute inset-0 w-full h-full object-cover object-center opacity-85 hover:scale-105 transition-transform duration-700 pointer-events-none" 
          />
          {/* Vignette Gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#262F44] via-[#262F44]/40 to-transparent pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#262F44]/60 via-transparent to-transparent pointer-events-none" />

          {/* Top badges on image */}
          <div className="relative z-10 flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#262F44]/90 backdrop-blur-xs text-[#F6F4EB] border border-[#DEE5ED]/30 shadow-xs">
              <Car className="w-3.5 h-3.5" />
              {meta.fullName}
            </span>
            <span className="inline-flex items-center gap-1 text-[10px] font-mono font-semibold bg-black/60 backdrop-blur-xs px-2 py-0.5 rounded border border-white/15 text-[#DEE5ED]">
              <Wind className="w-3 h-3 text-[#DEE5ED]" />
              {meta.dragCoefficient}
            </span>
          </div>

          {/* Bottom callout on image */}
          <div className="relative z-10 mt-auto pt-8">
            <div className="text-[11px] text-[#C1CCD6] font-medium">
              สถาปัตยกรรมตัวรถและการจัดการพลังงาน
            </div>
            <div className="text-sm font-bold text-[#F6F4EB] flex items-center gap-2 font-display">
              <span>{meta.driveType}</span>
              <span className="text-[#DEE5ED]">•</span>
              <span className="text-[#DEE5ED] font-mono text-xs">{meta.capacity}</span>
            </div>
            <div className="mt-2 flex items-center gap-2 text-[10px] text-[#C1CCD6] font-mono">
              <span className="px-2 py-0.5 rounded bg-white/10 border border-white/10 text-[#F6F4EB] flex items-center gap-1">
                <Zap className="w-2.5 h-2.5" />
                {meta.maxChargingSpeed}
              </span>
              <span className="px-2 py-0.5 rounded bg-white/10 border border-white/10 text-[#DEE5ED]">
                Liquid Cooled BMS
              </span>
            </div>
          </div>
        </div>

        {/* Right Side: Interactive Model Tabs & Real Fleet Telemetry */}
        <div className="lg:col-span-6 xl:col-span-7 p-5 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#DEE5ED]">
              <div>
                <h3 className="text-sm font-bold text-[#262F44] flex items-center gap-1.5 font-display">
                  <Sparkles className="w-4 h-4 text-[#262F44]" />
                  มุมมองยานยนต์ในฟลีทและการติดตามประสิทธิภาพ (Fleet Telemetry)
                </h3>
                <p className="text-[11px] text-[#64748B]">
                  เลือกรุ่นรถเพื่อดูภาพถ่ายสเปกวิศวกรรมและสถิติสุขภาพแบตเตอรี่จริงจากฐานข้อมูล
                </p>
              </div>

              {/* Model Switcher Chips */}
              <div className="flex flex-wrap items-center gap-1 bg-[#F6F4EB] p-1 rounded-lg border border-[#DEE5ED]">
                {modelsList.map((m) => (
                  <button
                    key={m}
                    onClick={() => {
                      setSelectedModel(m);
                      if (onSelectModel) onSelectModel(m);
                    }}
                    className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                      selectedModel === m
                        ? 'bg-[#262F44] text-[#F6F4EB] shadow-xs'
                        : 'text-[#64748B] hover:text-[#262F44] hover:bg-[#DEE5ED]'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            {/* Model Real-Time Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
              <div className="bg-[#F6F4EB] p-3 rounded-xl border border-[#DEE5ED]">
                <span className="text-[10px] text-[#64748B] block font-medium">จำนวนในฟลีท</span>
                <span className="text-lg font-bold text-[#262F44] font-mono">
                  {modelStats.count.toLocaleString()} <span className="text-xs font-normal text-[#64748B]">คัน</span>
                </span>
                <span className="text-[9px] text-[#35405A] font-medium block mt-0.5">
                  {data.length > 0 ? ((modelStats.count / data.length) * 100).toFixed(1) : 0}% ของที่แสดง
                </span>
              </div>

              <div className="bg-[#DEE5ED]/50 p-3 rounded-xl border border-[#C1CCD6]">
                <span className="text-[10px] text-[#262F44] block font-medium">สุขภาพแบตเฉลี่ย</span>
                <span className="text-lg font-bold text-[#262F44] font-mono">
                  {modelStats.avgHealth > 0 ? modelStats.avgHealth.toFixed(1) : 0}%
                </span>
                <span className="text-[9px] text-[#35405A] font-medium block mt-0.5">
                  {modelStats.avgHealth >= 75 ? 'สภาพสมบูรณ์' : 'ช่วงเฝ้าระวัง'}
                </span>
              </div>

              <div className="bg-[#F6F4EB] p-3 rounded-xl border border-[#DEE5ED]">
                <span className="text-[10px] text-[#64748B] block font-medium">ระยะทางเฉลี่ย</span>
                <span className="text-lg font-bold text-[#262F44] font-mono">
                  {modelStats.avgMileage > 0 ? Math.round(modelStats.avgMileage).toLocaleString() : 0}
                </span>
                <span className="text-[9px] text-[#64748B] font-medium block mt-0.5">
                  กิโลเมตร
                </span>
              </div>

              <div className="bg-[#DEE5ED]/40 p-3 rounded-xl border border-[#DEE5ED]">
                <span className="text-[10px] text-[#262F44] block font-medium">สัดส่วนชาร์จ DC Fast</span>
                <span className="text-lg font-bold text-[#262F44] font-mono">
                  {modelStats.dcPercent}%
                </span>
                <span className="text-[9px] text-[#8E9EA8] font-medium block mt-0.5">
                  มีผลเร่งการเสื่อมสภาพ
                </span>
              </div>
            </div>
          </div>

          {/* Battery Chemistry & Engineering Note Footer */}
          <div className="pt-3 border-t border-[#DEE5ED] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-[#64748B]">
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-[#262F44]">เคมีเซลล์แบตเตอรี่:</span>
              <span className="text-[#262F44] font-mono bg-[#DEE5ED] px-2 py-0.5 rounded border border-[#C1CCD6]">
                {meta.batteryType}
              </span>
            </div>
            <div className="flex items-center gap-2 font-mono text-[10px] text-[#8E9EA8]">
              <span>อายุเฉลี่ย: {modelStats.avgAge.toFixed(1)} ปี</span>
              <span>•</span>
              <span>อุณหภูมิใช้งาน: {modelStats.avgTemp.toFixed(1)}°C</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
