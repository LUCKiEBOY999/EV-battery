import React, { useState, useMemo } from 'react';
import {
  Table as TableIcon,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Download,
  Search,
  CheckCircle,
  AlertCircle,
  AlertTriangle,
  Sparkles,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { VehicleRecord } from '../types';

interface VehicleDataTableProps {
  data: VehicleRecord[];
  onExportCSV: () => void;
  isCleanedMode?: boolean;
  onToggleCleanMode?: () => void;
}

type SortField =
  | 'id'
  | 'vehicleModel'
  | 'vehicleAge'
  | 'accumulatedMileage'
  | 'chargingCycles'
  | 'chargingType'
  | 'operatingTemperature'
  | 'currentRangeKm'
  | 'batteryHealth'
  | 'dataQuality';

export const VehicleDataTable: React.FC<VehicleDataTableProps> = ({ 
  data, 
  onExportCSV,
  isCleanedMode = false,
  onToggleCleanMode,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [qualityFilter, setQualityFilter] = useState<'All' | 'Clean' | 'Missing' | 'Error'>('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [sortField, setSortField] = useState<SortField>('accumulatedMileage');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [jumpPage, setJumpPage] = useState('');

  // Calculate quality counts
  const qualityCounts = useMemo(() => {
    let clean = 0;
    let missing = 0;
    let error = 0;
    for (let i = 0; i < data.length; i++) {
      if (data[i].dataQuality === 'Clean') clean++;
      else if (data[i].dataQuality === 'Missing') missing++;
      else if (data[i].dataQuality === 'Error') error++;
    }
    return { total: data.length, clean, missing, error };
  }, [data]);

  // Handle column sorting
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  // Filter and sort records
  const filteredData = useMemo(() => {
    let result = data;

    // Quality filter
    if (qualityFilter !== 'All') {
      result = result.filter((r) => r.dataQuality === qualityFilter);
    }

    if (searchTerm.trim() !== '') {
      const q = searchTerm.toLowerCase();
      result = result.filter(
        (r) =>
          r.id.toLowerCase().includes(q) ||
          r.vehicleModel.toLowerCase().includes(q) ||
          r.chargingType.toLowerCase().includes(q) ||
          r.status.toLowerCase().includes(q) ||
          (r.errorDetail && r.errorDetail.toLowerCase().includes(q))
      );
    }

    return [...result].sort((a, b) => {
      let valA: any = a[sortField];
      let valB: any = b[sortField];

      if (valA === null || valA === undefined) return sortOrder === 'asc' ? 1 : -1;
      if (valB === null || valB === undefined) return sortOrder === 'asc' ? -1 : 1;

      if (typeof valA === 'string') {
        return sortOrder === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }
      return sortOrder === 'asc' ? valA - valB : valB - valA;
    });
  }, [data, searchTerm, qualityFilter, sortField, sortOrder]);

  const totalPages = Math.max(1, Math.ceil(filteredData.length / pageSize));
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, currentPage, pageSize]);

  return (
    <div
      id="sample-vehicle-data-table"
      className="bg-[#FCFAF6] rounded-xl border border-[#DEE5ED] shadow-xs p-4 flex flex-col justify-between"
    >
      {/* Table Header Controls */}
      <div className="flex flex-col gap-3 pb-3 border-b border-[#DEE5ED]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-[#262F44] tracking-tight flex items-center gap-1.5 font-display">
                <TableIcon className="w-4 h-4 text-[#262F44]" />
                ตารางข้อมูลยานพาหนะ (Vehicle Dataset Table)
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#DEE5ED] text-[#262F44] border border-[#C1CCD6] font-mono">
                ชุดข้อมูลใหญ่ 100,000 คัน
              </span>
              {isCleanedMode && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#DEE5ED] text-[#262F44] border border-[#C1CCD6] flex items-center gap-1">
                  <CheckCircle className="w-3 h-3 text-[#262F44]" />
                  ผ่านการคลีนข้อมูลแล้ว (CRISP-DM Phase 3)
                </span>
              )}
            </div>
            <p className="text-[11px] text-[#64748B]">
              แสดงข้อมูลเทเลเมทรีของยานพาหนะทั้งหมด {data.length.toLocaleString()} คัน พร้อมระบบจำลองข้อมูลสูญหาย (Missing) และข้อผิดพลาดจากเซนเซอร์ (Error)
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Table Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 transform -translate-y-1/2 text-[#8E9EA8]" />
              <input
                type="text"
                id="table-quick-search"
                placeholder="ค้นหารหัส, รุ่น, error, ข้อผิดพลาด..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="text-xs pl-8 pr-3 py-1.5 rounded-lg border border-[#DEE5ED] focus:outline-none focus:ring-1 focus:ring-[#262F44] bg-[#F6F4EB] text-[#262F44] placeholder-[#8E9EA8] w-60"
              />
            </div>

            {onToggleCleanMode && (
              <motion.button
                type="button"
                onClick={onToggleCleanMode}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer border ${
                  isCleanedMode
                    ? 'bg-[#262F44] text-[#F6F4EB] border-[#35405A] shadow-xs'
                    : 'bg-[#F6F4EB] text-[#262F44] border-[#DEE5ED] hover:bg-[#DEE5ED]'
                }`}
                title="สลับระหว่างข้อมูลดิบ (มี Missing/Error) กับข้อมูลที่ผ่านการ Cleansing แล้ว"
              >
                <motion.div
                  animate={{ rotate: isCleanedMode ? 360 : 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <CheckCircle className={`w-3.5 h-3.5 ${isCleanedMode ? 'text-[#F6F4EB]' : 'text-[#262F44]'}`} />
                </motion.div>
                {isCleanedMode ? 'คลีนข้อมูลแล้ว (Imputed)' : 'ทำความสะอาดข้อมูล (CRISP-DM)'}
              </motion.button>
            )}

            <motion.button
              onClick={onExportCSV}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-[#262F44] bg-[#DEE5ED] hover:bg-[#C1CCD6] border border-[#C1CCD6] transition-colors cursor-pointer"
              title="ดาวน์โหลดไฟล์ CSV ทั้งหมด"
            >
              <Download className="w-3.5 h-3.5 text-[#262F44]" />
              ส่งออก CSV
            </motion.button>
          </div>
        </div>

        {/* Quality Tabs Filter & Metric Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-[#DEE5ED]">
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-semibold text-[#64748B] mr-1">กรองคุณภาพข้อมูล:</span>
            <motion.button
              type="button"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                setQualityFilter('All');
                setCurrentPage(1);
              }}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer ${
                qualityFilter === 'All'
                  ? 'bg-[#262F44] text-[#F6F4EB] shadow-xs'
                  : 'bg-[#F6F4EB] text-[#35405A] hover:bg-[#DEE5ED] border border-[#DEE5ED]'
              }`}
            >
              ทั้งหมด ({qualityCounts.total.toLocaleString()})
            </motion.button>
            <motion.button
              type="button"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                setQualityFilter('Clean');
                setCurrentPage(1);
              }}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer flex items-center gap-1 ${
                qualityFilter === 'Clean'
                  ? 'bg-[#35405A] text-[#F6F4EB] shadow-xs'
                  : 'bg-[#DEE5ED] text-[#262F44] hover:bg-[#C1CCD6] border border-[#C1CCD6]'
              }`}
            >
              <CheckCircle className="w-3 h-3" />
              ข้อมูลปกติ ({qualityCounts.clean.toLocaleString()})
            </motion.button>
            <motion.button
              type="button"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                setQualityFilter('Missing');
                setCurrentPage(1);
              }}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer flex items-center gap-1 ${
                qualityFilter === 'Missing'
                  ? 'bg-[#8E9EA8] text-[#262F44] shadow-xs'
                  : 'bg-[#F6F4EB] text-[#64748B] hover:bg-[#DEE5ED] border border-[#DEE5ED]'
              }`}
            >
              <AlertCircle className="w-3 h-3" />
              ข้อมูลสูญหาย Missing ({qualityCounts.missing.toLocaleString()})
            </motion.button>
            <motion.button
              type="button"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                setQualityFilter('Error');
                setCurrentPage(1);
              }}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer flex items-center gap-1 ${
                qualityFilter === 'Error'
                  ? 'bg-[#A35252] text-[#F6F4EB] shadow-xs'
                  : 'bg-[#FDF1F1] text-[#A35252] hover:bg-[#F2D6D6] border border-[#F2D6D6]'
              }`}
            >
              <AlertTriangle className="w-3 h-3" />
              ข้อผิดพลาดเซนเซอร์ Error ({qualityCounts.error.toLocaleString()})
            </motion.button>
          </div>

          <div className="text-[11px] text-[#64748B] font-mono">
            แสดงผล: <span className="font-bold text-[#262F44]">{filteredData.length.toLocaleString()}</span> รายการ
          </div>
        </div>
      </div>

      {/* Table Element */}
      <div className="overflow-x-auto mt-2">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-[#F6F4EB] text-[#262F44] font-semibold border-b border-[#DEE5ED]">
              <th
                onClick={() => handleSort('id')}
                className="py-2.5 px-3 cursor-pointer hover:text-[#35405A]"
              >
                <div className="flex items-center gap-1">
                  <span>รหัส (ID)</span>
                  <ArrowUpDown className="w-3 h-3 text-[#8E9EA8]" />
                </div>
              </th>
              <th
                onClick={() => handleSort('vehicleModel')}
                className="py-2.5 px-3 cursor-pointer hover:text-[#35405A]"
              >
                <div className="flex items-center gap-1">
                  <span>รุ่นยานยนต์</span>
                  <ArrowUpDown className="w-3 h-3 text-[#8E9EA8]" />
                </div>
              </th>
              <th
                onClick={() => handleSort('vehicleAge')}
                className="py-2.5 px-3 cursor-pointer hover:text-[#35405A]"
              >
                <div className="flex items-center gap-1">
                  <span>อายุ (ปี)</span>
                  <ArrowUpDown className="w-3 h-3 text-[#8E9EA8]" />
                </div>
              </th>
              <th
                onClick={() => handleSort('accumulatedMileage')}
                className="py-2.5 px-3 cursor-pointer hover:text-[#35405A]"
              >
                <div className="flex items-center gap-1">
                  <span>ระยะทางสะสม (กม.)</span>
                  <ArrowUpDown className="w-3 h-3 text-[#8E9EA8]" />
                </div>
              </th>
              <th
                onClick={() => handleSort('chargingCycles')}
                className="py-2.5 px-3 cursor-pointer hover:text-[#35405A]"
              >
                <div className="flex items-center gap-1">
                  <span>รอบชาร์จ</span>
                  <ArrowUpDown className="w-3 h-3 text-[#8E9EA8]" />
                </div>
              </th>
              <th
                onClick={() => handleSort('chargingType')}
                className="py-2.5 px-3 cursor-pointer hover:text-[#35405A]"
              >
                <div className="flex items-center gap-1">
                  <span>การชาร์จ</span>
                  <ArrowUpDown className="w-3 h-3 text-[#8E9EA8]" />
                </div>
              </th>
              <th
                onClick={() => handleSort('operatingTemperature')}
                className="py-2.5 px-3 cursor-pointer hover:text-[#35405A]"
              >
                <div className="flex items-center gap-1">
                  <span>อุณหภูมิ (°C)</span>
                  <ArrowUpDown className="w-3 h-3 text-[#8E9EA8]" />
                </div>
              </th>
              <th
                onClick={() => handleSort('currentRangeKm')}
                className="py-2.5 px-3 cursor-pointer hover:text-[#35405A]"
              >
                <div className="flex items-center gap-1">
                  <span>ระยะวิ่งจริง (กม.)</span>
                  <ArrowUpDown className="w-3 h-3 text-[#8E9EA8]" />
                </div>
              </th>
              <th
                onClick={() => handleSort('batteryHealth')}
                className="py-2.5 px-3 cursor-pointer hover:text-[#35405A]"
              >
                <div className="flex items-center gap-1">
                  <span>สุขภาพแบตฯ (SoH %)</span>
                  <ArrowUpDown className="w-3 h-3 text-[#8E9EA8]" />
                </div>
              </th>
              <th
                onClick={() => handleSort('dataQuality')}
                className="py-2.5 px-3 cursor-pointer hover:text-[#35405A] text-right"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>คุณภาพข้อมูล (Quality)</span>
                  <ArrowUpDown className="w-3 h-3 text-[#8E9EA8]" />
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#DEE5ED]">
            {paginatedData.map((row, idx) => {
              // Health status indicator
              const isOptimal = row.batteryHealth >= 85;
              const isNormal = row.batteryHealth >= 70 && row.batteryHealth < 85;
              const chargingLabel = row.chargingType === 'Home' ? 'ชาร์จบ้าน' : row.chargingType === 'AC' ? 'AC' : 'DC Fast';

              return (
                <motion.tr 
                  key={row.id} 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.15, delay: Math.min(0.2, idx * 0.008) }}
                  className="hover:bg-[#DEE5ED]/40 transition-colors"
                >
                  <td className="py-2 px-3 font-mono font-medium text-[#262F44]">
                    {row.id}
                  </td>
                  <td className="py-2 px-3 font-semibold text-[#262F44]">
                    {row.vehicleModel}
                  </td>
                  <td className="py-2 px-3 text-[#35405A] font-mono">
                    {row.vehicleAge.toFixed(1)}
                  </td>
                  <td className="py-2 px-3 text-[#262F44] font-mono font-medium">
                    {row.accumulatedMileage.toLocaleString()}
                  </td>
                  <td className="py-2 px-3 text-[#35405A] font-mono">
                    {row.chargingCycles === null ? (
                      <span
                        className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-[#F6F4EB] text-[#64748B] border border-[#DEE5ED] cursor-help"
                        title={row.errorDetail || 'ข้อมูลสูญหาย (N/A)'}
                      >
                        N/A (สูญหาย)
                      </span>
                    ) : row.chargingCycles > 10000 ? (
                      <span
                        className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#FDF1F1] text-[#A35252] border border-[#F2D6D6] cursor-help"
                        title={row.errorDetail || 'รอบชาร์จผิดปกติ'}
                      >
                        <AlertTriangle className="w-2.5 h-2.5" />
                        {row.chargingCycles.toLocaleString()} ⚠️ Error
                      </span>
                    ) : (
                      row.chargingCycles
                    )}
                  </td>
                  <td className="py-2 px-3">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold border ${
                        row.chargingType === 'Home'
                          ? 'bg-[#DEE5ED] text-[#262F44] border-[#C1CCD6]'
                          : row.chargingType === 'AC'
                          ? 'bg-[#F6F4EB] text-[#35405A] border-[#DEE5ED]'
                          : 'bg-[#FCFAF6] text-[#64748B] border-[#DEE5ED]'
                      }`}
                    >
                      {chargingLabel}
                    </span>
                  </td>
                  <td className="py-2 px-3 text-[#35405A] font-mono">
                    {row.operatingTemperature === null ? (
                      <span
                        className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-[#F6F4EB] text-[#64748B] border border-[#DEE5ED] cursor-help"
                        title={row.errorDetail || 'เซนเซอร์อุณหภูมิขาดการเชื่อมต่อ (N/A)'}
                      >
                        N/A (สูญหาย)
                      </span>
                    ) : (row.operatingTemperature > 60 || row.operatingTemperature < 0) ? (
                      <span
                        className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#FDF1F1] text-[#A35252] border border-[#F2D6D6] cursor-help"
                        title={row.errorDetail || 'อุณหภูมิผิดปกติจากเซนเซอร์'}
                      >
                        <AlertTriangle className="w-2.5 h-2.5" />
                        {row.operatingTemperature.toFixed(1)}°C ⚠️ Glitch
                      </span>
                    ) : (
                      <span
                        className={
                          row.operatingTemperature > 32
                            ? 'text-[#A35252] font-bold'
                            : 'text-[#262F44]'
                        }
                      >
                        {row.operatingTemperature.toFixed(1)}°C
                      </span>
                    )}
                  </td>
                  <td className="py-2 px-3 text-[#262F44] font-mono">
                    {row.currentRangeKm === null ? (
                      <span
                        className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-[#F6F4EB] text-[#64748B] border border-[#DEE5ED] cursor-help"
                        title={row.errorDetail || 'ข้อมูลระยะทางสูญหาย (N/A)'}
                      >
                        N/A (สูญหาย)
                      </span>
                    ) : row.currentRangeKm > row.nominalRangeKm * 1.5 ? (
                      <span
                        className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#FDF1F1] text-[#A35252] border border-[#F2D6D6] cursor-help"
                        title={row.errorDetail || 'ระยะทางประเมินสูงผิดปกติ'}
                      >
                        <AlertTriangle className="w-2.5 h-2.5" />
                        {row.currentRangeKm} กม. ⚠️ Glitch
                      </span>
                    ) : (
                      <>
                        <span className="font-semibold text-[#262F44]">{row.currentRangeKm}</span>
                        <span className="text-[10px] text-[#8E9EA8]"> / {row.nominalRangeKm} กม.</span>
                      </>
                    )}
                  </td>
                  <td className="py-2 px-3 font-mono font-bold">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold border ${
                        isOptimal
                          ? 'bg-[#262F44] text-[#F6F4EB] border-[#35405A]'
                          : isNormal
                          ? 'bg-[#DEE5ED] text-[#262F44] border-[#C1CCD6]'
                          : 'bg-[#FDF1F1] text-[#A35252] border-[#F2D6D6]'
                      }`}
                    >
                      {isOptimal ? (
                        <CheckCircle className="w-3 h-3 text-[#F6F4EB]" />
                      ) : isNormal ? (
                        <CheckCircle className="w-3 h-3 text-[#262F44]" />
                      ) : (
                        <AlertTriangle className="w-3 h-3 text-[#A35252]" />
                      )}
                      {row.batteryHealth.toFixed(1)}%
                    </span>
                  </td>
                  <td className="py-2 px-3 text-right font-mono">
                    {row.dataQuality === 'Clean' ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#DEE5ED] text-[#262F44] border border-[#C1CCD6]">
                        <CheckCircle className="w-2.5 h-2.5 text-[#262F44]" />
                        สมบูรณ์
                      </span>
                    ) : row.dataQuality === 'Missing' ? (
                      <span
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#F6F4EB] text-[#64748B] border border-[#DEE5ED] cursor-help"
                        title={row.errorDetail || 'มีข้อมูลสูญหาย'}
                      >
                        <AlertCircle className="w-2.5 h-2.5 text-[#64748B]" />
                        สูญหาย (N/A)
                      </span>
                    ) : (
                      <span
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#FDF1F1] text-[#A35252] border border-[#F2D6D6] cursor-help"
                        title={row.errorDetail || 'มีข้อผิดพลาด/เซนเซอร์เสีย'}
                      >
                        <AlertTriangle className="w-2.5 h-2.5 text-[#A35252]" />
                        ข้อผิดพลาด
                      </span>
                    )}
                  </td>
                </motion.tr>
              );
            })}
            {paginatedData.length === 0 && (
              <tr>
                <td colSpan={10} className="py-6 text-center text-[#8E9EA8]">
                  ไม่พบข้อมูลยานพาหนะตามเงื่อนไขตัวกรองที่เลือก
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="mt-3 pt-2.5 border-t border-[#DEE5ED] flex flex-col lg:flex-row items-center justify-between text-xs text-[#64748B] gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <span>แถวต่อหน้า:</span>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="border border-[#DEE5ED] rounded-lg px-2 py-0.5 bg-[#F6F4EB] text-xs text-[#262F44] cursor-pointer"
          >
            <option value={15}>15</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
            <option value={250}>250</option>
            <option value={500}>500</option>
          </select>
          <span>
            แสดง {filteredData.length > 0 ? (currentPage - 1) * pageSize + 1 : 0}–
            {Math.min(currentPage * pageSize, filteredData.length).toLocaleString()} จาก {filteredData.length.toLocaleString()} รายการ
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
            className="p-1 rounded border border-[#DEE5ED] hover:bg-[#DEE5ED] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer text-[#262F44]"
            title="หน้าแรก"
          >
            <ChevronsLeft className="w-4 h-4 text-[#262F44]" />
          </button>
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-1 rounded border border-[#DEE5ED] hover:bg-[#DEE5ED] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer text-[#262F44]"
            title="หน้าก่อนหน้า"
          >
            <ChevronLeft className="w-4 h-4 text-[#262F44]" />
          </button>
          <span className="px-2 font-medium text-[#262F44]">
            หน้า {currentPage.toLocaleString()} / {totalPages.toLocaleString()}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="p-1 rounded border border-[#DEE5ED] hover:bg-[#DEE5ED] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer text-[#262F44]"
            title="หน้าถัดไป"
          >
            <ChevronRight className="w-4 h-4 text-[#262F44]" />
          </button>
          <button
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
            className="p-1 rounded border border-[#DEE5ED] hover:bg-[#DEE5ED] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer text-[#262F44]"
            title="หน้าสุดท้าย"
          >
            <ChevronsRight className="w-4 h-4 text-[#262F44]" />
          </button>

          {/* Jump to page */}
          <div className="flex items-center gap-1 ml-1 pl-2 border-l border-[#DEE5ED]">
            <span className="text-[11px] text-[#64748B]">ไปหน้า:</span>
            <input
              type="number"
              min={1}
              max={totalPages}
              value={jumpPage}
              onChange={(e) => setJumpPage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  const val = parseInt(jumpPage, 10);
                  if (!isNaN(val) && val >= 1 && val <= totalPages) {
                    setCurrentPage(val);
                    setJumpPage('');
                  }
                }
              }}
              placeholder={currentPage.toString()}
              className="w-14 px-1.5 py-0.5 text-xs text-center border border-[#DEE5ED] rounded-lg font-mono bg-[#F6F4EB] text-[#262F44]"
            />
            <button
              onClick={() => {
                const val = parseInt(jumpPage, 10);
                if (!isNaN(val) && val >= 1 && val <= totalPages) {
                  setCurrentPage(val);
                  setJumpPage('');
                }
              }}
              className="px-2 py-0.5 rounded bg-[#DEE5ED] text-[#262F44] hover:bg-[#C1CCD6] border border-[#C1CCD6] text-xs font-semibold cursor-pointer"
            >
              ไป
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
