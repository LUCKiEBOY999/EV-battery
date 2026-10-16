import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { VehicleRecord } from '../types';
import { getModelDistribution } from '../data/evData';
import { PieChart as PieIcon } from 'lucide-react';

interface ModelDistributionDonutProps {
  data: VehicleRecord[];
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: {
      model: string;
      count: number;
      percentage: number;
      color: string;
    };
  }>;
}

const CustomPieTooltip: React.FC<CustomTooltipProps> = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const d = payload[0].payload;
    return (
      <div className="bg-[#262F44] text-[#F6F4EB] p-2.5 rounded-lg shadow-xl border border-[#35405A] text-xs font-sans">
        <div className="font-bold flex items-center gap-1.5 border-b border-[#35405A] pb-1 mb-1.5 font-display text-[#F6F4EB]">
          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }}></span>
          {d.model}
        </div>
        <div className="space-y-0.5">
          <div className="flex justify-between gap-4">
            <span className="text-[#C1CCD6]">สัดส่วนในฟลีท:</span>
            <span className="font-bold text-[#F6F4EB] font-mono">{d.percentage}%</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-[#C1CCD6]">จำนวนรถ:</span>
            <span className="font-mono text-[#C1CCD6]">{d.count.toLocaleString()} คัน</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export const ModelDistributionDonut: React.FC<ModelDistributionDonutProps> = ({ data }) => {
  const chartData = getModelDistribution(data);
  const total = data.length;

  return (
    <div
      id="chart-model-distribution-donut"
      className="bg-[#FCFAF6] rounded-xl border border-[#DEE5ED] p-4 shadow-xs flex flex-col justify-between"
    >
      {/* Chart Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#DEE5ED]">
        <div>
          <h3 className="text-sm font-bold text-[#262F44] tracking-tight flex items-center gap-1.5 font-display">
            <PieIcon className="w-4 h-4 text-[#262F44]" />
            สัดส่วนการกระจายตัวตามรุ่นยานยนต์
          </h3>
          <p className="text-[11px] text-[#64748B]">
            สัดส่วนของยานยนต์ในฟลีทตามสถาปัตยกรรมและโครงสร้างแบตเตอรี่
          </p>
        </div>
        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#DEE5ED] text-[#262F44] border border-[#C1CCD6] font-mono">
          รวม {total.toLocaleString()} คัน
        </span>
      </div>

      {/* Donut Chart with Center Text */}
      <div className="w-full h-72 pt-1 relative flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={88}
              paddingAngle={2.5}
              dataKey="count"
              nameKey="model"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke="#FCFAF6" strokeWidth={2} />
              ))}
            </Pie>
            <Tooltip content={<CustomPieTooltip />} />
            <Legend
              verticalAlign="bottom"
              height={36}
              iconType="circle"
              iconSize={8}
              formatter={(value, entry: any) => (
                <span className="text-[11px] font-semibold text-[#262F44] ml-1">
                  {value} ({entry.payload.percentage}%)
                </span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* Center Total Count Overlay */}
        <div className="absolute top-[41%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
          <span className="text-[10px] uppercase font-bold tracking-wider text-[#64748B] block">
            ทั้งฟลีท
          </span>
          <span className="text-base font-extrabold text-[#262F44] font-display">
            {total.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Breakdown List */}
      <div className="mt-2 pt-2 border-t border-[#DEE5ED] flex flex-wrap items-center justify-between gap-1 text-[11px] text-[#64748B]">
        {chartData.map((item) => (
          <div key={item.model} className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
            <span className="font-semibold text-[#262F44]">{item.model}:</span>
            <span className="font-mono text-[#64748B]">{item.percentage}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};
