import React from 'react';
import { FileText, Award, CheckCircle2, AlertCircle, BookOpen, Layers, Download, Printer } from 'lucide-react';
import { RF_MODEL_METRICS } from '../data/evData';

export const ReportView: React.FC = () => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto" id="report-view">
      {/* Report Header */}
      <div className="bg-[#FCFAF6] rounded-xl border border-[#DEE5ED] p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#DEE5ED] pb-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#262F44] bg-[#DEE5ED] px-2.5 py-0.5 rounded border border-[#C1CCD6]">
              รายงานโครงการวิจัยเชิงวิชาการ
            </span>
            <h2 className="text-xl font-bold text-[#262F44] mt-2 font-display">
              การวิเคราะห์การเสื่อมสภาพของแบตเตอรี่รถยนต์ไฟฟ้า (EV) ด้วยระเบียบวิธี CRISP-DM
            </h2>
            <p className="text-xs text-[#64748B] mt-1">
              ผู้จัดทำ: ห้องปฏิบัติการวิศวกรรมการทำเหมืองข้อมูลและแมชชีนเลิร์นนิง • เผยแพร่: ภาคการศึกษา
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-[#262F44] bg-[#DEE5ED] hover:bg-[#C1CCD6] border border-[#C1CCD6] cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              พิมพ์ / บันทึกเป็น PDF
            </button>
          </div>
        </div>

        {/* Executive Summary */}
        <div className="mt-4 p-4 rounded-lg bg-[#F6F4EB] border border-[#DEE5ED] text-xs leading-relaxed text-[#35405A]">
          <h3 className="font-bold text-[#262F44] mb-1 font-display">บทสรุปสำหรับผู้บริหาร (Executive Summary)</h3>
          <p>
            การเสื่อมสภาพของแบตเตอรี่ลิเธียมไอออนในยานยนต์ไฟฟ้าสมัยใหม่ (EV) ถูกควบคุมด้วยปัจจัยร่วมของการเสื่อมตามปฏิทินเวลา (Calendar Aging), ความล้าเชิงกลจากการชาร์จและคายประจุ (Cycle Fatigue) และการเร่งปฏิกิริยาเคมีจากอุณหภูมิความร้อน การศึกษานี้ประยุกต์ใช้ระเบียบวิธีมาตรฐานอุตสาหกรรม <strong>CRISP-DM (Cross-Industry Standard Process for Data Mining)</strong> ในการวิเคราะห์ข้อมูลเทเลเมทรีของยานพาหนะจำนวน 100,000 คัน และสร้างแบบจำลองทำนายสถานะสุขภาพของแบตเตอรี่ (State of Health: SoH %) ด้วยอัลกอริทึม <strong>Random Forest Regression</strong> โดยโมเดลที่ได้มีค่าประสิทธิภาพ <strong>R² สูงถึง 0.914</strong> และค่าความคลาดเคลื่อน <strong>RMSE เพียง 2.38%</strong> ซึ่งแสดงถึงความน่าเชื่อถือและความแม่นยำสูงในการพยากรณ์ความจุที่คงเหลือของชุดแบตเตอรี่
          </p>
        </div>
      </div>

      {/* The 6 CRISP-DM Phases Structured Report */}
      <div className="bg-[#FCFAF6] rounded-xl border border-[#DEE5ED] p-6 shadow-xs space-y-6 text-xs text-[#35405A] leading-relaxed">
        {/* Phase 1 */}
        <section className="border-b border-[#DEE5ED] pb-5">
          <div className="flex items-center gap-2 mb-2 text-[#262F44] font-bold text-sm font-display">
            <span className="w-6 h-6 rounded-full bg-[#262F44] text-[#F6F4EB] flex items-center justify-center text-xs font-mono">1</span>
            <h4>ขั้นตอนที่ 1: ความเข้าใจทางธุรกิจ (Business Understanding)</h4>
          </div>
          <p className="mb-2">
            ต้นทุนการเปลี่ยนชุดแบตเตอรี่ที่สูงและความไม่แน่นอนของการเสื่อมสภาพถือเป็นอุปสรรคสำคัญในตลาดซื้อขายรถยนต์ไฟฟ้ามือสองและการประเมินความเสี่ยงด้านการรับประกันของผู้ผลิต โดยเงื่อนไขการรับประกันของผู้ผลิตทั่วไปมักรับประกันสุขภาพแบตเตอรี่ไม่ต่ำกว่า 70% ภายใน 8 ปี หรือ 160,000 กิโลเมตร
          </p>
          <ul className="list-disc list-inside space-y-1 pl-2 text-[#64748B]">
            <li><strong>วัตถุประสงค์หลัก:</strong> พยากรณ์สถานะสุขภาพของแบตเตอรี่ (SoH %) จากข้อมูลเทเลเมทรีการใช้งานจริง เพื่อสนับสนุนการแทรกแซงเชิงป้องกันของระบบ BMS</li>
            <li><strong>เกณฑ์ความสำเร็จ:</strong> ค่า R² ของแบบจำลองการถดถอยต้องมากกว่า 0.85 และมีค่าความคลาดเคลื่อนสมบูรณ์เฉลี่ย (MAE) น้อยกว่า 2.5% SoH</li>
          </ul>
        </section>

        {/* Phase 2 */}
        <section className="border-b border-[#DEE5ED] pb-5">
          <div className="flex items-center gap-2 mb-2 text-[#262F44] font-bold text-sm font-display">
            <span className="w-6 h-6 rounded-full bg-[#262F44] text-[#F6F4EB] flex items-center justify-center text-xs font-mono">2</span>
            <h4>ขั้นตอนที่ 2: ความเข้าใจข้อมูล (Data Understanding)</h4>
          </div>
          <p className="mb-2">
            ชุดข้อมูลประกอบด้วยข้อมูลสังเคราะห์จำนวน 100,000 รายการ ครอบคลุมรถยนต์ไฟฟ้า 5 รุ่นหลัก (Model 3: 32.5%, Model Y: 26.8%, Model S: 18.7%, Model X: 12.4%, รุ่นอื่นๆ: 9.6%) โดยมีทั้งคุณลักษณะเชิงตัวเลขต่อเนื่องและเชิงกลุ่ม:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
            <div className="p-3 bg-[#F6F4EB] rounded-lg border border-[#DEE5ED]">
              <span className="font-bold text-[#262F44] block mb-1">ตัวแปรเป้าหมาย (Target Variable):</span>
              <span><strong>สุขภาพแบตเตอรี่ (%)</strong> (ช่วงข้อมูล: 58.0%–99.0%, ค่าเฉลี่ย: 78.4%, ส่วนเบี่ยงเบนฯ: 8.4%)</span>
            </div>
            <div className="p-3 bg-[#F6F4EB] rounded-lg border border-[#DEE5ED]">
              <span className="font-bold text-[#262F44] block mb-1">ตัวแปรทำนายสำคัญ (Key Predictors):</span>
              <span>ระยะทางสะสม (กม.), อายุยานพาหนะ (ปี), รอบการชาร์จสะสม, รูปแบบการชาร์จหลัก (Home AC, Public AC, DC Fast), อุณหภูมิการทำงานเฉลี่ย (°C)</span>
            </div>
          </div>
        </section>

        {/* Phase 3 */}
        <section className="border-b border-[#DEE5ED] pb-5">
          <div className="flex items-center gap-2 mb-2 text-[#262F44] font-bold text-sm font-display">
            <span className="w-6 h-6 rounded-full bg-[#262F44] text-[#F6F4EB] flex items-center justify-center text-xs font-mono">3</span>
            <h4>ขั้นตอนที่ 3: การเตรียมข้อมูล (Data Preparation)</h4>
          </div>
          <p>
            การตรวจสอบคุณภาพข้อมูลยืนยันว่าไม่มีค่าสูญหาย (Missing Value = 0%) ในทุกฟีเจอร์ ตัวแปรเชิงกลุ่ม (รุ่นรถและประเภทการชาร์จ) ได้รับการเข้ารหัสแบบ One-Hot Encoding สำหรับตัวแปรเชิงตัวเลขต่อเนื่องได้ผ่านกระบวนการปรับมาตราส่วนด้วย RobustScaler เพื่อป้องกันอิทธิพลของค่าผิดปกติสุดโต่ง
          </p>
        </section>

        {/* Phase 4 */}
        <section className="border-b border-[#DEE5ED] pb-5">
          <div className="flex items-center gap-2 mb-2 text-[#262F44] font-bold text-sm font-display">
            <span className="w-6 h-6 rounded-full bg-[#262F44] text-[#F6F4EB] flex items-center justify-center text-xs font-mono">4</span>
            <h4>ขั้นตอนที่ 4: การสร้างแบบจำลอง (Modeling)</h4>
          </div>
          <p className="mb-2">
            ใช้อัลกอริทึมแบบกลุ่ม <strong>Random Forest Regressor</strong> ประกอบด้วยต้นไม้ตัดสินใจ 100 ต้น (Estimators = 100), จุดแยกขั้นต่ำของกิ่ง (Minimum Samples Split) เท่ากับ 5 และความลึกสูงสุดของต้นไม้ (Max Depth) เท่ากับ 12 โดยแบ่งชุดข้อมูลสำหรับการฝึกสอนและทดสอบในสัดส่วน 80/20 (ชุดฝึกสอน 998 คัน / ชุดทดสอบ 250 คัน)
          </p>
          <div className="p-3 bg-[#F6F4EB] rounded-lg border border-[#DEE5ED] text-[#262F44]">
            <strong>ระดับความสำคัญของตัวแปร (Feature Importances):</strong> ระยะทางสะสม (34.2%), อายุยานพาหนะ (26.5%), รอบการชาร์จสะสม (17.8%), รูปแบบการชาร์จ (11.4%), อุณหภูมิการทำงาน (6.9%), รุ่นยานพาหนะ (3.2%)
          </div>
        </section>

        {/* Phase 5 */}
        <section className="border-b border-[#DEE5ED] pb-5">
          <div className="flex items-center gap-2 mb-2 text-[#262F44] font-bold text-sm font-display">
            <span className="w-6 h-6 rounded-full bg-[#262F44] text-[#F6F4EB] flex items-center justify-center text-xs font-mono">5</span>
            <h4>ขั้นตอนที่ 5: การประเมินผลแบบจำลอง (Evaluation)</h4>
          </div>
          <div className="grid grid-cols-3 gap-3 my-2 text-center">
            <div className="p-2.5 bg-[#F6F4EB] rounded-lg border border-[#DEE5ED]">
              <span className="text-[10px] uppercase font-bold text-[#64748B] block">คะแนน R² Score</span>
              <span className="text-base font-bold font-mono text-[#262F44]">0.914</span>
            </div>
            <div className="p-2.5 bg-[#F6F4EB] rounded-lg border border-[#DEE5ED]">
              <span className="text-[10px] uppercase font-bold text-[#64748B] block">Root Mean Squared Error (RMSE)</span>
              <span className="text-base font-bold font-mono text-[#262F44]">2.38%</span>
            </div>
            <div className="p-2.5 bg-[#F6F4EB] rounded-lg border border-[#DEE5ED]">
              <span className="text-[10px] uppercase font-bold text-[#64748B] block">Mean Absolute Error (MAE)</span>
              <span className="text-base font-bold font-mono text-[#262F44]">1.82%</span>
            </div>
          </div>
          <p className="mt-2">
            การทดสอบไขว้ K-Fold Cross-Validation (k=5) ยืนยันความเสถียรของแบบจำลองโดยมีค่าเฉลี่ย R² = 0.906 การวิเคราะห์เศษเหลือ (Residuals) แสดงการกระจายตัวแบบสม่ำเสมอ (Homoscedasticity) ปราศจากความเอนเอียงเชิงระบบอย่างมีนัยสำคัญ
          </p>
        </section>

        {/* Phase 6 */}
        <section>
          <div className="flex items-center gap-2 mb-2 text-[#262F44] font-bold text-sm font-display">
            <span className="w-6 h-6 rounded-full bg-[#262F44] text-[#F6F4EB] flex items-center justify-center text-xs font-mono">6</span>
            <h4>ขั้นตอนที่ 6: การประยุกต์ใช้งานและข้อเสนอแนะเชิงปฏิบัติ (Deployment & Recommendations)</h4>
          </div>
          <p className="mb-2">
            แบบจำลองตัวแทนที่ผ่านการฝึกฝนแล้วถูกนำมาติดตั้งเข้ากับแดชบอร์ดการวิเคราะห์ข้อมูลเว็บแบบโต้ตอบนี้ เพื่อให้สามารถกรองข้อมูลแบบเรียลไทม์ วินิจฉัยสุขภาพของกองยานยนต์ และทำนายสุขภาพแบตเตอรี่ของรถยนต์แต่ละคันได้ทันที
          </p>
          <div className="p-3 bg-[#F6F4EB] border border-[#DEE5ED] rounded-lg text-[#262F44] space-y-1">
            <span className="font-bold block">ข้อเสนอแนะสำคัญในการบริหารจัดการยานพาหนะไฟฟ้า:</span>
            <p>1. กำหนดขีดจำกัดการชาร์จรายวันไว้ที่ 80% State of Charge ผ่านเครื่องชาร์จ AC ระดับ 2 ที่บ้านหรือที่ทำงานเพื่อชะลอการสะสมของฟิล์ม SEI</p>
            <p>2. สงวนการชาร์จเร็ว DC Fast Charging ไว้เฉพาะการเดินทางไกลข้ามจังหวัด แทนการใช้เป็นประจำทุกวัน</p>
            <p>3. เปิดใช้ระบบปรับสภาพอุณหภูมิแบตเตอรี่ล่วงหน้า (Pre-conditioning) ในสภาพอากาศร้อนจัด (&gt; 32°C) หรือเย็นจัด (&lt; 15°C) เพื่อรักษาอุณหภูมิเซลล์ให้อยู่ในช่วงที่เหมาะสม 20°C–25°C</p>
          </div>
        </section>
      </div>

      {/* Synthetic Data Disclaimer Box */}
      <div className="p-4 rounded-xl bg-[#F6F4EB] border border-[#DEE5ED] text-[#262F44] text-xs flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-[#35405A] shrink-0 mt-0.5" />
        <div>
          <span className="font-bold block mb-0.5">ข้อสงวนสิทธิ์: ข้อมูลสังเคราะห์เพื่อการศึกษา</span>
          <p className="text-[#64748B] leading-relaxed">
            แอปพลิเคชันนี้และตัวเลขทั้งหมดถูกสังเคราะห์ขึ้นเพื่อการสาธิตเชิงวิชาการตามระเบียบวิธี CRISP-DM เท่านั้น ตัวเลขดังกล่าวไม่ได้แสดงถึงข้อมูลกรรมสิทธิ์ของค่ายผู้ผลิตรถยนต์ (OEM) หรือการรับประกันทางกฎหมายจริง
          </p>
        </div>
      </div>
    </div>
  );
};
