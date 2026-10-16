import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceLine,
} from 'recharts';
import { VehicleRecord } from '../types';
import { getAgeTrendData } from '../data/evData';
import { TrendingDown } from 'lucide-react';

interface AgeTrendLineChartProps {
  data: VehicleRecord[];
}

export const AgeTrendLineChart: React.FC<AgeTrendLineChartProps> = ({ data }) => {
  const trendData = getAgeTrendData(data);

  return (
    <div
      id="chart-age-trend-line"
      className="bg-[#FCFAF6] rounded-xl border border-[#DEE5ED] p-4 shadow-xs flex flex-col justify-between"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#DEE5ED] gap-2">
        <div>
          <h3 className="text-sm font-bold text-[#262F44] tracking-tight flex items-center gap-1.5 font-display">
            <TrendingDown className="w-4 h-4 text-[#262F44]" />
            แนวโน้มสุขภาพแบตเตอรี่เฉลี่ยตามอายุยานพาหนะ
          </h3>
          <p className="text-[11px] text-[#64748B]">
            วิถีการเสื่อมสภาพของแต่ละรุ่นยานยนต์ตลอดช่วงอายุการใช้งาน 1 ถึง 8 ปี
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-[#64748B]">อัตราการเสื่อมสภาพเฉลี่ย:</span>
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#DEE5ED] text-[#262F44] border border-[#C1CCD6] font-mono">
            ~2.2% ต่อปี
          </span>
        </div>
      </div>

      {/* Line Chart */}
      <div className="w-full h-72 pt-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={trendData}
            margin={{ top: 15, right: 25, bottom: 15, left: -10 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#DEE5ED" vertical={false} />
            <XAxis
              dataKey="age"
              tick={{ fontSize: 11, fill: '#64748B' }}
              axisLine={{ stroke: '#C1CCD6' }}
              label={{
                value: 'อายุยานพาหนะ (ปี)',
                position: 'insideBottom',
                offset: -10,
                fontSize: 11,
                fill: '#35405A',
                fontWeight: 500,
              }}
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
            <Tooltip
              contentStyle={{
                backgroundColor: '#262F44',
                borderColor: '#35405A',
                borderRadius: '0.5rem',
                fontSize: '11px',
                color: '#F6F4EB',
              }}
              formatter={(value: any, name: any) => [`${value}% SoH`, name]}
            />
            <Legend
              verticalAlign="top"
              height={30}
              iconType="plainline"
              formatter={(value) => <span className="text-xs font-semibold text-[#262F44]">{value}</span>}
            />
            <ReferenceLine
              y={70}
              stroke="#A35252"
              strokeDasharray="4 4"
              label={{ value: 'จุดสิ้นสุดอายุการใช้งานระยะแรก (70%)', fill: '#A35252', fontSize: 10, position: 'insideBottomRight' }}
            />

            {/* Model Lines */}
            <Line
              type="monotone"
              dataKey="Model 3"
              stroke="#262F44"
              strokeWidth={2.5}
              dot={{ r: 3.5, fill: '#262F44' }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="Model Y"
              stroke="#35405A"
              strokeWidth={2.5}
              dot={{ r: 3.5, fill: '#35405A' }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="Model S"
              stroke="#8E9EA8"
              strokeWidth={2}
              strokeDasharray="4 2"
              dot={{ r: 3, fill: '#8E9EA8' }}
              activeDot={{ r: 5 }}
            />
            <Line
              type="monotone"
              dataKey="Model X"
              stroke="#A3B1BE"
              strokeWidth={2}
              strokeDasharray="4 2"
              dot={{ r: 3, fill: '#A3B1BE' }}
              activeDot={{ r: 5 }}
            />
            <Line
              type="monotone"
              dataKey="Others"
              stroke="#64748B"
              strokeWidth={1.5}
              dot={{ r: 2.5, fill: '#64748B' }}
              activeDot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Note below line chart */}
      <div className="mt-2 pt-2 border-t border-[#DEE5ED] flex items-center justify-between text-[11px] text-[#64748B]">
        <span>การเสื่อมสภาพตามปฏิทินเวลา (Calendar Aging) ลดลงเฉลี่ย 1.8%–2.4% ต่อปี</span>
        <span className="font-semibold text-[#262F44]">Model Y และ Model 3 รักษาระดับ SoH ได้สูงสุดเมื่อผ่านไป 6 ปี</span>
      </div>
    </div>
  );
};
