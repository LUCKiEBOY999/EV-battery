/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { Sidebar } from './components/Sidebar';
import { TopHeader } from './components/TopHeader';
import { KpiCards } from './components/KpiCards';
import { FilterPanel } from './components/FilterPanel';
import { MileageScatterChart } from './components/MileageScatterChart';
import { ChargingTypeBarChart } from './components/ChargingTypeBarChart';
import { ModelDistributionDonut } from './components/ModelDistributionDonut';
import { AgeTrendLineChart } from './components/AgeTrendLineChart';
import { BatteryHealthGauge } from './components/BatteryHealthGauge';
import { VehicleDataTable } from './components/VehicleDataTable';
import { PredictionSimulator } from './components/PredictionSimulator';
import { Footer } from './components/Footer';
import { EVArchitectureCard } from './components/EVArchitectureCard';
import { EVModelShowcaseCard } from './components/EVModelShowcaseCard';
import evBgImage from './assets/images/ev_bg_watermark_1789099775460.jpg';

import { 
  SYNTHETIC_EV_DATA, 
  filterRecords, 
  calculateKPIs,
  cleanseDataset 
} from './data/evData';
import { FilterState, NavigationTab } from './types';
import { SlidersHorizontal, Eye, X, Sparkles, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavigationTab>('home');
  const [isFilterOpenMobile, setIsFilterOpenMobile] = useState(false);
  const [isCleanedMode, setIsCleanedMode] = useState(false);
  const [bgWatermarkOpacity, setBgWatermarkOpacity] = useState<number>(0.12);

  const initialFilters: FilterState = {
    vehicleModel: 'All',
    chargingType: 'All',
    vehicleAgeRange: 'All',
    mileageRange: 'All',
    temperatureRange: 'All',
    dataQuality: 'All',
    searchQuery: '',
  };

  const [filters, setFilters] = useState<FilterState>(initialFilters);

  // Raw or Cleaned Dataset
  const activeBaseDataset = useMemo(() => {
    if (isCleanedMode) {
      return cleanseDataset(SYNTHETIC_EV_DATA).cleanedRecords;
    }
    return SYNTHETIC_EV_DATA;
  }, [isCleanedMode]);

  // Filtered dataset
  const filteredVehicles = useMemo(() => {
    return filterRecords(activeBaseDataset, filters);
  }, [activeBaseDataset, filters]);

  // Dynamic KPI Stats calculated from current filtered records
  const kpiStats = useMemo(() => {
    return calculateKPIs(filteredVehicles);
  }, [filteredVehicles]);

  const handleResetFilters = () => {
    setFilters(initialFilters);
  };

  const handleExportCSV = () => {
    const headers = [
      'รหัสยานพาหนะ (Vehicle ID)',
      'รุ่นยานพาหนะ (Vehicle Model)',
      'อายุยานพาหนะ (ปี)',
      'ระยะทางสะสม (กม.)',
      'รอบการชาร์จสะสม',
      'รูปแบบการชาร์จ',
      'อุณหภูมิการทำงาน (°C)',
      'ระยะทางวิ่งได้จริง (กม.)',
      'สุขภาพแบตเตอรี่ (SoH %)',
      'สถานะสภาพแบตเตอรี่',
      'คุณภาพข้อมูล (Data Quality)',
      'รายละเอียดข้อผิดพลาด (Error Detail)',
    ];

    const rows = filteredVehicles.map((r) => [
      r.id,
      r.vehicleModel,
      r.vehicleAge,
      r.accumulatedMileage,
      r.chargingCycles !== null ? r.chargingCycles : 'N/A',
      r.chargingType,
      r.operatingTemperature !== null ? r.operatingTemperature : 'N/A',
      r.currentRangeKm !== null ? r.currentRangeKm : 'N/A',
      r.batteryHealth,
      r.status,
      r.dataQuality === 'Clean' ? 'ปกติ (Clean)' : r.dataQuality === 'Missing' ? 'สูญหาย (Missing)' : 'ข้อผิดพลาด (Error)',
      `"${(r.errorDetail || 'ไม่มี').replace(/"/g, '""')}"`,
    ]);

    const csvString = [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const blob = new Blob(['\uFEFF' + csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `ev_battery_health_100k_data_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[#F6F4EB] text-[#262F44] flex flex-col lg:flex-row antialiased selection:bg-[#C1CCD6] selection:text-[#262F44]">
      {/* 1. LEFT SIDEBAR */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen relative overflow-x-hidden">
        {/* EV Car Background Watermark ("ภาพพื้นหลังรถ EV แบบลางๆ") with adjustable opacity */}
        {bgWatermarkOpacity > 0 && (
          <div 
            className="fixed inset-0 lg:left-64 pointer-events-none z-0 overflow-hidden select-none flex items-center justify-center p-8 transition-opacity duration-300"
            style={{ opacity: bgWatermarkOpacity }}
            aria-hidden="true"
          >
            <img 
              src={evBgImage} 
              alt="EV Silhouette Background Watermark" 
              referrerPolicy="no-referrer"
              className="w-full h-full object-contain max-w-5xl max-h-[82vh] mix-blend-multiply filter contrast-125 pointer-events-none scale-105" 
            />
            {/* Soft vignette overlay matching warm cream background */}
            <div className="absolute inset-0 bg-radial from-transparent via-[#F6F4EB]/30 to-[#F6F4EB]/75 pointer-events-none" />
          </div>
        )}

        {/* 2. TOP HEADER */}
        <TopHeader
          totalVehicles={SYNTHETIC_EV_DATA.length}
          filteredCount={filteredVehicles.length}
          onResetFilters={handleResetFilters}
          onExportCSV={handleExportCSV}
          activeTab={activeTab}
          bgWatermarkOpacity={bgWatermarkOpacity}
          onChangeBgOpacity={setBgWatermarkOpacity}
        />

        {/* Floating Mobile Filter Toggle Button */}
        {activeTab === 'home' && (
          <div className="lg:hidden px-4 pt-3 flex justify-end">
            <button
              onClick={() => setIsFilterOpenMobile(!isFilterOpenMobile)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#262F44] text-[#F6F4EB] hover:bg-[#35405A] shadow-xs cursor-pointer"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              {isFilterOpenMobile ? 'ซ่อนแผงตัวกรอง' : 'เปิดแผงตัวกรองข้อมูล'}
            </button>
          </div>
        )}

        {/* Dashboard Body */}
        <main className="flex-1 p-4 lg:p-6 max-w-[1700px] w-full mx-auto space-y-6 relative z-10">
          <AnimatePresence mode="wait">
            {/* TAB 1: HOME (PRIMARY DASHBOARD) */}
            {activeTab === 'home' && (
              <motion.div 
                key="tab-home"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.22, ease: 'easeOut' }}
                className="space-y-6"
              >
                {/* 3. KPI CARDS */}
                <KpiCards
                  stats={kpiStats}
                  totalBaselineVehicles={SYNTHETIC_EV_DATA.length}
                />

                {/* Main Visuals + Right Filter Panel Container */}
                <div className="flex flex-col xl:flex-row items-start gap-6">
                  {/* Visualizations Section (Charts & Table) */}
                  <div className="flex-1 min-w-0 w-full space-y-6">
                    {/* Visual Row 1: Scatter plot (Mileage vs Battery Health) + Donut (Model Distribution) */}
                    <motion.div 
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.35, delay: 0.05 }}
                      className="grid grid-cols-1 lg:grid-cols-12 gap-6"
                    >
                      <div className="lg:col-span-7">
                        <MileageScatterChart data={filteredVehicles} />
                      </div>
                      <div className="lg:col-span-5">
                        <ModelDistributionDonut data={filteredVehicles} />
                      </div>
                    </motion.div>

                    {/* Visual Row 1.5: EV Fleet Showcase & Telemetry Card (รูปรถ EV คมชัดพร้อมสเปกและสถิติฟลีท) */}
                    <motion.div
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.35, delay: 0.08 }}
                    >
                      <EVModelShowcaseCard 
                        data={filteredVehicles}
                        onSelectModel={(selectedModel) => {
                          setFilters({ ...filters, vehicleModel: selectedModel });
                        }}
                      />
                    </motion.div>

                    {/* Visual Row 2: Bar Chart (Charging Type) + Line Chart (Age Trend) + Gauge (Battery Health) */}
                    <motion.div 
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.35, delay: 0.12 }}
                      className="grid grid-cols-1 md:grid-cols-12 gap-6"
                    >
                      <div className="md:col-span-4">
                        <ChargingTypeBarChart data={filteredVehicles} />
                      </div>
                      <div className="md:col-span-5">
                        <AgeTrendLineChart data={filteredVehicles} />
                      </div>
                      <div className="md:col-span-3">
                        <BatteryHealthGauge currentHealth={kpiStats.averageBatteryHealth} />
                      </div>
                    </motion.div>

                    {/* Visual Row 3: 7. DATA TABLE (Sample Vehicle Data) */}
                    <motion.div
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.35, delay: 0.18 }}
                    >
                      <VehicleDataTable
                        data={filteredVehicles}
                        onExportCSV={handleExportCSV}
                        isCleanedMode={isCleanedMode}
                        onToggleCleanMode={() => setIsCleanedMode(!isCleanedMode)}
                      />
                    </motion.div>
                  </div>

                  {/* 4. FILTER PANEL + EV ARCHITECTURE (Desktop Docked on Right, or Mobile Overlay) */}
                  <div
                    className={`w-full xl:w-72 2xl:w-80 shrink-0 space-y-6 ${
                      isFilterOpenMobile ? 'block' : 'hidden xl:block'
                    }`}
                  >
                    <FilterPanel
                      filters={filters}
                      onFilterChange={(newFilters) => setFilters(newFilters)}
                      onReset={handleResetFilters}
                      filteredCount={filteredVehicles.length}
                      totalCount={SYNTHETIC_EV_DATA.length}
                    />

                    {/* 3D EV Skateboard Chassis & Architecture Telemetry Card (ช่องว่างใต้ Filter Panel) */}
                    <EVArchitectureCard currentAvgHealth={kpiStats.averageBatteryHealth} />
                  </div>
                </div>
              </motion.div>
            )}

            {/* TAB 2: BATTERY HEALTH PREDICTION (CRISP-DM Simulator) */}
            {activeTab === 'battery-health-prediction' && (
              <motion.div
                key="tab-prediction"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.22, ease: 'easeOut' }}
              >
                <PredictionSimulator />
              </motion.div>
            )}
          </AnimatePresence>

          {/* 9. FOOTER */}
          <Footer />
        </main>
      </div>
    </div>
  );
}
