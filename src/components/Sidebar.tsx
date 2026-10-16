import React from 'react';
import { 
  LayoutDashboard, 
  Cpu, 
  BatteryCharging,
  Layers,
  ChevronRight
} from 'lucide-react';
import { motion } from 'motion/react';
import { NavigationTab } from '../types';
import { EvIllustration } from './EvIllustration';

interface SidebarProps {
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  collapsed?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const navItems = [
    {
      id: 'home' as NavigationTab,
      label: 'หน้าหลัก',
      icon: LayoutDashboard,
      badge: 'สด',
    },
    {
      id: 'battery-health-prediction' as NavigationTab,
      label: 'การทำนายสุขภาพแบตเตอรี่',
      icon: Cpu,
      badge: 'ML จำลอง',
    },
  ];

  return (
    <aside
      id="main-sidebar"
      className="w-64 bg-[#262F44] text-[#F6F4EB] flex flex-col justify-between border-r border-[#35405A] shrink-0 h-screen sticky top-0 shadow-xl z-30 font-sans"
    >
      {/* Top Section: Logo & Brand */}
      <div>
        <div className="p-5 border-b border-[#35405A]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#35405A] to-[#1D2436] flex items-center justify-center shadow-lg shadow-black/30 ring-2 ring-[#C1CCD6]/30 border border-[#C1CCD6]/20">
              <BatteryCharging className="w-5 h-5 text-[#F6F4EB]" />
            </div>
            <div>
              <h1 className="font-bold text-sm tracking-tight text-[#F6F4EB] leading-tight font-display">
                สุขภาพแบตเตอรี่ EV
              </h1>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#1D2436]/80 border border-[#35405A]">
            <Layers className="w-3.5 h-3.5 text-[#C1CCD6]" />
            <span className="text-[11px] text-[#C1CCD6] font-medium">
              พื้นที่วิเคราะห์แบบ Power BI
            </span>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="p-3 space-y-1 relative" aria-label="Dashboard Navigation">
          <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#C1CCD6]/70">
            เมนูการนำทาง
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <motion.button
                key={item.id}
                id={`nav-tab-${item.id}`}
                onClick={() => setActiveTab(item.id)}
                whileHover={{ x: 3 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full relative flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  isActive
                    ? 'text-[#F6F4EB] font-semibold'
                    : 'text-[#C1CCD6] hover:text-[#F6F4EB] hover:bg-[#35405A]/50'
                }`}
              >
                {/* Smooth Animated Active Pill */}
                {isActive && (
                  <motion.div
                    layoutId="activeSidebarIndicator"
                    className="absolute inset-0 bg-[#35405A] border border-[#C1CCD6]/30 rounded-lg shadow-md shadow-black/20 -z-10"
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}

                <div className="flex items-center gap-2.5 min-w-0 z-10">
                  <Icon className={`w-4 h-4 shrink-0 transition-colors ${isActive ? 'text-[#F6F4EB]' : 'text-[#C1CCD6]'}`} />
                  <span className="truncate">{item.label}</span>
                </div>
                <div className="flex items-center gap-1 z-10">
                  {item.badge && (
                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded font-mono transition-colors ${
                        isActive
                          ? 'bg-[#C1CCD6] text-[#262F44] font-bold'
                          : 'bg-[#1D2436] text-[#C1CCD6]'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                  {isActive && <ChevronRight className="w-3.5 h-3.5 text-[#C1CCD6]" />}
                </div>
              </motion.button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section: EV Illustration + CRISP-DM Badge */}
      <div className="p-4 border-t border-[#35405A] space-y-3">
        <EvIllustration />

        <div className="px-2.5 py-2 rounded-lg bg-[#1D2436]/80 border border-[#35405A] text-[11px] text-[#C1CCD6] flex items-center justify-between">
          <span className="font-medium text-[#F6F4EB]/80">ระเบียบวิธีวิจัย</span>
          <span className="text-[#C1CCD6] font-mono font-semibold">CRISP-DM v1.0</span>
        </div>
      </div>
    </aside>
  );
};
