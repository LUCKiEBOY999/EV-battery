import React from 'react';
import { BatteryCharging, Car, Gauge, RotateCw, Thermometer, TrendingUp, CheckCircle2, AlertTriangle, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { KPIStats } from '../types';

interface KpiCardsProps {
  stats: KPIStats;
  totalBaselineVehicles: number;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 16, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring' as const,
      stiffness: 260,
      damping: 22,
    },
  },
};

export const KpiCards: React.FC<KpiCardsProps> = ({ stats }) => {
  const cards = [
    {
      id: 'kpi-battery-health',
      title: 'สุขภาพแบตเตอรี่เฉลี่ย',
      value: `${stats.averageBatteryHealth.toFixed(1)}%`,
      subtitle: 'เกณฑ์ปกติ: 60%–100% (สมบูรณ์)',
      tag: stats.averageBatteryHealth >= 75 ? 'สภาพปกติ' : 'ช่วงเฝ้าระวัง',
      tagColor: stats.averageBatteryHealth >= 75 ? 'bg-[#DEE5ED] text-[#262F44] border-[#C1CCD6]' : 'bg-[#F6F4EB] text-[#262F44] border-[#DEE5ED]',
      icon: BatteryCharging,
      iconColor: 'text-[#262F44]',
      iconBg: 'bg-[#DEE5ED] border-[#C1CCD6]',
      numericValue: stats.averageBatteryHealth,
    },
    {
      id: 'kpi-total-vehicles',
      title: 'จำนวนยานพาหนะทั้งหมด',
      value: stats.totalVehicles.toLocaleString(),
      subtitle: 'กลุ่มตัวอย่างยานยนต์ในฟลีท',
      tag: 'ตรวจสอบครบ 100%',
      tagColor: 'bg-[#DEE5ED] text-[#262F44] border-[#C1CCD6]',
      icon: Car,
      iconColor: 'text-[#262F44]',
      iconBg: 'bg-[#DEE5ED] border-[#C1CCD6]',
      numericValue: stats.totalVehicles,
    },
    {
      id: 'kpi-average-mileage',
      title: 'ระยะทางวิ่งเฉลี่ย',
      value: `${stats.averageMileage.toLocaleString()} กม.`,
      subtitle: 'เฉลี่ย ~13,200 กม./ปี',
      tag: 'บันทึกจากระบบเทเลเมทรี',
      tagColor: 'bg-[#F6F4EB] text-[#35405A] border-[#DEE5ED]',
      icon: Gauge,
      iconColor: 'text-[#262F44]',
      iconBg: 'bg-[#DEE5ED] border-[#C1CCD6]',
      numericValue: stats.averageMileage,
    },
    {
      id: 'kpi-charging-cycles',
      title: 'รอบการชาร์จเฉลี่ย',
      value: `${stats.averageChargingCycles.toLocaleString()} รอบ`,
      subtitle: 'รวมแบบ AC, DC Fast และชาร์จบ้าน',
      tag: 'ภาระทางเคมีไฟฟ้า',
      tagColor: 'bg-[#DEE5ED] text-[#262F44] border-[#C1CCD6]',
      icon: RotateCw,
      iconColor: 'text-[#262F44]',
      iconBg: 'bg-[#DEE5ED] border-[#C1CCD6]',
      numericValue: stats.averageChargingCycles,
    },
    {
      id: 'kpi-operating-temp',
      title: 'อุณหภูมิการทำงานเฉลี่ย',
      value: `${stats.averageOperatingTemperature.toFixed(1)}°C`,
      subtitle: 'ช่วงที่เหมาะสม: 20°C–25°C',
      tag: stats.averageOperatingTemperature > 30 ? 'ความร้อนสะสมสูง' : 'สภาวะแวดล้อมปกติ',
      tagColor: stats.averageOperatingTemperature > 30 ? 'bg-[#F6F4EB] text-[#262F44] border-[#DEE5ED]' : 'bg-[#DEE5ED] text-[#262F44] border-[#C1CCD6]',
      icon: Thermometer,
      iconColor: 'text-[#262F44]',
      iconBg: 'bg-[#DEE5ED] border-[#C1CCD6]',
      numericValue: stats.averageOperatingTemperature,
    },
  ];

  const cleanPct = Number(((stats.cleanVehiclesCount / (stats.totalVehicles || 1)) * 100).toFixed(1));
  const missingPct = Number(((stats.missingValuesCount / (stats.totalVehicles || 1)) * 100).toFixed(1));
  const errorPct = Number(((stats.errorValuesCount / (stats.totalVehicles || 1)) * 100).toFixed(1));

  return (
    <section id="kpi-cards-section" aria-label="Key Performance Indicators" className="w-full">
      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.id}
              id={card.id}
              variants={cardVariants}
              whileHover={{ y: -3, transition: { duration: 0.2 } }}
              className="bg-[#FCFAF6] rounded-xl border border-[#DEE5ED] hover:border-[#C1CCD6] p-4 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between cursor-default group"
            >
              <div className="flex items-start justify-between gap-2">
                <span className="text-xs font-semibold text-[#64748B] tracking-wide line-clamp-1">
                  {card.title}
                </span>
                <motion.div 
                  whileHover={{ rotate: 12, scale: 1.08 }}
                  className={`w-8 h-8 rounded-lg ${card.iconBg} border flex items-center justify-center shrink-0 transition-transform shadow-2xs`}
                >
                  <Icon className={`w-4 h-4 ${card.iconColor}`} />
                </motion.div>
              </div>

              <div className="my-2">
                <motion.div 
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="text-2xl font-extrabold text-[#262F44] tracking-tight font-display"
                >
                  {card.value}
                </motion.div>
                <div className="text-[11px] text-[#64748B] mt-0.5 font-medium line-clamp-1">
                  {card.subtitle}
                </div>
              </div>

              <div className="pt-2 border-t border-[#DEE5ED] flex items-center justify-between">
                <span className={`inline-flex items-center text-[10px] font-semibold px-2 py-0.5 rounded-full border ${card.tagColor}`}>
                  <CheckCircle2 className="w-2.5 h-2.5 mr-1" />
                  {card.tag}
                </span>
                <TrendingUp className="w-3 h-3 text-[#64748B]" />
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Data Quality & Telemetry Health Mini-Bar with Animated Progress Bar */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
        className="mt-3 bg-[#FCFAF6] rounded-xl border border-[#DEE5ED] p-3.5 shadow-xs"
      >
        <div className="flex flex-wrap items-center justify-between text-xs gap-2 mb-2">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <span className="font-bold text-[#262F44] flex items-center gap-1.5 font-display">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C1CCD6] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#262F44]"></span>
              </span>
              คุณภาพข้อมูลเทเลเมทรี (Data Quality):
            </span>
            <span className="text-[#35405A] flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#262F44] inline-block"></span>
              ปกติ: <strong className="text-[#262F44] font-mono">{stats.cleanVehiclesCount.toLocaleString()}</strong> ({cleanPct}%)
            </span>
            <span className="text-[#C1CCD6]">|</span>
            <span className="text-[#35405A] flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#8E9EA8] inline-block"></span>
              ค่าสูญหาย (Missing): <strong className="text-[#35405A] font-mono">{stats.missingValuesCount.toLocaleString()}</strong> ({missingPct}%)
            </span>
            <span className="text-[#C1CCD6]">|</span>
            <span className="text-[#35405A] flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#C1CCD6] inline-block"></span>
              เซนเซอร์ผิดพลาด (Error): <strong className="text-[#64748B] font-mono">{stats.errorValuesCount.toLocaleString()}</strong> ({errorPct}%)
            </span>
          </div>
          <div className="text-[11px] text-[#64748B] font-medium">
            CRISP-DM Phase 2 & 3: รองรับระบบเติมเต็มค่าสูญหายและคัดกรอง Error
          </div>
        </div>

        {/* Animated Visual Segmented Progress Bar */}
        <div className="w-full h-2 bg-[#DEE5ED] rounded-full overflow-hidden flex shadow-inner">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${cleanPct}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="h-full bg-[#262F44] relative group cursor-pointer"
            title={`ปกติ (Clean): ${cleanPct}%`}
          />
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${missingPct}%` }}
            transition={{ duration: 0.8, delay: 0.15, ease: 'easeOut' }}
            className="h-full bg-[#8E9EA8] relative group cursor-pointer"
            title={`ค่าสูญหาย (Missing): ${missingPct}%`}
          />
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${errorPct}%` }}
            transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
            className="h-full bg-[#C1CCD6] relative group cursor-pointer"
            title={`เซนเซอร์ผิดพลาด (Error): ${errorPct}%`}
          />
        </div>
      </motion.div>
    </section>
  );
};
