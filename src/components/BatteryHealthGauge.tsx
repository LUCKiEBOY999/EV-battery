import React from 'react';
import { ShieldCheck, AlertTriangle, CheckCircle2, Battery, Info } from 'lucide-react';

interface BatteryHealthGaugeProps {
  currentHealth: number; // e.g. 78.4
}

export const BatteryHealthGauge: React.FC<BatteryHealthGaugeProps> = ({ currentHealth }) => {
  // Gauge angles: -180 deg to 0 deg (half circle from left to right)
  const minVal = 0;
  const maxVal = 100;
  const clampedVal = Math.max(minVal, Math.min(maxVal, currentHealth));

  // Determine condition state
  let conditionText = 'สภาพปกติ (Normal Condition)';
  let conditionColor = 'text-[#262F44] bg-[#DEE5ED] border-[#C1CCD6]';
  let arcColor = '#35405A'; // Navy Slate

  if (clampedVal < 60) {
    conditionText = 'เสื่อมสภาพขั้นวิกฤต (Critical)';
    conditionColor = 'text-[#A35252] bg-[#FDF1F1] border-[#F2D6D6]';
    arcColor = '#A35252';
  } else if (clampedVal < 70) {
    conditionText = 'ช่วงเฝ้าระวัง (Caution Range)';
    conditionColor = 'text-[#64748B] bg-[#F6F4EB] border-[#DEE5ED]';
    arcColor = '#8E9EA8';
  } else if (clampedVal >= 85) {
    conditionText = 'สภาพสมบูรณ์ดีเยี่ยม (Optimal)';
    conditionColor = 'text-[#F6F4EB] bg-[#262F44] border-[#35405A]';
    arcColor = '#262F44';
  }

  // Calculate needle angle (-180 to 0)
  const percentage = (clampedVal - minVal) / (maxVal - minVal);
  const needleAngle = -180 + percentage * 180;

  // SVG Gauge parameters
  const cx = 130;
  const cy = 125;
  const radius = 95;
  const strokeWidth = 16;

  // Helper for arc path
  const describeArc = (startAngle: number, endAngle: number) => {
    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;
    const x1 = cx + radius * Math.cos(startRad);
    const y1 = cy + radius * Math.sin(startRad);
    const x2 = cx + radius * Math.cos(endRad);
    const y2 = cy + radius * Math.sin(endRad);
    const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
    return `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`;
  };

  // Color segment arcs:
  const arcCritical = describeArc(-180, -72);
  const arcWarning = describeArc(-72, -54);
  const arcNormal = describeArc(-54, -27);
  const arcOptimal = describeArc(-27, 0);

  // Active Value Fill Arc
  const activeArc = describeArc(-180, needleAngle);

  return (
    <div
      id="chart-battery-health-gauge"
      className="bg-[#FCFAF6] rounded-xl border border-[#DEE5ED] p-4 shadow-xs flex flex-col justify-between"
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#DEE5ED]">
        <div>
          <h3 className="text-sm font-bold text-[#262F44] tracking-tight flex items-center gap-1.5 font-display">
            <Battery className="w-4 h-4 text-[#262F44]" />
            สุขภาพแบตเตอรี่ปัจจุบัน (Current Health)
          </h3>
          <p className="text-[11px] text-[#64748B]">
            ดัชนีสถานะสุขภาพแบตเตอรี่ State of Health (SoH)
          </p>
        </div>
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-[#DEE5ED] text-[#262F44] border border-[#C1CCD6] font-mono">
          <ShieldCheck className="w-3 h-3 text-[#262F44]" />
          ระบบเทเลเมทรี BMS
        </span>
      </div>

      {/* Gauge Visualization */}
      <div className="py-2 flex flex-col items-center justify-center relative">
        <svg viewBox="0 0 260 145" className="w-64 h-36 overflow-visible">
          <defs>
            <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#A35252" />
              <stop offset="55%" stopColor="#8E9EA8" />
              <stop offset="75%" stopColor="#35405A" />
              <stop offset="100%" stopColor="#262F44" />
            </linearGradient>
            <filter id="needleShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="1" dy="2" stdDeviation="2" floodOpacity="0.25" />
            </filter>
          </defs>

          {/* Background Track segments */}
          <path d={arcCritical} fill="none" stroke="#F4ECE6" strokeWidth={strokeWidth} strokeLinecap="round" />
          <path d={arcWarning} fill="none" stroke="#EDE8E1" strokeWidth={strokeWidth} />
          <path d={arcNormal} fill="none" stroke="#DEE5ED" strokeWidth={strokeWidth} />
          <path d={arcOptimal} fill="none" stroke="#C1CCD6" strokeWidth={strokeWidth} strokeLinecap="round" />

          {/* Active Value Colored Arc */}
          <path
            d={activeArc}
            fill="none"
            stroke="url(#gaugeGradient)"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            className="transition-all duration-700 ease-out"
          />

          {/* Needle Center Pivot */}
          <circle cx={cx} cy={cy} r="10" fill="#262F44" />
          <circle cx={cx} cy={cy} r="4" fill="#F6F4EB" />

          {/* Needle Pointer */}
          <g
            transform={`rotate(${needleAngle + 90}, ${cx}, ${cy})`}
            className="transition-transform duration-700 ease-out"
            filter="url(#needleShadow)"
          >
            <polygon
              points={`${cx - 3.5},${cy} ${cx},${cy - 82} ${cx + 3.5},${cy}`}
              fill="#262F44"
            />
            <circle cx={cx} cy={cy - 74} r="3" fill="#C1CCD6" />
          </g>

          {/* Scale Markers */}
          <text x="36" y="132" fontSize="9" fill="#8E9EA8" fontWeight="600" textAnchor="middle">0%</text>
          <text x="76" y="60" fontSize="9" fill="#8E9EA8" fontWeight="600" textAnchor="middle">60%</text>
          <text x="130" y="30" fontSize="9" fill="#8E9EA8" fontWeight="600" textAnchor="middle">80%</text>
          <text x="225" y="132" fontSize="9" fill="#8E9EA8" fontWeight="600" textAnchor="middle">100%</text>
        </svg>

        {/* Big Health Percentage Number */}
        <div className="text-center -mt-2">
          <div className="text-3xl font-extrabold text-[#262F44] tracking-tight font-display">
            {clampedVal.toFixed(1)}%
          </div>
          {/* Below Gauge: Normal Condition */}
          <div className="mt-1">
            <span
              id="gauge-condition-label"
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${conditionColor}`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              {conditionText}
            </span>
          </div>

          {/* Mini EV Car Silhouette with glowing chassis battery pack */}
          <div className="mt-3 p-2 rounded-lg bg-[#F6F4EB] border border-[#DEE5ED] flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <svg className="w-14 h-8 text-[#262F44] shrink-0" viewBox="0 0 100 45" fill="none">
                {/* EV Car Body Outline */}
                <path
                  d="M10,32 L22,32 L26,22 L45,12 L72,12 L84,22 L94,24 C96,25 97,27 97,29 L97,32 L88,32"
                  stroke="#35405A"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {/* Windows */}
                <path
                  d="M44,15 L70,15 L79,22 L44,22 Z"
                  fill="#8E9EA8"
                  opacity="0.35"
                />
                {/* Wheels */}
                <circle cx="22" cy="32" r="6" fill="#262F44" stroke="#8E9EA8" strokeWidth="2" />
                <circle cx="22" cy="32" r="2.5" fill="#F6F4EB" />
                <circle cx="82" cy="32" r="6" fill="#262F44" stroke="#8E9EA8" strokeWidth="2" />
                <circle cx="82" cy="32" r="2.5" fill="#F6F4EB" />
                {/* Skateboard Battery Pack Glow Under Car Floor */}
                <rect
                  x="30"
                  y="30"
                  width="44"
                  height="4.5"
                  rx="1.5"
                  fill={arcColor}
                  className="animate-pulse"
                />
              </svg>
              <div className="text-left">
                <span className="text-[10px] font-bold text-[#262F44] block leading-tight font-display">
                  โครงสร้างแบตเตอรี่ใต้ท้องรถ (EV Skateboard)
                </span>
                <span className="text-[9px] text-[#64748B]">
                  สถานะเซลล์: {clampedVal >= 70 ? 'สมบูรณ์ (Balanced)' : 'เริ่มเสื่อมสภาพ'}
                </span>
              </div>
            </div>
            <span
              className="text-[10px] font-bold px-1.5 py-0.5 rounded font-mono bg-[#DEE5ED] text-[#262F44] border border-[#C1CCD6]"
            >
              {clampedVal.toFixed(1)}%
            </span>
          </div>
        </div>
      </div>

      {/* Recommended Healthy Range & Thresholds */}
      <div className="mt-2 pt-2 border-t border-[#DEE5ED] space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <span className="text-[#64748B] font-medium">เกณฑ์สุขภาพที่แนะนำ (Healthy Range):</span>
          <span className="font-bold text-[#262F44] font-mono bg-[#DEE5ED] px-2 py-0.5 rounded border border-[#C1CCD6]">
            60–100%
          </span>
        </div>

        <div className="flex items-center justify-between text-[11px] text-[#8E9EA8]">
          <span>เกณฑ์รับประกันโรงงาน: &lt; 70% SoH</span>
          <span>ค่าออกแบบสูงสุด: 100%</span>
        </div>
      </div>
    </div>
  );
};
