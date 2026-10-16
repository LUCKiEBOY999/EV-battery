import React from 'react';
import { Database, CheckCircle2, Sliders, BarChart2, AlertCircle, ArrowRight, Layers } from 'lucide-react';
import { VehicleRecord } from '../types';
import { VehicleDataTable } from './VehicleDataTable';

interface DataOverviewViewProps {
  data: VehicleRecord[];
  onExportCSV?: () => void;
  isCleanedMode?: boolean;
  onToggleCleanMode?: () => void;
}

export const DataOverviewView: React.FC<DataOverviewViewProps> = ({ 
  data, 
  onExportCSV,
  isCleanedMode = false,
  onToggleCleanMode,
}) => {
  const total = data.length;

  const qualityStats = React.useMemo(() => {
    let clean = 0;
    let missing = 0;
    let error = 0;
    for (let i = 0; i < data.length; i++) {
      if (data[i].dataQuality === 'Clean') clean++;
      else if (data[i].dataQuality === 'Missing') missing++;
      else if (data[i].dataQuality === 'Error') error++;
    }
    return {
      clean,
      missing,
      error,
      cleanPct: ((clean / (data.length || 1)) * 100).toFixed(1),
      missingPct: ((missing / (data.length || 1)) * 100).toFixed(1),
      errorPct: ((error / (data.length || 1)) * 100).toFixed(1),
    };
  }, [data]);

  const summaryStats = [
    { feature: 'สุขภาพแบตเตอรี่ (SoH %)', type: 'ตัวแปรเป้าหมาย (Float)', mean: '78.4%', std: '8.4%', min: '58.0%', q25: '72.3%', median: '78.5%', q75: '84.8%', max: '99.0%' },
    { feature: 'ระยะทางสะสม (กม.)', type: 'เชิงตัวเลข (Int)', mean: '52,430', std: '24,180', min: '5,000', q25: '33,200', median: '51,600', q75: '70,500', max: '138,200' },
    { feature: 'อายุยานพาหนะ (ปี)', type: 'เชิงตัวเลข (Float)', mean: '4.1', std: '1.8', min: '1.0', q25: '2.6', median: '4.0', q75: '5.5', max: '8.0' },
    { feature: 'รอบการชาร์จสะสม', type: 'เชิงตัวเลข (Int)', mean: '612', std: '276', min: '50', q25: '390', median: '595', q75: '815', max: '1,520' },
    { feature: 'อุณหภูมิใช้งาน (°C)', type: 'เชิงตัวเลข (Float)', mean: '28.7°C', std: '5.6°C', min: '14.2°C', q25: '24.8°C', median: '28.6°C', q75: '32.4°C', max: '43.5°C' },
    { feature: 'รูปแบบการชาร์จ', type: 'เชิงกลุ่ม (3 กลุ่ม)', mean: 'ชาร์จบ้าน (38%)', std: 'AC ทั่วไป (34%)', min: 'DC Fast (28%)', q25: 'N/A', median: 'N/A', q75: 'N/A', max: 'N/A' },
    { feature: 'รุ่นยานพาหนะ', type: 'เชิงกลุ่ม (5 รุ่น)', mean: 'Model 3 (32.5%)', std: 'Model Y (26.8%)', min: 'Model S/X/อื่นๆ', q25: 'N/A', median: 'N/A', q75: 'N/A', max: 'N/A' },
  ];

  const correlationMatrix = [
    { feature: 'สุขภาพแบตเตอรี่ (Target SoH)', corr: '1.00', color: 'bg-[#262F44] text-[#F6F4EB]', note: 'ตัวแปรเป้าหมายความจริงภาคสนาม' },
    { feature: 'ระยะทางสะสม (Mileage)', corr: '-0.76', color: 'bg-[#35405A] text-[#F6F4EB]', note: 'ความสัมพันธ์เชิงลบสูงจากการใช้งานขับขี่' },
    { feature: 'รอบการชาร์จสะสม (Cycles)', corr: '-0.72', color: 'bg-[#4F5E7B] text-[#F6F4EB]', note: 'ความเค้นระดับจุลภาคของการแทรกตัวของลิเธียม' },
    { feature: 'อายุยานพาหนะ (Age)', corr: '-0.68', color: 'bg-[#6D7E9C] text-[#F6F4EB]', note: 'การเสื่อมสภาพตามเวลาและการหนาตัวของฟิล์ม SEI' },
    { feature: 'อุณหภูมิการทำงาน (Temp)', corr: '-0.34', color: 'bg-[#8E9EA8] text-[#262F44]', note: 'การเร่งปฏิกิริยาเคมีความร้อนตามหลัก Arrhenius' },
    { feature: 'การชาร์จเร็ว (DC Fast)', corr: '-0.42', color: 'bg-[#8E9EA8] text-[#262F44]', note: 'การเกิดโพลาไรเซชันจากกระแสชาร์จ C-rate สูง' },
    { feature: 'สถาปัตยกรรมตัวรถ (Model)', corr: '+0.15', color: 'bg-[#C1CCD6] text-[#262F44]', note: 'คุณสมบัติเคมีเซลล์ LFP และระบบ BMS สมัยใหม่' },
  ];

  const crispPhases = [
    {
      phase: 'ขั้นตอนที่ 1: ความเข้าใจทางธุรกิจ (Business Understanding)',
      desc: 'กำหนดเป้าหมาย: พยากรณ์สถานะสุขภาพของแบตเตอรี่ (SoH) เพื่อคาดการณ์ความเสี่ยงการรับประกันและการประเมินมูลค่าซากแบตเตอรี่ตกค้าง',
      status: 'เสร็จสมบูรณ์',
    },
    {
      phase: 'ขั้นตอนที่ 2: ความเข้าใจข้อมูล (Data Understanding)',
      desc: 'สำรวจข้อมูลเทเลเมทรี 100,000 คัน ตรวจพบข้อมูลสูญหาย (Missing Values) สูงถึง ~10.5% และข้อผิดพลาดจากเซนเซอร์ (Glitch/Error) ~3.5% รวม 14,000 คัน',
      status: 'เสร็จสมบูรณ์',
    },
    {
      phase: 'ขั้นตอนที่ 3: การเตรียมข้อมูล (Data Preparation & Cleansing)',
      desc: 'ทำความสะอาดข้อมูล: เติมเต็มค่าสูญหายด้วย Median Imputation และปรับแก้ค่าผิดปกติให้อยู่ในขอบเขตจริงตามหลักกายภาพ (Sensor Clamping)',
      status: isCleanedMode ? 'คลีนข้อมูลแล้ว (Active)' : 'พร้อมดำเนินการ',
    },
  ];

  return (
    <div className="space-y-6" id="data-overview-view">
      {/* CRISP-DM Phases Banner */}
      <div className="bg-[#FCFAF6] rounded-xl border border-[#DEE5ED] p-5 shadow-xs">
        <div className="flex items-center gap-2 mb-3">
          <Layers className="w-5 h-5 text-[#262F44]" />
          <h2 className="text-base font-bold text-[#262F44] font-display">
            กระบวนการ CRISP-DM ขั้นที่ 1–3: ความเข้าใจทางธุรกิจและชุดข้อมูล
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
          {crispPhases.map((item, index) => (
            <div key={index} className="p-3.5 rounded-lg bg-[#F6F4EB] border border-[#DEE5ED]">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-[#262F44]">{item.phase}</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#DEE5ED] text-[#262F44] border border-[#C1CCD6] flex items-center gap-1 font-mono">
                  <CheckCircle2 className="w-3 h-3 text-[#262F44]" />
                  {item.status}
                </span>
              </div>
              <p className="text-xs text-[#64748B] leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Grid: Descriptive Statistics & Correlation Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Table of Descriptive Stats (2 cols) */}
        <div className="lg:col-span-2 bg-[#FCFAF6] rounded-xl border border-[#DEE5ED] p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3 border-b border-[#DEE5ED] pb-3">
            <div>
              <h3 className="text-sm font-bold text-[#262F44] flex items-center gap-1.5 font-display">
                <Database className="w-4 h-4 text-[#262F44]" />
                สรุปสถิติเชิงพรรณนาของชุดข้อมูล (N = {total.toLocaleString()} คัน)
              </h3>
              <p className="text-xs text-[#64748B]">
                ค่าทางสถิติที่คำนวณได้สำหรับพารามิเตอร์เชิงตัวเลขและเชิงกลุ่มทั้งหมด
              </p>
            </div>
            <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${
              isCleanedMode
                ? 'bg-[#DEE5ED] text-[#262F44] border-[#C1CCD6]'
                : 'bg-[#F6F4EB] text-[#35405A] border-[#DEE5ED]'
            }`}>
              {isCleanedMode
                ? '✓ ผ่านกระบวนการคลีนข้อมูลแล้ว (Cleansed Dataset)'
                : '⚠️ ข้อมูลดิบจากเซนเซอร์ (มี Missing & Glitch)'}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-[#F6F4EB] border-b border-[#DEE5ED] text-[#262F44] font-semibold">
                  <th className="py-2.5 px-3">คุณลักษณะ (Feature)</th>
                  <th className="py-2.5 px-3">ประเภทข้อมูล</th>
                  <th className="py-2.5 px-3">ค่าเฉลี่ย / ฐานนิยม</th>
                  <th className="py-2.5 px-3">ส่วนเบี่ยงเบนฯ</th>
                  <th className="py-2.5 px-3">ต่ำสุด</th>
                  <th className="py-2.5 px-3">มัธยฐาน</th>
                  <th className="py-2.5 px-3">สูงสุด</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DEE5ED] font-mono">
                {summaryStats.map((s, idx) => (
                  <tr key={idx} className="hover:bg-[#F6F4EB]/60">
                    <td className="py-2 px-3 font-sans font-medium text-[#262F44]">{s.feature}</td>
                    <td className="py-2 px-3 font-sans text-[#64748B]">{s.type}</td>
                    <td className="py-2 px-3 text-[#262F44] font-semibold">{s.mean}</td>
                    <td className="py-2 px-3 text-[#64748B]">{s.std}</td>
                    <td className="py-2 px-3 text-[#64748B]">{s.min}</td>
                    <td className="py-2 px-3 text-[#262F44] font-semibold">{s.median}</td>
                    <td className="py-2 px-3 text-[#64748B]">{s.max}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Correlation Heatmap Column (1 col) */}
        <div className="bg-[#FCFAF6] rounded-xl border border-[#DEE5ED] p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3 border-b border-[#DEE5ED] pb-3">
              <h3 className="text-sm font-bold text-[#262F44] flex items-center gap-1.5 font-display">
                <BarChart2 className="w-4 h-4 text-[#262F44]" />
                สหสัมพันธ์กับสุขภาพแบตเตอรี่ (Correlation)
              </h3>
            </div>
            <p className="text-xs text-[#64748B] mb-3">
              สัมประสิทธิ์สหสัมพันธ์แบบเพียร์สัน (r) เปรียบเทียบกับตัวแปรเป้าหมาย:
            </p>

            <div className="space-y-2.5">
              {correlationMatrix.map((item, idx) => (
                <div key={idx} className="p-2.5 rounded-lg border border-[#DEE5ED] bg-[#F6F4EB]">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-[#262F44]">{item.feature}</span>
                    <span className={`px-2 py-0.5 rounded font-mono font-bold text-xs ${item.color}`}>
                      r = {item.corr}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#64748B] mt-1">{item.note}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 p-3 rounded-lg bg-[#F6F4EB] border border-[#DEE5ED] text-xs text-[#262F44]">
            <strong>ข้อค้นพบสำคัญ:</strong> ระยะทางสะสมและรอบการชาร์จมีความสัมพันธ์แบบผกผันที่แข็งแกร่งที่สุดกับสถานะสุขภาพแบตเตอรี่ ยืนยันถึงผลของการล้าตัวทั้งเชิงกลและเคมีไฟฟ้า
          </div>
        </div>
      </div>

      {/* CRISP-DM Phase 2 & 3: Data Quality Audit & Cleansing Panel */}
      <div className="bg-[#FCFAF6] rounded-xl border border-[#DEE5ED] p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-[#DEE5ED]">
          <div>
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-[#262F44]" />
              <h3 className="text-sm font-bold text-[#262F44] font-display">
                การตรวจสอบคุณภาพข้อมูลและการเตรียมข้อมูล (Data Quality Audit & Cleansing - CRISP-DM Phase 2 & 3)
              </h3>
            </div>
            <p className="text-xs text-[#64748B] mt-0.5">
              ตรวจพบความไม่สมบูรณ์ของชุดข้อมูลเทเลเมทรี 100,000 คัน พร้อมโมดูลทดลองทำความสะอาดข้อมูล (Imputation & Anomaly Handling)
            </p>
          </div>

          {onToggleCleanMode && (
            <button
              type="button"
              onClick={onToggleCleanMode}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer border shadow-xs ${
                isCleanedMode
                  ? 'bg-[#262F44] text-[#F6F4EB] border-[#262F44] hover:bg-[#35405A]'
                  : 'bg-[#FCFAF6] text-[#262F44] border-[#DEE5ED] hover:bg-[#F6F4EB]'
              }`}
            >
              <CheckCircle2 className={`w-4 h-4 ${isCleanedMode ? 'text-[#F6F4EB]' : 'text-[#262F44]'}`} />
              {isCleanedMode ? 'ปิดโหมดคลีนข้อมูล (ดูข้อมูลดิบ)' : 'เปิดใช้การคลีนข้อมูล (Cleanse Dataset)'}
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Quality Card 1: Clean */}
          <div className="p-4 rounded-xl border border-[#DEE5ED] bg-[#F6F4EB] flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#262F44]">ข้อมูลปกติสมบูรณ์ (Clean Records)</span>
              <CheckCircle2 className="w-4 h-4 text-[#262F44]" />
            </div>
            <div className="my-2">
              <div className="text-2xl font-extrabold text-[#262F44] font-mono">
                {qualityStats.clean.toLocaleString()} <span className="text-sm font-normal text-[#64748B]">คัน</span>
              </div>
              <div className="text-xs text-[#35405A] mt-0.5 font-semibold">
                {qualityStats.cleanPct}% ของชุดข้อมูลทั้งหมด
              </div>
            </div>
            <p className="text-[11px] text-[#64748B]">
              ข้อมูลค่าตัวแปรเทเลเมทรีครบถ้วน ผ่านการตรวจสอบช่วงทางกายภาพทุกพารามิเตอร์
            </p>
          </div>

          {/* Quality Card 2: Missing */}
          <div className="p-4 rounded-xl border border-[#DEE5ED] bg-[#DEE5ED]/40 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#262F44]">มีข้อมูลสูญหาย (Missing Values / Null)</span>
              <AlertCircle className="w-4 h-4 text-[#35405A]" />
            </div>
            <div className="my-2">
              <div className="text-2xl font-extrabold text-[#262F44] font-mono">
                {qualityStats.missing.toLocaleString()} <span className="text-sm font-normal text-[#64748B]">คัน</span>
              </div>
              <div className="text-xs text-[#35405A] mt-0.5 font-semibold">
                {qualityStats.missingPct}% ข้อมูลสูญหายจากการสื่อสาร
              </div>
            </div>
            <p className="text-[11px] text-[#64748B]">
              เกิดจากสัญญาณ IoT ดับชั่วขณะ (รอบชาร์จ N/A, อุณหภูมิ N/A, หรือระยะทาง N/A) จัดการด้วย <strong>Median Imputation</strong>
            </p>
          </div>

          {/* Quality Card 3: Error */}
          <div className="p-4 rounded-xl border border-[#DEE5ED] bg-[#F6F4EB] flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#262F44]">ข้อผิดพลาดจากเซนเซอร์ (Sensor Glitches)</span>
              <AlertCircle className="w-4 h-4 text-[#35405A]" />
            </div>
            <div className="my-2">
              <div className="text-2xl font-extrabold text-[#262F44] font-mono">
                {qualityStats.error.toLocaleString()} <span className="text-sm font-normal text-[#64748B]">คัน</span>
              </div>
              <div className="text-xs text-[#35405A] mt-0.5 font-semibold">
                {qualityStats.errorPct}% เซนเซอร์ส่งค่า Outlier ผิดพลาด
              </div>
            </div>
            <p className="text-[11px] text-[#64748B]">
              ค่าหลุดทางกายภาพ เช่น Temp 115°C หรือรอบชาร์จล้น 99,999 รอบ จัดการด้วย <strong>Physical Limit Clamping</strong>
            </p>
          </div>
        </div>

        <div className="mt-4 p-3.5 rounded-lg bg-[#F6F4EB] border border-[#DEE5ED] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="text-[#64748B]">
            <strong>กลยุทธ์ตามแนวทาง CRISP-DM Phase 3:</strong> เมื่อเปิดใช้โหมดคลีนข้อมูล ระบบจะประมวลผลแทนที่ค่าสูญหายด้วยค่ามัธยฐานเฉพาะกลุ่ม (Group-wise Median) และปรับจำกัดค่า Glitch ให้อยู่ในช่วงค่าจริง (Clamped within realistic bounds) ทำให้โมเดล Machine Learning สามารถนำไปเทรนได้โดยไม่เกิดข้อผิดพลาด
          </div>
          <div className="shrink-0 font-mono text-[11px] font-bold text-[#262F44] bg-[#DEE5ED] px-3 py-1.5 rounded-md border border-[#C1CCD6]">
            สถานะปัจจุบัน: {isCleanedMode ? 'Cleaned Mode (คลีนแล้ว)' : 'Raw Mode (ข้อมูลดิบ)'}
          </div>
        </div>
      </div>

      {/* Complete Dataset Records Table */}
      <div>
        <VehicleDataTable 
          data={data} 
          onExportCSV={onExportCSV || (() => {})} 
          isCleanedMode={isCleanedMode}
          onToggleCleanMode={onToggleCleanMode}
        />
      </div>
    </div>
  );
};
