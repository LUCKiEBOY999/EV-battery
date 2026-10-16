import React from 'react';
import { Sparkles, Calendar, RefreshCw, Download, Database, Cpu, Car } from 'lucide-react';
import { NavigationTab } from '../types';

interface TopHeaderProps {
  totalVehicles: number;
  filteredCount: number;
  onResetFilters: () => void;
  onExportCSV: () => void;
  activeTab: NavigationTab;
  bgWatermarkOpacity?: number;
  onChangeBgOpacity?: (val: number) => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  totalVehicles,
  filteredCount,
  onResetFilters,
  onExportCSV,
  activeTab,
  bgWatermarkOpacity = 0.12,
  onChangeBgOpacity,
}) => {
  // Format current date nicely
  const formattedDate = '9 ก.ย. 2026';

  const tabLabels: Record<NavigationTab, { title: string; desc: string }> = {
    'home': {
      title: 'แดชบอร์ดสุขภาพแบตเตอรี่ EV',
      desc: 'การวิเคราะห์การเสื่อมสภาพของแบตเตอรี่รถยนต์ไฟฟ้าตามระเบียบวิธี CRISP-DM',
    },
    'battery-health-prediction': {
      title: 'แบบจำลองการทำนายสุขภาพแบตเตอรี่',
      desc: 'การอนุมานด้วย Machine Learning เชิงโต้ตอบเพื่อคาดการณ์สถานะสุขภาพ (SoH %)',
    },
  };

  const currentLabel = tabLabels[activeTab] || tabLabels['home'];

  return (
    <header
      id="top-header"
      className="bg-[#FCFAF6] border-b border-[#DEE5ED] px-6 py-4 sticky top-0 z-20 shadow-xs"
    >
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Left: Project title, subtitle & tags */}
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-xl font-bold text-[#262F44] tracking-tight font-display">
              {currentLabel.title}
            </h1>
            
            {/* Synthetic Data Small Label */}
            <span 
              id="synthetic-data-badge"
              className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#F6F4EB] text-[#262F44] border border-[#C1CCD6] shadow-2xs"
            >
              <Sparkles className="w-3 h-3 text-[#262F44]" />
              ข้อมูลจำลอง
            </span>

            {/* ML Model pill */}
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#DEE5ED] text-[#262F44] border border-[#C1CCD6]">
              <Cpu className="w-3 h-3 text-[#262F44]" />
              การถดถอย Random Forest
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-[#64748B]">
            <p className="font-medium text-[#35405A]">
              {currentLabel.desc}
            </p>
            <span className="text-[#C1CCD6]">•</span>
            <span className="flex items-center gap-1 text-[#64748B]">
              <Calendar className="w-3.5 h-3.5 text-[#64748B]" />
              อัปเดตล่าสุด: <span className="font-medium text-[#262F44]">{formattedDate}</span>
            </span>
            <span className="text-[#C1CCD6]">•</span>
            <span className="flex items-center gap-1 text-[#64748B]">
              <Database className="w-3.5 h-3.5 text-[#64748B]" />
              ขนาดกลุ่มตัวอย่าง: <span className="font-semibold text-[#262F44]">{filteredCount}</span> จาก {totalVehicles} คัน
            </span>
          </div>
        </div>

        {/* Right Actions: Quick Filter Reset, EV BG Opacity, and CSV Export */}
        <div className="flex items-center gap-2 self-start lg:self-center shrink-0">
          {onChangeBgOpacity && (
            <button
              id="header-ev-bg-opacity-btn"
              onClick={() => {
                const levels = [0.08, 0.16, 0.25, 0];
                const currentIndex = levels.findIndex((l) => Math.abs(l - bgWatermarkOpacity) < 0.02);
                const nextIndex = (currentIndex + 1) % levels.length;
                onChangeBgOpacity(levels[nextIndex]);
              }}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border shadow-2xs transition-colors cursor-pointer ${
                bgWatermarkOpacity > 0
                  ? 'bg-[#DEE5ED] text-[#262F44] border-[#C1CCD6] hover:bg-[#C1CCD6]'
                  : 'bg-[#F6F4EB] text-[#64748B] border-[#DEE5ED] hover:bg-[#DEE5ED]'
              }`}
              title="คลิกเพื่อสลับระดับความชัดของรูปรถ EV ในพื้นหลัง (8%, 16%, 25%, ปิด)"
            >
              <Car className="w-3.5 h-3.5 text-[#262F44]" />
              <span>
                {bgWatermarkOpacity >= 0.2
                  ? 'พื้นหลัง EV: ชัดเจน (25%)'
                  : bgWatermarkOpacity >= 0.14
                  ? 'พื้นหลัง EV: ปานกลาง (16%)'
                  : bgWatermarkOpacity > 0
                  ? 'พื้นหลัง EV: บางเบา (8%)'
                  : 'พื้นหลัง EV: ปิด'}
              </span>
            </button>
          )}

          {filteredCount < totalVehicles && (
            <button
              id="header-reset-filters-btn"
              onClick={onResetFilters}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#F6F4EB] bg-[#262F44] hover:bg-[#35405A] border border-[#262F44] transition-colors cursor-pointer shadow-2xs"
              title="ล้างค่าตัวกรองทั้งหมด"
            >
              <RefreshCw className="w-3.5 h-3.5 text-[#C1CCD6]" />
              รีเซ็ตตัวกรอง (กรองออก {totalVehicles - filteredCount} คัน)
            </button>
          )}

          <button
            id="header-export-csv-btn"
            onClick={onExportCSV}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#262F44] bg-white border border-[#C1CCD6] hover:bg-[#F6F4EB] shadow-2xs transition-colors cursor-pointer"
            title="ดาวน์โหลดข้อมูลจำลองยานยนต์ไฟฟ้าเป็นไฟล์ CSV"
          >
            <Download className="w-3.5 h-3.5 text-[#262F44]" />
            ส่งออกไฟล์ CSV
          </button>
        </div>
      </div>
    </header>
  );
};
