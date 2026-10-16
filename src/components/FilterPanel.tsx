import React, { useState } from 'react';
import { Filter, RotateCcw, Check, SlidersHorizontal, Search, Car, Zap, Clock, Gauge, Thermometer, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { FilterState } from '../types';

interface FilterPanelProps {
  filters: FilterState;
  onFilterChange: (newFilters: FilterState) => void;
  onReset: () => void;
  filteredCount: number;
  totalCount: number;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  onFilterChange,
  onReset,
  filteredCount,
  totalCount,
}) => {
  // Temporary local state for interactive search/apply experience
  const [localFilters, setLocalFilters] = useState<FilterState>(filters);
  const [hasAppliedNotification, setHasAppliedNotification] = useState(false);

  const vehicleModels = [
    { value: 'All', label: 'ทุกรุ่น (ทั้งฟลีท)' },
    { value: 'Model 3', label: 'Model 3' },
    { value: 'Model Y', label: 'Model Y' },
    { value: 'Model S', label: 'Model S' },
    { value: 'Model X', label: 'Model X' },
    { value: 'Others', label: 'รุ่นอื่นๆ (Others)' },
  ];

  const chargingTypes = [
    { value: 'All', label: 'ทุกรูปแบบการชาร์จ' },
    { value: 'Home', label: 'ชาร์จที่บ้าน (Home)' },
    { value: 'AC', label: 'กระแสสลับ (AC Level 2)' },
    { value: 'DC Fast', label: 'ชาร์จเร็ว DC (DC Fast)' },
  ];

  const ageRanges = [
    { value: 'All', label: 'ทุกช่วงอายุ (1-8 ปี)' },
    { value: '1-2 Years', label: '1 - 2 ปี' },
    { value: '3-4 Years', label: '3 - 4 ปี' },
    { value: '5-6 Years', label: '5 - 6 ปี' },
    { value: '7+ Years', label: '7 ปีขึ้นไป' },
  ];

  const mileageRanges = [
    { value: 'All', label: 'ทุกช่วงระยะทาง' },
    { value: '< 30,000 km', label: 'น้อยกว่า 30,000 กม.' },
    { value: '30,000 - 60,000 km', label: '30,000 - 60,000 กม.' },
    { value: '60,000 - 100,000 km', label: '60,000 - 100,000 กม.' },
    { value: '> 100,000 km', label: 'มากกว่า 100,000 กม.' },
  ];

  const temperatureRanges = [
    { value: 'All', label: 'ทุกช่วงอุณหภูมิ' },
    { value: 'Cool (< 22°C)', label: 'อากาศเย็น (< 22°C)' },
    { value: 'Moderate (22 - 32°C)', label: 'ปานกลาง (22 - 32°C)' },
    { value: 'Hot (> 32°C)', label: 'อากาศร้อนจัด (> 32°C)' },
  ];

  const dataQualityOptions = [
    { value: 'All', label: 'ทั้งหมด (ทุกระดับคุณภาพข้อมูล)' },
    { value: 'Clean', label: 'ข้อมูลปกติสมบูรณ์ (Clean Data)' },
    { value: 'Missing', label: 'มีข้อมูลสูญหาย (Missing Values)' },
    { value: 'Error', label: 'มีข้อผิดพลาด/Sensor Error' },
  ];

  const handleApply = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    onFilterChange(localFilters);
    setHasAppliedNotification(true);
    setTimeout(() => setHasAppliedNotification(false), 2000);
  };

  const handleReset = () => {
    const defaultFilters: FilterState = {
      vehicleModel: 'All',
      chargingType: 'All',
      vehicleAgeRange: 'All',
      mileageRange: 'All',
      temperatureRange: 'All',
      dataQuality: 'All',
      searchQuery: '',
    };
    setLocalFilters(defaultFilters);
    onReset();
  };

  const activeFiltersCount = Object.entries(localFilters).filter(
    ([key, value]) => key !== 'searchQuery' && value !== 'All' && value !== ''
  ).length + (localFilters.searchQuery ? 1 : 0);

  return (
    <aside
      id="right-filter-panel"
      className="bg-[#FCFAF6] rounded-xl border border-[#DEE5ED] shadow-xs p-4 flex flex-col h-full"
      aria-label="ตัวกรองชุดข้อมูล"
    >
      {/* Panel Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#DEE5ED]">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#DEE5ED] text-[#262F44] flex items-center justify-center border border-[#C1CCD6]">
            <SlidersHorizontal className="w-3.5 h-3.5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-[#262F44] tracking-tight font-display">
              ตัวกรองข้อมูล
            </h2>
            <p className="text-[11px] text-[#64748B]">พารามิเตอร์แบบโต้ตอบ Power BI</p>
          </div>
        </div>

        {activeFiltersCount > 0 && (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#262F44] text-[#F6F4EB] border border-[#262F44]">
            ใช้งาน {activeFiltersCount} รายการ
          </span>
        )}
      </div>

      {/* Filter Form */}
      <form onSubmit={handleApply} className="space-y-3.5 mt-3.5 flex-1">
        {/* Quick Search */}
        <div>
          <label className="block text-xs font-semibold text-[#35405A] mb-1 flex items-center gap-1.5">
            <Search className="w-3.5 h-3.5 text-[#64748B]" />
            ค้นหายานพาหนะ
          </label>
          <div className="relative">
            <input
              type="text"
              id="filter-search-input"
              value={localFilters.searchQuery || ''}
              onChange={(e) => setLocalFilters({ ...localFilters, searchQuery: e.target.value })}
              placeholder="ค้นหารหัส ID, รุ่นรถ หรือสถานะ..."
              className="w-full text-xs px-3 py-2 rounded-lg border border-[#C1CCD6] focus:outline-none focus:ring-2 focus:ring-[#262F44] focus:border-[#262F44] bg-white text-[#262F44]"
            />
          </div>
        </div>

        {/* 1. Vehicle Model */}
        <div>
          <label className="block text-xs font-semibold text-[#35405A] mb-1 flex items-center gap-1.5">
            <Car className="w-3.5 h-3.5 text-[#262F44]" />
            รุ่นยานยนต์ (Vehicle Model)
          </label>
          <select
            id="filter-vehicle-model"
            value={localFilters.vehicleModel}
            onChange={(e) => setLocalFilters({ ...localFilters, vehicleModel: e.target.value })}
            className="w-full text-xs px-3 py-2 rounded-lg border border-[#C1CCD6] focus:outline-none focus:ring-2 focus:ring-[#262F44] focus:border-[#262F44] bg-white font-medium text-[#262F44] cursor-pointer"
          >
            {vehicleModels.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>
        </div>

        {/* 2. Charging Type */}
        <div>
          <label className="block text-xs font-semibold text-[#35405A] mb-1 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-[#262F44]" />
            รูปแบบการชาร์จ (Charging Type)
          </label>
          <select
            id="filter-charging-type"
            value={localFilters.chargingType}
            onChange={(e) => setLocalFilters({ ...localFilters, chargingType: e.target.value })}
            className="w-full text-xs px-3 py-2 rounded-lg border border-[#C1CCD6] focus:outline-none focus:ring-2 focus:ring-[#262F44] focus:border-[#262F44] bg-white font-medium text-[#262F44] cursor-pointer"
          >
            {chargingTypes.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>

        {/* 3. Vehicle Age */}
        <div>
          <label className="block text-xs font-semibold text-[#35405A] mb-1 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-[#262F44]" />
            อายุยานพาหนะ (Vehicle Age)
          </label>
          <select
            id="filter-vehicle-age"
            value={localFilters.vehicleAgeRange}
            onChange={(e) => setLocalFilters({ ...localFilters, vehicleAgeRange: e.target.value })}
            className="w-full text-xs px-3 py-2 rounded-lg border border-[#C1CCD6] focus:outline-none focus:ring-2 focus:ring-[#262F44] focus:border-[#262F44] bg-white font-medium text-[#262F44] cursor-pointer"
          >
            {ageRanges.map((a) => (
              <option key={a.value} value={a.value}>
                {a.label}
              </option>
            ))}
          </select>
        </div>

        {/* 4. Mileage Range */}
        <div>
          <label className="block text-xs font-semibold text-[#35405A] mb-1 flex items-center gap-1.5">
            <Gauge className="w-3.5 h-3.5 text-[#262F44]" />
            ช่วงระยะทางสะสม (Mileage Range)
          </label>
          <select
            id="filter-mileage-range"
            value={localFilters.mileageRange}
            onChange={(e) => setLocalFilters({ ...localFilters, mileageRange: e.target.value })}
            className="w-full text-xs px-3 py-2 rounded-lg border border-[#C1CCD6] focus:outline-none focus:ring-2 focus:ring-[#262F44] focus:border-[#262F44] bg-white font-medium text-[#262F44] cursor-pointer"
          >
            {mileageRanges.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>
        </div>

        {/* 5. Operating Temperature */}
        <div>
          <label className="block text-xs font-semibold text-[#35405A] mb-1 flex items-center gap-1.5">
            <Thermometer className="w-3.5 h-3.5 text-[#262F44]" />
            อุณหภูมิขณะใช้งาน (Operating Temp)
          </label>
          <select
            id="filter-operating-temp"
            value={localFilters.temperatureRange}
            onChange={(e) => setLocalFilters({ ...localFilters, temperatureRange: e.target.value })}
            className="w-full text-xs px-3 py-2 rounded-lg border border-[#C1CCD6] focus:outline-none focus:ring-2 focus:ring-[#262F44] focus:border-[#262F44] bg-white font-medium text-[#262F44] cursor-pointer"
          >
            {temperatureRanges.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>

        {/* 6. Data Quality (CRISP-DM Phase 2 & 3) */}
        <div>
          <label className="block text-xs font-semibold text-[#35405A] mb-1 flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 text-[#262F44]" />
            คุณภาพข้อมูล (Data Quality)
          </label>
          <select
            id="filter-data-quality"
            value={localFilters.dataQuality || 'All'}
            onChange={(e) => setLocalFilters({ ...localFilters, dataQuality: e.target.value })}
            className="w-full text-xs px-3 py-2 rounded-lg border border-[#C1CCD6] focus:outline-none focus:ring-2 focus:ring-[#262F44] focus:border-[#262F44] bg-white font-medium text-[#262F44] cursor-pointer"
          >
            {dataQualityOptions.map((q) => (
              <option key={q.value} value={q.value}>
                {q.label}
              </option>
            ))}
          </select>
        </div>

        {/* Fleet Match Count Pill */}
        <div className="p-2.5 rounded-lg bg-[#F6F4EB] border border-[#DEE5ED] text-[#262F44] text-xs flex items-center justify-between">
          <span className="text-[11px] font-medium text-[#64748B]">ตรงตามเงื่อนไข:</span>
          <motion.span 
            key={filteredCount}
            initial={{ scale: 1.15, color: '#262F44' }}
            animate={{ scale: 1, color: '#262F44' }}
            className="font-mono font-bold"
          >
            {filteredCount} <span className="text-[#64748B] font-normal">/ {totalCount} คัน</span>
          </motion.span>
        </div>

        {/* Action Buttons: Reset & Search/Apply */}
        <div className="pt-2 grid grid-cols-2 gap-2">
          <motion.button
            type="button"
            id="filter-reset-button"
            onClick={handleReset}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-[#262F44] bg-white hover:bg-[#F6F4EB] border border-[#C1CCD6] transition-colors cursor-pointer shadow-2xs"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#262F44]" />
            รีเซ็ต
          </motion.button>

          <motion.button
            type="submit"
            id="filter-apply-button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-[#F6F4EB] bg-[#262F44] hover:bg-[#35405A] shadow-xs transition-colors cursor-pointer"
          >
            {hasAppliedNotification ? (
              <>
                <Check className="w-3.5 h-3.5 text-[#F6F4EB] animate-bounce" />
                นำไปใช้แล้ว!
              </>
            ) : (
              <>
                <Filter className="w-3.5 h-3.5 text-[#F6F4EB]" />
                ค้นหา / กรองข้อมูล
              </>
            )}
          </motion.button>
        </div>
      </form>
    </aside>
  );
};
