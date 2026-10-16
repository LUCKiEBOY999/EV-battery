import React from 'react';
import { Info, Sparkles, BookOpen, Layers } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer
      id="dashboard-footer"
      className="mt-8 pt-4 pb-6 border-t border-[#DEE5ED] text-xs text-[#64748B] flex flex-col sm:flex-row items-center justify-between gap-3 px-1"
    >
      <div className="flex items-center gap-2">
        <span className="font-semibold text-[#262F44]">แดชบอร์ดสุขภาพแบตเตอรี่รถยนต์ไฟฟ้า (EV) | ต้นแบบ</span>
        <span className="text-[#DEE5ED]">•</span>
        <span className="inline-flex items-center gap-1 text-[#64748B] font-medium">
          <Sparkles className="w-3 h-3 text-[#262F44]" />
          แหล่งข้อมูล: <span className="font-bold text-[#262F44]">ชุดข้อมูลสังเคราะห์ (Synthetic Data)</span>
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-3 text-[#64748B]">
        <span className="flex items-center gap-1">
          <Layers className="w-3 h-3 text-[#35405A]" />
          วงจร CRISP-DM: การประเมินผลและการนำไปใช้งานจริง
        </span>
        <span className="text-[#DEE5ED]">•</span>
        <span className="flex items-center gap-1">
          <BookOpen className="w-3 h-3 text-[#262F44]" />
          แมชชีนเลิร์นนิง: Random Forest Regressor
        </span>
        <span className="text-[#DEE5ED]">•</span>
        <span>เพื่อวัตถุประสงค์ทางวิชาการและการศึกษา</span>
      </div>
    </footer>
  );
};
