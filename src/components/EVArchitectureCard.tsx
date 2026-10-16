import React, { useState } from 'react';
import { Layers, Zap, Thermometer, ShieldCheck, Activity, Cpu, Sparkles, ChevronRight, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import evChassisImg from '../assets/images/ev_battery_chassis_1789101015010.jpg';

interface EVArchitectureCardProps {
  currentAvgHealth?: number;
}

export const EVArchitectureCard: React.FC<EVArchitectureCardProps> = ({ currentAvgHealth = 81.4 }) => {
  const [activeHighlight, setActiveHighlight] = useState<'battery' | 'thermal' | 'motor' | 'bms'>('battery');

  const highlights = {
    battery: {
      title: 'Skateboard Battery Pack (CTP)',
      desc: 'แผงเซลล์ลิเธียมไอออนโครงสร้าง Cell-to-Pack บรรจุใต้ท้องรถ กระจายน้ำหนัก 50:50 และเสริมความแข็งแกร่งด้านโครงสร้าง',
      metric: '60 – 100 kWh',
      status: 'Normal Cell Balance',
      color: 'blue',
    },
    thermal: {
      title: 'Liquid Cooling Thermal Loop',
      desc: 'ท่อระบายความร้อนด้วยสารหล่อเย็นไหลผ่านทุกโมดูลเซลล์ ควบคุมอุณหภูมิให้อยู่ในช่วง 25°C–32°C ช่วยชะลอการเสื่อมสภาพ',
      metric: 'Active 28.4°C',
      status: 'Optimal Heat Exchanger',
      color: 'cyan',
    },
    motor: {
      title: 'Permanent Magnet Motors & Inverter',
      desc: 'มอเตอร์ไฟฟ้าซิงโครนัสแม่เหล็กถาวร (PMSM) ขับเคลื่อนล้อหน้าและหลัง พร้อมอินเวอร์เตอร์ซิลิกอนคาร์ไบด์ (SiC)',
      metric: '320 kW Peak',
      status: '96.2% Energy Efficiency',
      color: 'amber',
    },
    bms: {
      title: 'High-Precision BMS Controller',
      desc: 'ระบบจัดการแบตเตอรี่ตรวจวัดกระแส แรงดัน และความต้านทานภายในเซลล์ทุก 10ms ป้องกันการเกิด Lithium Plating',
      metric: 'SoH Sensor Active',
      status: `${currentAvgHealth.toFixed(1)}% SoH Tracking`,
      color: 'emerald',
    },
  };

  const current = highlights[activeHighlight];

  return (
    <div
      id="ev-architecture-telemetry-card"
      className="bg-[#FCFAF6] rounded-xl border border-[#DEE5ED] shadow-xs overflow-hidden flex flex-col"
    >
      {/* Header */}
      <div className="p-4 pb-3 border-b border-[#DEE5ED] flex items-center justify-between bg-[#F6F4EB]">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#DEE5ED] text-[#262F44] flex items-center justify-center">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-[#262F44] tracking-tight flex items-center gap-1.5 font-display">
              โครงสร้างสถาปัตยกรรมตัวรถ EV
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-[#DEE5ED] text-[#262F44] font-mono border border-[#C1CCD6]">
                3D Cutaway
              </span>
            </h3>
            <p className="text-[10px] text-[#64748B]">
              ระบบแบตเตอรี่ใต้ท้องรถและระบบขับเคลื่อน
            </p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#262F44] bg-[#DEE5ED] px-2 py-0.5 rounded-full border border-[#C1CCD6]">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          Telematics
        </span>
      </div>

      {/* 3D Cutaway Image with interactive hotspots */}
      <div className="relative w-full aspect-16/10 bg-slate-950 overflow-hidden group">
        <img
          src={evChassisImg}
          alt="EV Skateboard Chassis 3D Cutaway"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
        />

        {/* Ambient Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/20 pointer-events-none" />

        {/* Hotspot buttons on the car image */}
        <div className="absolute inset-0 pointer-events-auto">
          {/* 1. Battery Pack Hotspot */}
          <button
            onClick={() => setActiveHighlight('battery')}
            className={`absolute top-[62%] left-[48%] -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full flex items-center justify-center cursor-pointer transition-all ${
              activeHighlight === 'battery'
                ? 'bg-[#262F44] text-[#F6F4EB] ring-4 ring-[#DEE5ED]/60 scale-125'
                : 'bg-white/90 text-[#262F44] hover:bg-[#262F44] hover:text-[#F6F4EB] shadow-md'
            }`}
            title="คลิกดูรายละเอียด แบตเตอรี่ Skateboard Pack"
          >
            <Zap className="w-3.5 h-3.5" />
          </button>

          {/* 2. Thermal Loop Hotspot */}
          <button
            onClick={() => setActiveHighlight('thermal')}
            className={`absolute top-[48%] left-[62%] -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full flex items-center justify-center cursor-pointer transition-all ${
              activeHighlight === 'thermal'
                ? 'bg-[#35405A] text-[#F6F4EB] ring-4 ring-[#DEE5ED]/60 scale-125'
                : 'bg-white/90 text-[#35405A] hover:bg-[#35405A] hover:text-[#F6F4EB] shadow-md'
            }`}
            title="คลิกดูรายละเอียด ระบบระบายความร้อน Liquid Thermal"
          >
            <Thermometer className="w-3.5 h-3.5" />
          </button>

          {/* 3. Motor & Inverter Hotspot */}
          <button
            onClick={() => setActiveHighlight('motor')}
            className={`absolute top-[66%] left-[26%] -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full flex items-center justify-center cursor-pointer transition-all ${
              activeHighlight === 'motor'
                ? 'bg-[#8E9EA8] text-[#262F44] ring-4 ring-[#DEE5ED]/60 scale-125'
                : 'bg-white/90 text-[#262F44] hover:bg-[#8E9EA8] hover:text-[#262F44] shadow-md'
            }`}
            title="คลิกดูรายละเอียด มอเตอร์ไฟฟ้าและอินเวอร์เตอร์"
          >
            <Activity className="w-3.5 h-3.5" />
          </button>

          {/* 4. BMS Controller Hotspot */}
          <button
            onClick={() => setActiveHighlight('bms')}
            className={`absolute top-[35%] left-[38%] -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full flex items-center justify-center cursor-pointer transition-all ${
              activeHighlight === 'bms'
                ? 'bg-[#262F44] text-[#F6F4EB] ring-4 ring-[#DEE5ED]/60 scale-125'
                : 'bg-white/90 text-[#262F44] hover:bg-[#262F44] hover:text-[#F6F4EB] shadow-md'
            }`}
            title="คลิกดูรายละเอียด กล่องควบคุมระบบ BMS"
          >
            <Cpu className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Bottom Banner on the image */}
        <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-white/90 pointer-events-none">
          <span className="text-[10px] font-mono font-bold tracking-wider uppercase bg-[#262F44]/80 backdrop-blur-xs px-2 py-0.5 rounded border border-[#DEE5ED]/20 text-[#F6F4EB]">
            EV Platform Architecture
          </span>
          <span className="text-[10px] font-medium text-[#DEE5ED]">
            คลิกที่จุดเพื่อดูส่วนประกอบ
          </span>
        </div>
      </div>

      {/* Component Selection Pills */}
      <div className="grid grid-cols-4 p-1.5 bg-[#F6F4EB] border-b border-[#DEE5ED] gap-1 text-[10px] font-semibold">
        <button
          onClick={() => setActiveHighlight('battery')}
          className={`py-1 rounded text-center transition-colors cursor-pointer ${
            activeHighlight === 'battery'
              ? 'bg-[#262F44] text-[#F6F4EB] shadow-2xs font-bold'
              : 'text-[#64748B] hover:text-[#262F44]'
          }`}
        >
          ⚡ แบตเตอรี่
        </button>
        <button
          onClick={() => setActiveHighlight('thermal')}
          className={`py-1 rounded text-center transition-colors cursor-pointer ${
            activeHighlight === 'thermal'
              ? 'bg-[#262F44] text-[#F6F4EB] shadow-2xs font-bold'
              : 'text-[#64748B] hover:text-[#262F44]'
          }`}
        >
          ❄️ หล่อเย็น
        </button>
        <button
          onClick={() => setActiveHighlight('motor')}
          className={`py-1 rounded text-center transition-colors cursor-pointer ${
            activeHighlight === 'motor'
              ? 'bg-[#262F44] text-[#F6F4EB] shadow-2xs font-bold'
              : 'text-[#64748B] hover:text-[#262F44]'
          }`}
        >
          ⚙️ มอเตอร์
        </button>
        <button
          onClick={() => setActiveHighlight('bms')}
          className={`py-1 rounded text-center transition-colors cursor-pointer ${
            activeHighlight === 'bms'
              ? 'bg-[#262F44] text-[#F6F4EB] shadow-2xs font-bold'
              : 'text-[#64748B] hover:text-[#262F44]'
          }`}
        >
          🧠 กล่อง BMS
        </button>
      </div>

      {/* Active Part Details */}
      <div className="p-3.5 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h4 className="text-xs font-bold text-[#262F44] flex items-center gap-1.5 font-display">
              {current.title}
            </h4>
            <p className="text-[11px] text-[#64748B] leading-relaxed mt-0.5">
              {current.desc}
            </p>
          </div>
        </div>

        {/* Live specs pill strip */}
        <div className="flex items-center justify-between pt-2 border-t border-[#DEE5ED] text-[10px]">
          <span className="font-mono font-bold text-[#262F44] bg-[#DEE5ED] px-2 py-0.5 rounded border border-[#C1CCD6]">
            สเปก: {current.metric}
          </span>
          <span className="text-[#262F44] font-semibold flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-[#262F44]" />
            {current.status}
          </span>
        </div>
      </div>
    </div>
  );
};
