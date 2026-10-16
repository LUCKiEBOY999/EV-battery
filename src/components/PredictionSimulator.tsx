import React, { useState, useMemo } from 'react';
import { VehicleModel, ChargingType } from '../types';
import { predictBatteryHealth } from '../data/evData';
import { Cpu, Sparkles, BatteryCharging, Gauge, RotateCw, Thermometer, Zap, ShieldCheck, ArrowRight, Lightbulb, Activity, Car } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import evCarImg from '../assets/images/ev_car_showcase_1789101036451.jpg';

export const PredictionSimulator: React.FC = () => {
  const [model, setModel] = useState<VehicleModel>('Model 3');
  const [age, setAge] = useState<number>(3.5);
  const [mileage, setMileage] = useState<number>(48000);
  const [cycles, setCycles] = useState<number>(550);
  const [chargeType, setChargeType] = useState<ChargingType>('AC');
  const [temp, setTemp] = useState<number>(27);

  const prediction = useMemo(() => {
    return predictBatteryHealth({
      vehicleModel: model,
      vehicleAge: age,
      accumulatedMileage: mileage,
      chargingCycles: cycles,
      chargingType: chargeType,
      operatingTemperature: temp,
    });
  }, [model, age, mileage, cycles, chargeType, temp]);

  const conditionThai =
    prediction.condition === 'Optimal'
      ? 'สภาพดีเยี่ยม (Optimal)'
      : prediction.condition === 'Normal'
      ? 'สภาพปกติ (Normal)'
      : 'เสื่อมสภาพเฝ้าระวัง (Caution)';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="space-y-6" 
      id="prediction-simulator-view"
    >
      {/* Header Banner */}
      <div className="bg-[#FCFAF6] rounded-xl border border-[#DEE5ED] p-5 shadow-xs">
        <div className="flex items-center gap-3">
          <motion.div 
            whileHover={{ rotate: 15, scale: 1.1 }}
            className="w-10 h-10 rounded-xl bg-[#DEE5ED] text-[#262F44] flex items-center justify-center border border-[#C1CCD6] shadow-xs cursor-pointer"
          >
            <Cpu className="w-5 h-5" />
          </motion.div>
          <div>
            <h2 className="text-base font-bold text-[#262F44] flex items-center gap-2 font-display">
              แบบจำลองพยากรณ์สุขภาพแบตเตอรี่แบบโต้ตอบ (Random Forest Inference)
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#DEE5ED] text-[#262F44] border border-[#C1CCD6]">
                CRISP-DM Phase 5 & 6
              </span>
            </h2>
            <p className="text-xs text-[#64748B]">
              กระบวนการ CRISP-DM ขั้นที่ 5 และ 6: การประเมินผลและการประยุกต์ใช้งาน — ปรับเปลี่ยนพารามิเตอร์เพื่อทำนายสถานะสุขภาพแบตเตอรี่ (SoH %)
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid: Inputs (Left) and Results / Explanations (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Controls Column (7 cols) */}
        <div className="lg:col-span-7 bg-[#FCFAF6] rounded-xl border border-[#DEE5ED] p-5 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-[#262F44] border-b border-[#DEE5ED] pb-2 flex items-center justify-between font-display">
            <span className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#262F44]" />
              พารามิเตอร์คุณลักษณะสำหรับ Machine Learning (ML Features)
            </span>
            <span className="text-[11px] font-mono text-[#262F44] font-semibold bg-[#DEE5ED] px-2 py-0.5 rounded border border-[#C1CCD6]">
              จำลองผลแบบเรียลไทม์
            </span>
          </h3>

          {/* 1. Vehicle Model */}
          <div>
            <label className="block text-xs font-semibold text-[#35405A] mb-1.5">
              1. สถาปัตยกรรมรุ่นยานพาหนะ (Vehicle Model)
            </label>
            <div className="grid grid-cols-5 gap-2">
              {(['Model 3', 'Model Y', 'Model S', 'Model X', 'Others'] as VehicleModel[]).map((m) => (
                <motion.button
                  key={m}
                  onClick={() => setModel(m)}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className={`py-2 px-1 rounded-lg text-xs font-semibold text-center border transition-all cursor-pointer ${
                    model === m
                      ? 'bg-[#262F44] text-[#F6F4EB] border-[#262F44] shadow-sm'
                      : 'bg-[#F6F4EB] text-[#35405A] border-[#DEE5ED] hover:bg-[#DEE5ED]/50'
                  }`}
                >
                  {m === 'Others' ? 'รุ่นอื่นๆ' : m}
                </motion.button>
              ))}
            </div>
          </div>

          {/* 2. Charging Type */}
          <div>
            <label className="block text-xs font-semibold text-[#35405A] mb-1.5">
              2. รูปแบบการชาร์จหลัก (C-Rate)
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['Home', 'AC', 'DC Fast'] as ChargingType[]).map((c) => (
                <motion.button
                  key={c}
                  onClick={() => setChargeType(c)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`py-2 px-2 rounded-lg text-xs font-semibold text-center border transition-all cursor-pointer ${
                    chargeType === c
                      ? 'bg-[#262F44] text-[#F6F4EB] border-[#262F44] shadow-sm'
                      : 'bg-[#F6F4EB] text-[#35405A] border-[#DEE5ED] hover:bg-[#DEE5ED]/50'
                  }`}
                >
                  {c === 'Home' ? 'ชาร์จบ้าน (Home AC)' : c === 'AC' ? 'สถานี AC (11-22kW)' : 'ชาร์จเร็ว DC Fast (>150kW)'}
                </motion.button>
              ))}
            </div>
          </div>

          {/* 3. Vehicle Age Slider */}
          <div>
            <div className="flex items-center justify-between text-xs font-semibold text-[#35405A] mb-1">
              <span>3. อายุยานพาหนะ:</span>
              <motion.span 
                key={age}
                initial={{ scale: 1.15 }}
                animate={{ scale: 1 }}
                className="font-mono text-[#262F44] font-bold"
              >
                {age.toFixed(1)} ปี
              </motion.span>
            </div>
            <input
              type="range"
              min="0.5"
              max="8.0"
              step="0.5"
              value={age}
              onChange={(e) => setAge(parseFloat(e.target.value))}
              className="w-full h-2 bg-[#DEE5ED] rounded-lg appearance-none cursor-pointer accent-[#262F44]"
            />
            <div className="flex justify-between text-[10px] text-[#64748B] font-mono mt-0.5">
              <span>0.5 ปี</span>
              <span>4.0 ปี</span>
              <span>8.0 ปี</span>
            </div>
          </div>

          {/* 4. Accumulated Mileage Slider */}
          <div>
            <div className="flex items-center justify-between text-xs font-semibold text-[#35405A] mb-1">
              <span>4. ระยะทางสะสม (Accumulated Mileage):</span>
              <motion.span 
                key={mileage}
                initial={{ scale: 1.15 }}
                animate={{ scale: 1 }}
                className="font-mono text-[#262F44] font-bold"
              >
                {mileage.toLocaleString()} กม.
              </motion.span>
            </div>
            <input
              type="range"
              min="5000"
              max="150000"
              step="2500"
              value={mileage}
              onChange={(e) => setMileage(parseInt(e.target.value, 10))}
              className="w-full h-2 bg-[#DEE5ED] rounded-lg appearance-none cursor-pointer accent-[#262F44]"
            />
            <div className="flex justify-between text-[10px] text-[#64748B] font-mono mt-0.5">
              <span>5,000 กม.</span>
              <span>75,000 กม.</span>
              <span>150,000 กม.</span>
            </div>
          </div>

          {/* 5. Charging Cycles Slider */}
          <div>
            <div className="flex items-center justify-between text-xs font-semibold text-[#35405A] mb-1">
              <span>5. รอบการชาร์จสมบูรณ์ (Equivalent Full Cycles):</span>
              <motion.span 
                key={cycles}
                initial={{ scale: 1.15 }}
                animate={{ scale: 1 }}
                className="font-mono text-[#262F44] font-bold"
              >
                {cycles.toLocaleString()} รอบ
              </motion.span>
            </div>
            <input
              type="range"
              min="50"
              max="1500"
              step="25"
              value={cycles}
              onChange={(e) => setCycles(parseInt(e.target.value, 10))}
              className="w-full h-2 bg-[#DEE5ED] rounded-lg appearance-none cursor-pointer accent-[#262F44]"
            />
            <div className="flex justify-between text-[10px] text-[#64748B] font-mono mt-0.5">
              <span>50 รอบ</span>
              <span>750 รอบ</span>
              <span>1,500 รอบ</span>
            </div>
          </div>

          {/* 6. Operating Temperature Slider */}
          <div>
            <div className="flex items-center justify-between text-xs font-semibold text-[#35405A] mb-1">
              <span>6. อุณหภูมิการทำงานเฉลี่ย (Operating Temp):</span>
              <motion.span 
                key={temp}
                initial={{ scale: 1.15 }}
                animate={{ scale: 1 }}
                className={`font-mono font-bold ${temp > 32 ? 'text-[#262F44]' : 'text-[#262F44]'}`}
              >
                {temp}°C
              </motion.span>
            </div>
            <input
              type="range"
              min="10"
              max="45"
              step="1"
              value={temp}
              onChange={(e) => setTemp(parseInt(e.target.value, 10))}
              className="w-full h-2 bg-[#DEE5ED] rounded-lg appearance-none cursor-pointer accent-[#262F44]"
            />
            <div className="flex justify-between text-[10px] text-[#64748B] font-mono mt-0.5">
              <span>10°C (อากาศเย็น)</span>
              <span>25°C (อุณหภูมิห้องมาตรฐาน)</span>
              <span>45°C (ความร้อนสูงจัด)</span>
            </div>
          </div>
        </div>

        {/* Prediction Results Card (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <motion.div 
            layout
            className="bg-[#FCFAF6] rounded-xl border border-[#DEE5ED] p-5 shadow-xs flex-1"
          >
            <h3 className="text-sm font-bold text-[#262F44] border-b border-[#DEE5ED] pb-2 flex items-center justify-between font-display">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#262F44]" />
                ผลการพยากรณ์จากโมเดล (Predicted Output)
              </span>
              <span className="text-[10px] uppercase font-bold text-[#64748B]">Random Forest</span>
            </h3>

            {/* EV Model Preview with chassis battery glow */}
            <div className="relative mt-3 rounded-xl overflow-hidden border border-[#DEE5ED] bg-[#262F44] aspect-21/9 flex items-center justify-center group">
              <img 
                src={evCarImg} 
                alt="EV Preview"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center opacity-85 group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/20 pointer-events-none" />
              
              <div className="absolute top-2 left-3 right-3 flex items-center justify-between text-[10px]">
                <span className="font-bold text-[#F6F4EB] bg-[#262F44]/90 backdrop-blur-xs px-2 py-0.5 rounded-full flex items-center gap-1 border border-[#DEE5ED]/30">
                  <Car className="w-3 h-3" />
                  {model}
                </span>
                <span className="font-mono font-semibold text-[#DEE5ED] bg-black/60 backdrop-blur-xs px-2 py-0.5 rounded">
                  {chargeType} • {cycles} รอบ • {temp}°C
                </span>
              </div>

              <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-white text-[11px]">
                <span className="text-[#DEE5ED] text-[10px]">
                  สถานะการเสื่อมสภาพทางเคมีไฟฟ้า
                </span>
                <span className="font-mono font-bold text-xs px-2 py-0.5 rounded bg-[#262F44]/90 text-[#F6F4EB] border border-[#DEE5ED]/30">
                  SoH {prediction.predictedHealth.toFixed(1)}%
                </span>
              </div>
            </div>

            <motion.div 
              layout
              className="my-4 text-center p-4 rounded-xl border border-[#DEE5ED] bg-[#F6F4EB]"
            >
              <span className="text-xs uppercase font-bold tracking-wider text-[#64748B]">
                สุขภาพแบตเตอรี่ที่พยากรณ์ได้ (Predicted SoH)
              </span>
              <motion.div 
                key={prediction.predictedHealth}
                initial={{ scale: 0.92, opacity: 0.7 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="text-4xl font-extrabold font-mono my-1 text-[#262F44]"
              >
                {prediction.predictedHealth.toFixed(1)}%
              </motion.div>

              {/* Animated Progress Gauge Bar */}
              <div className="w-full bg-[#DEE5ED] h-2 rounded-full overflow-hidden my-2.5">
                <motion.div
                  initial={false}
                  animate={{ width: `${Math.min(100, Math.max(0, prediction.predictedHealth))}%` }}
                  transition={{ type: 'spring', stiffness: 180, damping: 24 }}
                  className="h-full bg-[#262F44]"
                />
              </div>

              <div className="text-xs text-[#64748B] font-mono">
                ช่วงความเชื่อมั่น 95% CI: [{prediction.confidenceInterval[0]}% – {prediction.confidenceInterval[1]}%]
              </div>

              <div className="mt-2.5">
                <motion.span
                  key={prediction.condition}
                  initial={{ scale: 0.85, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border border-[#C1CCD6] bg-[#DEE5ED] text-[#262F44]"
                >
                  <ShieldCheck className="w-3.5 h-3.5 mr-1" />
                  {conditionThai}
                </motion.span>
              </div>
            </motion.div>

            {/* Estimated Range impact */}
            <motion.div 
              layout
              className="p-3 rounded-lg bg-[#F6F4EB] border border-[#DEE5ED] text-xs flex items-center justify-between"
            >
              <span className="text-[#64748B]">ระยะทางวิ่งคงเหลือที่ประเมินได้:</span>
              <motion.span 
                key={prediction.estimatedRemainingRangeKm}
                initial={{ scale: 1.15 }}
                animate={{ scale: 1 }}
                className="font-mono font-bold text-[#262F44]"
              >
                ~{prediction.estimatedRemainingRangeKm} กม.
              </motion.span>
            </motion.div>

            {/* Degradation Factor Decomposition with Animated Bars */}
            <div className="mt-4 pt-3 border-t border-[#DEE5ED]">
              <h4 className="text-xs font-bold text-[#262F44] mb-2 font-display">
                การจำแนกสัดส่วนการสูญเสียสุขภาพแบตเตอรี่ (% ที่ถูกหักออก):
              </h4>
              <div className="space-y-2 text-xs">
                {/* 1. Calendar */}
                <div>
                  <div className="flex justify-between text-[#64748B] mb-0.5">
                    <span>การเสื่อมสภาพตามเวลา ({age} ปี):</span>
                    <span className="font-mono font-semibold text-[#262F44]">
                      -{prediction.degradationBreakdown.calendarAging}%
                    </span>
                  </div>
                  <div className="w-full bg-[#DEE5ED] h-1.5 rounded-full overflow-hidden">
                    <motion.div 
                      animate={{ width: `${Math.min(100, prediction.degradationBreakdown.calendarAging * 4)}%` }}
                      transition={{ duration: 0.3 }}
                      className="bg-[#262F44] h-full"
                    />
                  </div>
                </div>

                {/* 2. Mileage */}
                <div>
                  <div className="flex justify-between text-[#64748B] mb-0.5">
                    <span>การสึกหรอตามระยะทาง ({(mileage / 1000).toFixed(0)}k กม.):</span>
                    <span className="font-mono font-semibold text-[#262F44]">
                      -{prediction.degradationBreakdown.mileageWear}%
                    </span>
                  </div>
                  <div className="w-full bg-[#DEE5ED] h-1.5 rounded-full overflow-hidden">
                    <motion.div 
                      animate={{ width: `${Math.min(100, prediction.degradationBreakdown.mileageWear * 4)}%` }}
                      transition={{ duration: 0.3 }}
                      className="bg-[#35405A] h-full"
                    />
                  </div>
                </div>

                {/* 3. Cycles */}
                <div>
                  <div className="flex justify-between text-[#64748B] mb-0.5">
                    <span>รอบการชาร์จสะสม ({cycles} รอบ):</span>
                    <span className="font-mono font-semibold text-[#262F44]">
                      -{prediction.degradationBreakdown.cycleWear}%
                    </span>
                  </div>
                  <div className="w-full bg-[#DEE5ED] h-1.5 rounded-full overflow-hidden">
                    <motion.div 
                      animate={{ width: `${Math.min(100, prediction.degradationBreakdown.cycleWear * 4)}%` }}
                      transition={{ duration: 0.3 }}
                      className="bg-[#4F5E7B] h-full"
                    />
                  </div>
                </div>

                {/* 4. Charging Type */}
                <div>
                  <div className="flex justify-between text-[#64748B] mb-0.5">
                    <span>ผลกระทบจากอัตราการชาร์จ ({chargeType}):</span>
                    <span className="font-mono font-semibold text-[#262F44]">
                      -{prediction.degradationBreakdown.chargingRateImpact}%
                    </span>
                  </div>
                  <div className="w-full bg-[#DEE5ED] h-1.5 rounded-full overflow-hidden">
                    <motion.div 
                      animate={{ width: `${Math.min(100, prediction.degradationBreakdown.chargingRateImpact * 8)}%` }}
                      transition={{ duration: 0.3 }}
                      className="bg-[#6D7E9C] h-full"
                    />
                  </div>
                </div>

                {/* 5. Thermal Stress */}
                <div>
                  <div className="flex justify-between text-[#64748B] mb-0.5">
                    <span>ความเครียดจากความร้อนสะสม ({temp}°C):</span>
                    <span className="font-mono font-semibold text-[#262F44]">
                      -{prediction.degradationBreakdown.thermalStress}%
                    </span>
                  </div>
                  <div className="w-full bg-[#DEE5ED] h-1.5 rounded-full overflow-hidden">
                    <motion.div 
                      animate={{ width: `${Math.min(100, prediction.degradationBreakdown.thermalStress * 12)}%` }}
                      transition={{ duration: 0.3 }}
                      className="bg-[#8E9EA8] h-full"
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Recommendations Card */}
          <motion.div 
            layout
            className="p-4 rounded-xl bg-[#F6F4EB] border border-[#DEE5ED] text-xs text-[#262F44] space-y-1.5"
          >
            <div className="flex items-center gap-1.5 font-bold text-[#262F44]">
              <Lightbulb className="w-4 h-4 text-[#35405A]" />
              คำแนะนำเพื่อถนอมสุขภาพแบตเตอรี่
            </div>
            <p className="leading-relaxed text-[#64748B] text-[11px]">
              เพื่อรักษาสถานะสุขภาพแบตเตอรี่ (SoH) ให้อยู่ในระดับสูง ควรจัดลำดับความสำคัญให้ชาร์จแบบกระแสสลับที่บ้าน (ตั้งขีดจำกัดประจำวันที่ 80%) และหลีกเลี่ยงการใช้ชาร์จเร็ว DC Fast อย่างต่อเนื่องในสภาพแวดล้อมที่มีอุณหภูมิสูงเกินกว่า 32°C
            </p>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};
