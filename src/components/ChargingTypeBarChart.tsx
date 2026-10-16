import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LabelList,
} from 'recharts';
import { VehicleRecord } from '../types';
import { getChargingTypeAverages } from '../data/evData';
import { Zap } from 'lucide-react';

interface ChargingTypeBarChartProps {
  data: VehicleRecord[];
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: {
      chargingType: string;
      averageHealth: number;
      count: number;
      baseline: number;
    };
  }>;
}

const CustomBarTooltip: React.FC<CustomTooltipProps> = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const d = payload[0].payload;
    const typeThai = d.chargingType === 'Home' ? 'ชาร์จที่บ้าน (Home)' : d.chargingType === 'AC' ? 'กระแสสลับ (AC)' : 'ชาร์จเร็ว (DC Fast)';
    return (
      <div className="bg-[#262F44] text-[#F6F4EB] p-2.5 rounded-lg shadow-xl border border-[#35405A] text-xs">
        <div className="font-bold text-[#F6F4EB] flex items-center gap-1.5 border-b border-[#35405A] pb-1 mb-1.5 font-display">
          <Zap className="w-3.5 h-3.5 text-[#C1CCD6]" />
          การชาร์จ: {typeThai}
        </div>
        <div className="space-y-1">
          <div className="flex justify-between gap-4">
            <span className="text-[#C1CCD6]">สุขภาพแบตเตอรี่เฉลี่ย:</span>
            <span className="font-bold text-[#F6F4EB] font-mono">{d.averageHealth}%</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-[#C1CCD6]">เกณฑ์เป้าหมายมาตรฐาน:</span>
            <span className="font-mono text-[#C1CCD6]">{d.baseline}%</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-[#C1CCD6]">จำนวนตัวอย่าง:</span>
            <span className="font-mono text-[#C1CCD6]">{d.count} คัน</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export const ChargingTypeBarChart: React.FC<ChargingTypeBarChartProps> = ({ data }) => {
  const rawChartData = getChargingTypeAverages(data);
  const chartData = rawChartData.map((d) => ({
    ...d,
    chargingTypeLabel: d.chargingType === 'Home' ? 'ชาร์จบ้าน' : d.chargingType === 'AC' ? 'AC' : 'DC Fast',
  }));

  return (
    <div
      id="chart-charging-type-bar"
      className="bg-[#FCFAF6] rounded-xl border border-[#DEE5ED] p-4 shadow-xs flex flex-col justify-between"
    >
      {/* Chart Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#DEE5ED]">
        <div>
          <h3 className="text-sm font-bold text-[#262F44] tracking-tight font-display">
            สุขภาพแบตเตอรี่เฉลี่ยตามรูปแบบการชาร์จ
          </h3>
          <p className="text-[11px] text-[#64748B]">
            ผลกระทบของอัตราการชาร์จ (C-rate) ต่อสถานะสุขภาพแบตเตอรี่ (SoH)
          </p>
        </div>
        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#DEE5ED] text-[#262F44] border border-[#C1CCD6] font-mono">
          เชิงกลุ่ม
        </span>
      </div>

      {/* Bar Chart */}
      <div className="w-full h-72 pt-3">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 20, bottom: 20, left: -10 }}
            barCategoryGap={32}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#DEE5ED" vertical={false} />
            <XAxis
              dataKey="chargingTypeLabel"
              tick={{ fontSize: 11, fill: '#262F44', fontWeight: 600 }}
              axisLine={{ stroke: '#C1CCD6' }}
            />
            <YAxis
              domain={[60, 100]}
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
            <Tooltip content={<CustomBarTooltip />} />
            <Bar dataKey="averageHealth" radius={[6, 6, 0, 0]}>
              <LabelList
                dataKey="averageHealth"
                position="top"
                formatter={(val: number) => `${val.toFixed(1)}%`}
                style={{ fontSize: 11, fontWeight: 700, fill: '#262F44' }}
              />
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fillColor} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Mini Comparative Badges */}
      <div className="mt-2 pt-2 border-t border-[#DEE5ED] grid grid-cols-3 gap-2 text-center text-[11px]">
        <div className="p-1.5 rounded-lg bg-[#DEE5ED] border border-[#C1CCD6]">
          <span className="text-[#262F44] font-bold block">ชาร์จบ้าน: 86.9%</span>
          <span className="text-[10px] text-[#35405A]">+12.7% เทียบ DC Fast</span>
        </div>
        <div className="p-1.5 rounded-lg bg-[#F6F4EB] border border-[#DEE5ED]">
          <span className="text-[#262F44] font-bold block">AC: 82.6%</span>
          <span className="text-[10px] text-[#64748B]">+8.4% เทียบ DC Fast</span>
        </div>
        <div className="p-1.5 rounded-lg bg-[#FCFAF6] border border-[#DEE5ED]">
          <span className="text-[#35405A] font-bold block">DC Fast: 74.2%</span>
          <span className="text-[10px] text-[#8E9EA8]">เสื่อมจากความร้อนสะสม</span>
        </div>
      </div>
    </div>
  );
};
