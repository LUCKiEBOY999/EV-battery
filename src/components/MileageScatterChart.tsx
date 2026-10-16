import React, { useMemo, useState } from 'react';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceLine,
} from 'recharts';
import { VehicleRecord, ChargingType } from '../types';
import { Info } from 'lucide-react';

interface MileageScatterChartProps {
  data: VehicleRecord[];
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: VehicleRecord;
  }>;
}

const CustomScatterTooltip: React.FC<CustomTooltipProps> = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const d = payload[0].payload;
    const chargeLabel = d.chargingType === 'Home' ? 'ชาร์จบ้าน' : d.chargingType === 'AC' ? 'AC' : 'DC Fast';
    return (
      <div className="bg-[#262F44] text-[#F6F4EB] p-2.5 rounded-lg shadow-xl border border-[#35405A] text-xs z-50">
        <div className="font-bold text-[#F6F4EB] flex items-center justify-between gap-3 border-b border-[#35405A] pb-1 mb-1.5 font-display">
          <span>{d.id} ({d.vehicleModel})</span>
          <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${
            d.chargingType === 'Home' ? 'bg-[#16a34a]/20 text-[#22c55e]' :
            d.chargingType === 'AC' ? 'bg-[#eab308]/20 text-[#facc15]' : 'bg-[#dc2626]/20 text-[#f87171]'
          }`}>
            {chargeLabel}
          </span>
        </div>
        <div className="space-y-0.5 text-[#C1CCD6]">
          <div className="flex justify-between gap-4">
            <span className="text-[#C1CCD6]/80">สุขภาพแบตเตอรี่ (SoH):</span>
            <span className="font-bold text-[#F6F4EB] font-mono">{d.batteryHealth}%</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-[#C1CCD6]/80">ระยะทางสะสม:</span>
            <span className="font-mono text-[#F6F4EB]">{d.accumulatedMileage.toLocaleString()} กม.</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-[#C1CCD6]/80">อายุยานพาหนะ:</span>
            <span className="text-[#F6F4EB]">{d.vehicleAge} ปี</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-[#C1CCD6]/80">อุณหภูมิใช้งาน:</span>
            <span className="text-[#F6F4EB]">{d.operatingTemperature}°C</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export const MileageScatterChart: React.FC<MileageScatterChartProps> = ({ data }) => {
  const [selectedType, setSelectedType] = useState<string>('All');

  // Downsample to max 300 points for smooth canvas rendering while preserving distribution
  const sampledData = useMemo(() => {
    let source = data;
    if (selectedType !== 'All') {
      source = source.filter((r) => r.chargingType === selectedType);
    }
    if (source.length <= 320) return source;
    const step = Math.ceil(source.length / 300);
    return source.filter((_, idx) => idx % step === 0);
  }, [data, selectedType]);

  const acData = useMemo(() => sampledData.filter((r) => r.chargingType === 'AC'), [sampledData]);
  const dcFastData = useMemo(() => sampledData.filter((r) => r.chargingType === 'DC Fast'), [sampledData]);
  const homeData = useMemo(() => sampledData.filter((r) => r.chargingType === 'Home'), [sampledData]);

  const filterButtons = [
    { type: 'All', label: 'ทั้งหมด' },
    { type: 'Home', label: 'ชาร์จบ้าน' },
    { type: 'AC', label: 'AC' },
    { type: 'DC Fast', label: 'DC Fast' },
  ];

  return (
    <div
      id="chart-mileage-scatter"
      className="bg-[#FCFAF6] rounded-xl border border-[#DEE5ED] p-4 shadow-xs flex flex-col justify-between"
    >
      {/* Chart Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#DEE5ED] gap-2">
        <div>
          <h3 className="text-sm font-bold text-[#262F44] tracking-tight flex items-center gap-1.5 font-display">
            ความสัมพันธ์ระหว่างระยะทางสะสมและสุขภาพแบตเตอรี่
          </h3>
          <p className="text-[11px] text-[#64748B]">
            การกระจายตัวแบบ Scatter แสดงอัตราความชันการเสื่อมสภาพเมื่อเทียบกับระยะทางวิ่งสะสม
          </p>
        </div>

        {/* Legend / Quick Filter pill buttons */}
        <div className="flex items-center gap-1.5 shrink-0">
          {filterButtons.map(({ type, label }) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                selectedType === type
                  ? 'bg-[#262F44] text-[#F6F4EB] shadow-2xs'
                  : 'bg-[#F6F4EB] text-[#35405A] hover:bg-[#DEE5ED] border border-[#DEE5ED]'
              }`}
            >
              {type === 'Home' && <span className="inline-block w-2 h-2 rounded-full bg-[#16a34a] mr-1"></span>}
              {type === 'AC' && <span className="inline-block w-2 h-2 rounded-full bg-[#eab308] mr-1"></span>}
              {type === 'DC Fast' && <span className="inline-block w-2 h-2 rounded-full bg-[#dc2626] mr-1"></span>}
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Scatter Plot */}
      <div className="w-full h-72 pt-3">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 10, right: 20, bottom: 20, left: -5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#DEE5ED" vertical={false} />
            <XAxis
              type="number"
              dataKey="accumulatedMileage"
              name="ระยะทางสะสม"
              unit=" กม."
              domain={[0, 140000]}
              tick={{ fontSize: 10, fill: '#64748B' }}
              axisLine={{ stroke: '#C1CCD6' }}
              tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
              label={{
                value: 'ระยะทางสะสม (กม.)',
                position: 'insideBottom',
                offset: -12,
                fontSize: 11,
                fill: '#35405A',
                fontWeight: 500,
              }}
            />
            <YAxis
              type="number"
              dataKey="batteryHealth"
              name="สุขภาพแบตเตอรี่"
              unit="%"
              domain={[50, 100]}
              tick={{ fontSize: 10, fill: '#64748B' }}
              axisLine={{ stroke: '#C1CCD6' }}
              label={{
                value: 'สุขภาพแบตเตอรี่ (%)',
                angle: -90,
                position: 'insideLeft',
                offset: 15,
                fontSize: 11,
                fill: '#35405A',
                fontWeight: 500,
              }}
            />
            <Tooltip content={<CustomScatterTooltip />} />
            <ReferenceLine y={70} stroke="#dc2626" strokeDasharray="3 3" label={{ value: 'วิกฤต 70%', fill: '#dc2626', fontSize: 10, position: 'right' }} />
            <ReferenceLine y={80} stroke="#16a34a" strokeDasharray="3 3" label={{ value: 'สมบูรณ์ 80%', fill: '#16a34a', fontSize: 10, position: 'right' }} />

            {/* Home Charging - Green */}
            <Scatter
              name="ชาร์จบ้าน"
              data={homeData}
              fill="#16a34a"
              fillOpacity={0.75}
              shape="circle"
            />
            {/* AC Charging - Yellow/Amber */}
            <Scatter
              name="AC"
              data={acData}
              fill="#eab308"
              fillOpacity={0.8}
              shape="circle"
            />
            {/* DC Fast Charging - Red */}
            <Scatter
              name="DC Fast"
              data={dcFastData}
              fill="#dc2626"
              fillOpacity={0.8}
              shape="circle"
            />
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      {/* Footer Info / Insight */}
      <div className="mt-2 pt-2 border-t border-[#DEE5ED] flex items-center justify-between text-[11px] text-[#64748B]">
        <div className="flex items-center gap-1 text-[#35405A]">
          <Info className="w-3.5 h-3.5 text-[#262F44] shrink-0" />
          <span>สหสัมพันธ์เชิงลบอย่างมีนัยสำคัญ (<strong className="font-semibold text-[#262F44]">r = -0.76</strong>) การชาร์จเร็ว DC ส่งผลให้อัตราเสื่อมสภาพชันขึ้นชัดเจน</span>
        </div>
        <span className="font-mono text-[10px] text-[#64748B]">n = {sampledData.length} จุด</span>
      </div>
    </div>
  );
};
