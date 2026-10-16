import React, { useState } from 'react';
import { Zap } from 'lucide-react';
import { motion } from 'motion/react';

export const EvIllustration: React.FC = () => {
  const [isSupercharge, setIsSupercharge] = useState(false);

  return (
    <motion.div 
      whileHover={{ scale: 1.01 }}
      className="p-3 bg-slate-900/90 rounded-xl border border-slate-800/80 text-slate-300 shadow-md relative overflow-hidden group cursor-pointer transition-colors hover:border-slate-700 select-none"
      onClick={() => setIsSupercharge(!isSupercharge)}
      title="คลิกเพื่อสลับโหมดชาร์จปกติ / ชาร์จด่วนพิเศษ (DC Boost)"
    >
      {/* Background ambient lighting */}
      <div className="absolute -top-10 -right-10 w-28 h-28 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-28 h-28 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

      {/* Header: Title on single line + status pill */}
      <div className="flex items-center justify-between gap-2 mb-2 relative z-10">
        <span className="text-[11px] font-semibold text-slate-200 whitespace-nowrap">
          สถานีชาร์จยานยนต์ไฟฟ้า
        </span>
        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 whitespace-nowrap shrink-0 shadow-xs">
          <motion.span 
            animate={{ scale: [1, 1.4, 1], opacity: [0.7, 1, 0.7] }}
            transition={{ repeat: Infinity, duration: isSupercharge ? 0.7 : 1.5, ease: 'easeInOut' }}
            className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1 shadow-[0_0_6px_#34d399]"
          />
          กำลังทำงาน
        </span>
      </div>

      {/* SVG Canvas (240 x 100) */}
      <div className="w-full h-24 flex items-center justify-center relative overflow-hidden bg-gradient-to-b from-slate-950/80 to-slate-900/90 rounded-lg p-1.5 border border-slate-800/50">
        <svg
          viewBox="0 0 240 100"
          className="w-full h-full"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Ground Line */}
          <line x1="8" y1="88" x2="232" y2="88" stroke="#334155" strokeWidth="2" strokeDasharray="4 3" />

          {/* Road dash movement effect */}
          <motion.line
            x1="8" y1="88" x2="232" y2="88"
            stroke="#64748b"
            strokeWidth="1.5"
            strokeDasharray="8 12"
            animate={{ strokeDashoffset: [20, 0] }}
            transition={{ repeat: Infinity, duration: 2.5, ease: 'linear' }}
            opacity="0.35"
          />

          {/* ================= 1. CHARGING STATION (LEFT SIDE x=14) ================= */}
          <g transform="translate(14, 26)">
            {/* Charger Glow Aura */}
            <motion.rect
              x="-2" y="12" width="26" height="52" rx="6"
              fill="#0284c7"
              opacity="0.1"
              animate={{ opacity: [0.08, 0.22, 0.08] }}
              transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
            />

            {/* Base Pillar: sits on ground (y=14 + height 48 = 62 relative to 26 -> global y=88) */}
            <rect x="0" y="14" width="22" height="48" rx="4" fill="#1e293b" stroke="#38bdf8" strokeWidth="1.5" />
            
            {/* Screen background */}
            <rect x="3" y="20" width="16" height="13" rx="1.5" fill="#0284c7" fillOpacity="0.35" />
            
            {/* Animated Screen Battery / Progress Bars */}
            <motion.rect
              x="5" y="23" height="2" rx="0.5"
              fill="#38bdf8"
              animate={{ width: [3, 12, 12, 3] }}
              transition={{ repeat: Infinity, duration: isSupercharge ? 1.5 : 3, ease: 'easeInOut' }}
            />
            <motion.rect
              x="5" y="27" height="2" rx="0.5"
              fill="#38bdf8"
              opacity="0.75"
              animate={{ width: [1, 9, 12, 1] }}
              transition={{ repeat: Infinity, duration: isSupercharge ? 1.5 : 3, ease: 'easeInOut', delay: 0.2 }}
            />
            
            {/* Pulsing Lightning Bolt on Station */}
            <motion.path 
              d="M11 38 L8 46 L12 46 L9 54 L15 44 L11 44 Z" 
              fill="#38bdf8"
              animate={{ 
                opacity: [0.75, 1, 0.75],
                filter: [
                  'drop-shadow(0 0 1px #38bdf8)',
                  'drop-shadow(0 0 4px #38bdf8)',
                  'drop-shadow(0 0 1px #38bdf8)'
                ]
              }}
              transition={{ repeat: Infinity, duration: isSupercharge ? 0.7 : 1.4, ease: 'easeInOut' }}
            />
            
            {/* Status Light (Top) */}
            <motion.circle
              cx="11" cy="17" r="2"
              fill="#10b981"
              animate={{ 
                opacity: [0.7, 1, 0.7],
                filter: ['drop-shadow(0 0 1px #10b981)', 'drop-shadow(0 0 3px #10b981)', 'drop-shadow(0 0 1px #10b981)']
              }}
              transition={{ repeat: Infinity, duration: 1.2 }}
            />

            {/* Cable exit socket on right edge of pillar */}
            <rect x="20" y="44" width="3" height="5" rx="1" fill="#38bdf8" />
          </g>

          {/* ================= 2. CHARGING CABLE (CONNECTS STATION TO CAR) ================= */}
          {/* Station socket is at global (36, 72). Car port is at global (108, 70). */}
          <g>
            {/* Base cable background path (outer dark rubber) */}
            <path
              d="M 36 72 C 48 74, 56 86, 72 86 C 86 86, 94 76, 106 70"
              stroke="#0f172a"
              strokeWidth="3.5"
              fill="none"
              strokeLinecap="round"
            />

            {/* Static Cable Outer Jacket (cyan-blue) */}
            <path
              d="M 36 72 C 48 74, 56 86, 72 86 C 86 86, 94 76, 106 70"
              stroke="#0284c7"
              strokeWidth="2.2"
              fill="none"
              strokeLinecap="round"
            />

            {/* Glowing animated electricity pulses traveling from station into car */}
            <motion.path
              d="M 36 72 C 48 74, 56 86, 72 86 C 86 86, 94 76, 106 70"
              stroke="#38bdf8"
              strokeWidth="2.2"
              fill="none"
              strokeLinecap="round"
              strokeDasharray="8 12"
              animate={{ strokeDashoffset: [40, 0] }}
              transition={{ repeat: Infinity, duration: isSupercharge ? 0.6 : 1.2, ease: 'linear' }}
            />

            {/* Core laser high-energy stream */}
            <motion.path
              d="M 36 72 C 48 74, 56 86, 72 86 C 86 86, 94 76, 106 70"
              stroke="#ffffff"
              strokeWidth="1.2"
              fill="none"
              strokeLinecap="round"
              strokeDasharray="4 24"
              animate={{ strokeDashoffset: [28, 0] }}
              transition={{ repeat: Infinity, duration: isSupercharge ? 0.45 : 0.9, ease: 'linear' }}
            />

            {/* Plug Connector Handle entering car charge port */}
            <g transform="translate(104, 68) rotate(-15)">
              <rect x="-2" y="-3" width="5" height="6" rx="1" fill="#f8fafc" stroke="#38bdf8" strokeWidth="0.8" />
            </g>
          </g>

          {/* ================= 3. EV CAR (PARKED ON RIGHT SIDE x=92, y=28) ================= */}
          {/* Using static SVG <g> for translation so Framer Motion cannot clobber x/y coordinates */}
          <g transform="translate(92, 28)">
            <motion.g 
              animate={{ y: [0, -1.2, 0] }}
              transition={{ repeat: Infinity, duration: 2.8, ease: 'easeInOut' }}
            >
              {/* Battery Underglow beneath chassis */}
              <motion.ellipse 
                cx="65" cy="58" rx="46" ry="3.5" 
                fill="#38bdf8"
                animate={{ opacity: isSupercharge ? [0.25, 0.6, 0.25] : [0.15, 0.4, 0.15] }}
                transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
              />

              {/* Car Shadow on Ground */}
              <ellipse cx="65" cy="60" rx="55" ry="4.5" fill="#000" fillOpacity="0.45" />

              {/* Car Body Main */}
              <path
                d="M10 50 
                   C12 40, 22 34, 34 32 
                   L48 22 
                   C52 18, 65 16, 85 16 
                   L102 24 
                   C115 28, 126 36, 128 46 
                   L129 52 
                   C128 54, 124 56, 120 56 
                   L10 56 
                   Z"
                fill="#2563eb"
              />
              {/* Car Lower Trim */}
              <path
                d="M10 52 L128 52 C126 56, 122 57, 116 57 L14 57 Z"
                fill="#1d4ed8"
              />

              {/* Car Roof & Window Frames */}
              <path
                d="M50 23 
                   C54 18, 64 17, 83 17 
                   L98 25 
                   C92 25, 54 24, 50 23 Z"
                fill="#0f172a"
              />

              {/* Windshield & Side Windows */}
              <path
                d="M52 25 L80 25 L80 34 L40 34 Z"
                fill="#38bdf8"
                fillOpacity="0.45"
              />
              <path
                d="M84 25 L98 28 L104 34 L84 34 Z"
                fill="#38bdf8"
                fillOpacity="0.45"
              />

              {/* Holographic battery charge indicator inside window */}
              <g transform="translate(56, 26)">
                <rect x="0" y="0" width="16" height="5" rx="1" fill="#0f172a" stroke="#38bdf8" strokeWidth="0.6" />
                <rect x="16" y="1.5" width="1" height="2" rx="0.3" fill="#38bdf8" />
                <motion.rect
                  x="1.5" y="1" height="3" rx="0.5"
                  fill="#38bdf8"
                  animate={{ width: [3, 8, 13, 3] }}
                  transition={{ repeat: Infinity, duration: isSupercharge ? 2 : 4, ease: 'easeInOut' }}
                />
              </g>

              {/* Headlight & Taillight */}
              <motion.path 
                d="M125 43 L128 46 L124 48 Z" 
                fill="#38bdf8"
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              />
              {/* Headlight Light Beam */}
              <motion.polygon
                points="128,46 142,42 142,50"
                fill="url(#headlightGradient)"
                animate={{ opacity: [0.2, 0.45, 0.2] }}
                transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
              />

              {/* Taillight */}
              <path d="M11 44 L10 48 L14 47 Z" fill="#ef4444" />

              {/* Charge Port Shockwaves & Aura at (16, 42) */}
              <g transform="translate(16, 42)">
                {/* Expanding Shockwave 1 */}
                <motion.circle 
                  cx="0" cy="0" r="3" 
                  fill="none" 
                  stroke="#38bdf8" 
                  strokeWidth="1.2"
                  animate={{ 
                    r: [3, 9, 13], 
                    opacity: [0.9, 0.35, 0],
                    strokeWidth: [1.4, 0.7, 0]
                  }}
                  transition={{ repeat: Infinity, duration: isSupercharge ? 0.9 : 1.8, ease: 'easeOut' }}
                />

                {/* Expanding Shockwave 2 (Offset) */}
                <motion.circle 
                  cx="0" cy="0" r="3" 
                  fill="none" 
                  stroke="#67e8f9" 
                  strokeWidth="1"
                  animate={{ 
                    r: [3, 8, 11], 
                    opacity: [0.8, 0.25, 0],
                    strokeWidth: [1.2, 0.5, 0]
                  }}
                  transition={{ repeat: Infinity, duration: isSupercharge ? 0.9 : 1.8, delay: 0.45, ease: 'easeOut' }}
                />

                {/* Charge Port Core Glowing Point */}
                <motion.circle 
                  cx="0" cy="0" r="2.8" 
                  fill="#38bdf8"
                  animate={{ 
                    scale: [1, 1.3, 1],
                    filter: [
                      'drop-shadow(0 0 2px #38bdf8)',
                      'drop-shadow(0 0 6px #67e8f9)',
                      'drop-shadow(0 0 2px #38bdf8)'
                    ]
                  }}
                  transition={{ repeat: Infinity, duration: isSupercharge ? 0.6 : 1.2, ease: 'easeInOut' }}
                />
              </g>

              {/* Floating Energy Sparks */}
              {[
                { cx: 20, cy: 36, delay: 0 },
                { cx: 36, cy: 22, delay: 0.5 },
                { cx: 72, cy: 16, delay: 1.1 },
              ].map((spark, idx) => (
                <motion.circle
                  key={idx}
                  cx={spark.cx}
                  cy={spark.cy}
                  r="1.2"
                  fill="#67e8f9"
                  animate={{
                    y: [0, -6, -12],
                    x: [0, 1.5, -1],
                    opacity: [0, 0.9, 0],
                    scale: [0.6, 1.3, 0.3]
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 2.2,
                    delay: spark.delay,
                    ease: 'easeOut'
                  }}
                />
              ))}

              {/* Wheels: Touching ground at global y=88 (28 + 50 + 9 + 1 = 88) */}
              {/* Front Wheel */}
              <g transform="translate(100, 50)">
                <circle cx="0" cy="0" r="9" fill="#0f172a" stroke="#475569" strokeWidth="2" />
                <circle cx="0" cy="0" r="4.5" fill="#94a3b8" />
                <circle cx="0" cy="0" r="2" fill="#0f172a" />
              </g>
              {/* Rear Wheel */}
              <g transform="translate(34, 50)">
                <circle cx="0" cy="0" r="9" fill="#0f172a" stroke="#475569" strokeWidth="2" />
                <circle cx="0" cy="0" r="4.5" fill="#94a3b8" />
                <circle cx="0" cy="0" r="2" fill="#0f172a" />
              </g>
            </motion.g>
          </g>

          {/* Gradients Definition */}
          <defs>
            <linearGradient id="headlightGradient" x1="128" y1="46" x2="142" y2="46" gradientUnits="userSpaceOnUse">
              <stop stopColor="#38bdf8" stopOpacity="0.8" />
              <stop offset="1" stopColor="#38bdf8" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Footer Info */}
      <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
        <span className="flex items-center gap-1.5 text-slate-300">
          <motion.div
            animate={{ 
              scale: [1, 1.25, 1],
              rotate: [0, -10, 10, 0]
            }}
            transition={{ repeat: Infinity, duration: isSupercharge ? 0.7 : 1.5, ease: 'easeInOut' }}
          >
            <Zap className={`w-3.5 h-3.5 ${isSupercharge ? 'text-amber-400' : 'text-cyan-400'} fill-current`} />
          </motion.div>
          {isSupercharge ? 'ชาร์จด่วนความเร็วสูง' : 'ระบบชาร์จอัจฉริยะ'}
        </span>
        <span className="font-mono text-cyan-300 font-semibold text-[10px] bg-cyan-950/60 px-1.5 py-0.5 rounded border border-cyan-800/40">
          {isSupercharge ? 'DC Boost 150 kW' : 'Level 2 / DC'}
        </span>
      </div>
    </motion.div>
  );
};
