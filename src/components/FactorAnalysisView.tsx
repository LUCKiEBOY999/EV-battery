import React from 'react';
import { RF_MODEL_METRICS } from '../data/evData';
import { Cpu, Zap, Activity, Flame, ShieldAlert, Award, Compass, BarChart3 } from 'lucide-react';
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

export const FactorAnalysisView: React.FC = () => {
  const chartData = [...RF_MODEL_METRICS.features].sort((a, b) => b.importance - a.importance);

  const featureColors = ['#262F44', '#35405A', '#4F5E7B', '#6D7E9C', '#8E9EA8', '#B0BCC7'];

  return (
    <div className="space-y-6" id="factor-analysis-view">
      {/* Modeling Overview Card */}
      <div className="bg-[#FCFAF6] rounded-xl border border-[#DEE5ED] p-5 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#DEE5ED] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Cpu className="w-5 h-5 text-[#262F44]" />
              <h2 className="text-base font-bold text-[#262F44] font-display">
                CRISP-DM ขั้นที่ 4: การสร้างแบบจำลองและการวิเคราะห์ความสำคัญของตัวแปร (Feature Importance)
              </h2>
            </div>
            <p className="text-xs text-[#64748B] mt-1">
              การเรียนรู้ของเครื่องแบบมีผู้สอน (Supervised ML): <strong>{RF_MODEL_METRICS.algorithm}</strong>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="px-3 py-1 rounded-lg bg-[#F6F4EB] border border-[#DEE5ED] text-center">
              <span className="text-[10px] uppercase font-bold text-[#35405A] block">คะแนน R² Score</span>
              <span className="text-sm font-bold font-mono text-[#262F44]">{RF_MODEL_METRICS.r2Score}</span>
            </div>
            <div className="px-3 py-1 rounded-lg bg-[#DEE5ED]/50 border border-[#DEE5ED] text-center">
              <span className="text-[10px] uppercase font-bold text-[#35405A] block">ค่าคลาดเคลื่อน RMSE</span>
              <span className="text-sm font-bold font-mono text-[#262F44]">{RF_MODEL_METRICS.rmse}%</span>
            </div>
            <div className="px-3 py-1 rounded-lg bg-[#F6F4EB] border border-[#DEE5ED] text-center">
              <span className="text-[10px] uppercase font-bold text-[#35405A] block">ค่าคลาดเคลื่อน MAE</span>
              <span className="text-sm font-bold font-mono text-[#262F44]">{RF_MODEL_METRICS.mae}%</span>
            </div>
          </div>
        </div>

        {/* Feature Importance Chart */}
        <div className="mt-5 grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
          <div>
            <h3 className="text-sm font-bold text-[#262F44] mb-1 flex items-center gap-1.5 font-display">
              <BarChart3 className="w-4 h-4 text-[#262F44]" />
              ระดับความสำคัญของตัวแปร Gini Impurity (%)
            </h3>
            <p className="text-xs text-[#64748B] mb-3">
              สัดส่วนผลกระทบสัมพันธ์ที่ทำให้เกิดความแปรปรวนของการเสื่อมสภาพของแบตเตอรี่
            </p>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  layout="vertical"
                  data={chartData}
                  margin={{ top: 5, right: 30, bottom: 5, left: 30 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#DEE5ED" />
                  <XAxis type="number" domain={[0, 40]} unit="%" tick={{ fontSize: 10, fill: '#64748B' }} />
                  <YAxis
                    dataKey="feature"
                    type="category"
                    tick={{ fontSize: 10, fill: '#262F44', fontWeight: 600 }}
                    width={140}
                  />
                  <Tooltip
                    formatter={(val: any) => [`${val}% ระดับความสำคัญ`, 'สัดส่วนส่งผล']}
                    contentStyle={{ backgroundColor: '#262F44', borderColor: '#35405A', borderRadius: '0.5rem', color: '#F6F4EB', fontSize: '11px' }}
                  />
                  <Bar dataKey="importance" radius={[0, 4, 4, 0]}>
                    <LabelList dataKey="importance" position="right" formatter={(v: number) => `${v}%`} style={{ fontSize: 10, fontWeight: 700, fill: '#262F44' }} />
                    {chartData.map((_, i) => (
                      <Cell key={`cell-${i}`} fill={featureColors[i % featureColors.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Qualitative Factor Breakdown */}
          <div className="space-y-2.5">
            {chartData.map((f, i) => (
              <div key={f.feature} className="p-2.5 rounded-lg border border-[#DEE5ED] bg-[#F6F4EB] flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-[#262F44] text-[#F6F4EB] flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 font-mono">
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#262F44]">{f.feature}</span>
                    <span className="text-xs font-mono font-bold text-[#262F44]">{f.importance}%</span>
                  </div>
                  <p className="text-[11px] text-[#64748B] mt-0.5 leading-snug">{f.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Degradation Mechanisms Breakdown (Electrochemical Context) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#FCFAF6] rounded-xl border border-[#DEE5ED] p-4 shadow-xs">
          <div className="w-8 h-8 rounded-lg bg-[#DEE5ED] text-[#262F44] flex items-center justify-center mb-2">
            <Activity className="w-4 h-4" />
          </div>
          <h4 className="text-xs font-bold text-[#262F44] font-display">1. การเสื่อมสภาพตามเวลา vs รอบชาร์จ</h4>
          <p className="text-xs text-[#64748B] mt-1 leading-relaxed">
            การเสื่อมสภาพตามปฏิทินเวลา (Calendar Aging) เกิดขึ้นอย่างต่อเนื่องจากการสะสมของชั้น Solid Electrolyte Interphase (SEI) บนขั้วแอโนดแกรไฟต์ (~2%/ปี) ส่วนรอบการชาร์จ (Cycle Aging) จะเพิ่มอัตราการสูญเสียระหว่างการเคลื่อนย้ายไอออนลิเธียม
          </p>
        </div>

        <div className="bg-[#FCFAF6] rounded-xl border border-[#DEE5ED] p-4 shadow-xs">
          <div className="w-8 h-8 rounded-lg bg-[#DEE5ED] text-[#262F44] flex items-center justify-center mb-2">
            <Zap className="w-4 h-4" />
          </div>
          <h4 className="text-xs font-bold text-[#262F44] font-display">2. ความเครียดจากการชาร์จเร็ว DC Fast</h4>
          <p className="text-xs text-[#64748B] mt-1 leading-relaxed">
            อัตรากระแสไฟฟ้าชาร์จสูง (&gt; 1.5C) ก่อให้เกิดแรงเค้นเชิงกล อนุภาคขั้วแตกหัก และเกิดการเกาะเคลือบของลิเธียมไอออน (Lithium Plating) ส่งผลให้ค่า SoH ลดลงเฉลี่ย 8.4% ถึง 12.7% เมื่อเทียบกับการชาร์จไฟฟ้ากระแสสลับที่บ้าน
          </p>
        </div>

        <div className="bg-[#FCFAF6] rounded-xl border border-[#DEE5ED] p-4 shadow-xs">
          <div className="w-8 h-8 rounded-lg bg-[#DEE5ED] text-[#262F44] flex items-center justify-center mb-2">
            <Flame className="w-4 h-4" />
          </div>
          <h4 className="text-xs font-bold text-[#262F44] font-display">3. การเร่งปฏิกิริยาจากความร้อน (Arrhenius)</h4>
          <p className="text-xs text-[#64748B] mt-1 leading-relaxed">
            การสลายตัวของสารละลายอิเล็กโทรไลต์จะเพิ่มขึ้นเป็นเท่าตัวในทุกๆ อุณหภูมิที่สูงขึ้น 10°C เหนือ 25°C ตามจลนพลศาสตร์อาร์เรเนียส จึงตอกย้ำถึงความสำคัญสูงสุดของระบบจัดการความร้อนด้วยของเหลว (Liquid Thermal Management)
          </p>
        </div>
      </div>
    </div>
  );
};
