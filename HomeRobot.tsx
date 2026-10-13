import React, { useState, useEffect, useRef } from 'react';
import { 
  Home, Droplets, Sun, Play, Pause, RotateCcw, 
  CheckCircle2, AlertCircle, ArrowRight, Gauge, 
  Flame, BatteryCharging, Power
} from 'lucide-react';
import { sounds } from '../../utils/soundEffects';

export const HomeRobot: React.FC = () => {
  // Active feature phase: 1 (Water Assessment & Motor) -> 2 (Sunlight & Solar Panels) -> 3 (Complete Summary)
  const [activeFeature, setActiveFeature] = useState<number>(1);

  // FEATURE 1: WATER & MOTOR STATE
  const [hoursWithoutWater, setHoursWithoutWater] = useState<number>(28);
  const [motorRunning, setMotorRunning] = useState<boolean>(false);
  const [soilMoisture, setSoilMoisture] = useState<number>(22);
  const [waterDispensedLiters, setWaterDispensedLiters] = useState<number>(0);
  const [waterCycleCompleted, setWaterCycleCompleted] = useState<boolean>(false);

  // FEATURE 2: SUNLIGHT & SOLAR PANELS STATE
  const [needsSunlightAnswer, setNeedsSunlightAnswer] = useState<'yes' | 'no' | null>(null);
  const [solarPanelsOpen, setSolarPanelsOpen] = useState<boolean>(false);
  // 30 minutes in seconds = 1800
  const [solarSecondsLeft, setSolarSecondsLeft] = useState<number>(1800);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [timerSpeed, setTimerSpeed] = useState<number>(1); // 1x, 10x, 60x

  // Timer interval ref
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Feature 1: Evaluate water requirement
  const handleEvaluateWater = () => {
    sounds.playBeep(580, 0.1);

    if (hoursWithoutWater > 24) {
      // Trigger motor
      setMotorRunning(true);
      setWaterCycleCompleted(false);
      sounds.playMotorSound();
      sounds.speakAnnouncement('Plant has not received water for over 24 hours. Opening motor pump for water supply.');

      // Simulate watering for 3.5 seconds
      let moisture = soilMoisture;
      let liters = 0;
      const interval = setInterval(() => {
        moisture += 6;
        liters += 0.4;
        setSoilMoisture(Math.min(moisture, 75));
        setWaterDispensedLiters(Number(liters.toFixed(1)));

        if (moisture >= 75) {
          clearInterval(interval);
          setMotorRunning(false);
          setWaterCycleCompleted(true);
          sounds.playBeep(800, 0.15);
          sounds.speakAnnouncement('Soil moisture restored to optimal 75 percent. Motor shut down.');
        }
      }, 400);
    } else {
      setMotorRunning(false);
      setWaterCycleCompleted(true);
      sounds.speakAnnouncement('Plant received water within 24 hours. Soil moisture adequate. Motor remains off.');
    }
  };

  // Feature 2: Handle sunlight choice
  const handleSunlightChoice = (choice: 'yes' | 'no') => {
    setNeedsSunlightAnswer(choice);
    sounds.playBeep(620, 0.1);

    if (choice === 'yes') {
      setSolarPanelsOpen(true);
      setSolarSecondsLeft(1800); // 30 mins
      setIsTimerRunning(true);
      sounds.speakAnnouncement('User confirmed plant needs sunlight. Deploying solar heating panels for 30 minutes.');
    } else {
      setSolarPanelsOpen(false);
      setIsTimerRunning(false);
      sounds.speakAnnouncement('Sunlight not required. Solar heating panels remain closed in eco-mode.');
    }
  };

  // Solar timer loop
  useEffect(() => {
    if (isTimerRunning && solarPanelsOpen) {
      timerRef.current = setInterval(() => {
        setSolarSecondsLeft((prev) => {
          if (prev <= timerSpeed) {
            clearInterval(timerRef.current!);
            setIsTimerRunning(false);
            sounds.playBeep(900, 0.3);
            sounds.speakAnnouncement('30 minute solar heating session finished. Retracting panels.');
            return 0;
          }
          return prev - timerSpeed;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isTimerRunning, solarPanelsOpen, timerSpeed]);

  const formatTimer = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainingSecs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      {/* Top Robot Badge & Stepper */}
      <div className="bg-white border-2 border-orange-300 rounded-2xl p-5 shadow-md">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4 pb-4 border-b border-orange-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white shadow-md shadow-orange-500/20">
              <Home className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-orange-600 tracking-wider">GF-HOME</span>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-100 text-amber-900 rounded-full border border-amber-300">
                  SDG 12 Sustainable Living
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-['Chakra_Petch']">
                Smart Botanical & Solar Habitat Operative
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-600">Sequential Flow:</span>
            <span className="px-3 py-1 bg-orange-500 text-white font-bold text-xs rounded-lg shadow-xs">
              Feature {activeFeature} of 2
            </span>
          </div>
        </div>

        {/* 2-Feature Tabs */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <button
            onClick={() => {
              sounds.playBeep(500, 0.05);
              setActiveFeature(1);
            }}
            className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
              activeFeature === 1
                ? 'bg-orange-500 text-white border-orange-600 shadow-md font-bold'
                : 'bg-white text-slate-700 border-slate-200 hover:border-orange-200'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs sm:text-sm font-bold flex items-center gap-1.5">
                <Droplets className="w-4 h-4" /> 1. Irrigation & Motor Pump
              </span>
              {waterCycleCompleted && <CheckCircle2 className="w-4 h-4 text-emerald-300" />}
            </div>
            <p className={`text-[11px] ${activeFeature === 1 ? 'text-orange-100' : 'text-slate-500'}`}>
              Check hours without water: if &gt; 24h, open motor
            </p>
          </button>

          <button
            onClick={() => {
              sounds.playBeep(500, 0.05);
              setActiveFeature(2);
            }}
            className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
              activeFeature === 2
                ? 'bg-orange-500 text-white border-orange-600 shadow-md font-bold'
                : 'bg-white text-slate-700 border-slate-200 hover:border-orange-200'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs sm:text-sm font-bold flex items-center gap-1.5">
                <Sun className="w-4 h-4" /> 2. Solar Heating Panels
              </span>
              {needsSunlightAnswer && <CheckCircle2 className="w-4 h-4 text-emerald-300" />}
            </div>
            <p className={`text-[11px] ${activeFeature === 2 ? 'text-orange-100' : 'text-slate-500'}`}>
              Ask if plant needs sun: if yes, open panels for 30 min
            </p>
          </button>
        </div>
      </div>

      {/* FEATURE 1: WATER DURATION & MOTOR PUMP CONTROL */}
      {activeFeature === 1 && (
        <div className="bg-white border-2 border-orange-200 rounded-2xl p-6 shadow-md space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-orange-100">
            <div className="flex items-center gap-2">
              <Droplets className="w-5 h-5 text-orange-600" />
              <h3 className="text-lg font-bold text-slate-900 font-['Chakra_Petch']">
                Feature 1: Soil Hydration Assessment & Conditional Motor Trigger
              </h3>
            </div>
            <span className="text-xs font-mono font-bold text-slate-500">
              Rule: IF (hours &gt; 24) THEN OPEN MOTOR
            </span>
          </div>

          {/* Diagnostic Question Box */}
          <div className="p-4 bg-orange-50/70 border border-orange-200 rounded-xl space-y-3">
            <label className="block text-sm font-bold text-slate-900">
              System Question: How long did the plants not receive water?
            </label>
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  id="input-hours-without-water"
                  min="0"
                  max="168"
                  value={hoursWithoutWater}
                  onChange={(e) => {
                    setHoursWithoutWater(Number(e.target.value));
                    setWaterCycleCompleted(false);
                  }}
                  className="w-24 px-3 py-2 border-2 border-orange-300 rounded-lg text-lg font-bold text-slate-900 focus:outline-none focus:border-orange-500"
                />
                <span className="font-bold text-slate-700 text-sm">Hours</span>
              </div>

              {/* Quick Presets */}
              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-500 font-medium">Quick presets:</span>
                {[
                  { label: '8 Hours (Recent)', val: 8 },
                  { label: '18 Hours (Normal)', val: 18 },
                  { label: '24 Hours (Borderline)', val: 24 },
                  { label: '36 Hours (>24h Dry)', val: 36 },
                  { label: '60 Hours (Critical)', val: 60 },
                ].map((p) => (
                  <button
                    key={p.val}
                    onClick={() => {
                      setHoursWithoutWater(p.val);
                      setWaterCycleCompleted(false);
                    }}
                    className={`px-2.5 py-1 rounded-md border text-xs transition-colors ${
                      hoursWithoutWater === p.val
                        ? 'bg-orange-500 text-white border-orange-600 font-bold'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-orange-300'
                    }`}
                  >
                    {p.val}h
                  </button>
                ))}
              </div>
            </div>

            {/* Conditional Status Banner */}
            <div
              className={`p-3 rounded-lg text-xs font-semibold flex items-center gap-2 border ${
                hoursWithoutWater > 24
                  ? 'bg-amber-100 text-amber-900 border-amber-300'
                  : 'bg-emerald-50 text-emerald-900 border-emerald-300'
              }`}
            >
              {hoursWithoutWater > 24 ? (
                <>
                  <AlertCircle className="w-4 h-4 text-orange-600 shrink-0" />
                  <span>
                    <strong>Conditional Trigger MET:</strong> {hoursWithoutWater} hours is greater than 24 hours. GForce will open the irrigation motor for water supply!
                  </span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    <strong>Within Threshold:</strong> {hoursWithoutWater} hours &le; 24 hours. Soil moisture levels are safe; motor pump will remain in standby.
                  </span>
                </>
              )}
            </div>

            <button
              id="evaluate-irrigation-btn"
              onClick={handleEvaluateWater}
              disabled={motorRunning}
              className="px-5 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-60"
            >
              <Power className="w-4 h-4" />
              <span>Evaluate & Run GForce Irrigation Diagnostic</span>
            </button>
          </div>

          {/* Motor & Soil Telemetry Dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Motor Pump Visualizer */}
            <div className={`p-4 rounded-xl border-2 transition-all ${
              motorRunning 
                ? 'bg-orange-50/80 border-orange-500 shadow-md shadow-orange-500/10' 
                : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-700 uppercase">Irrigation Motor</span>
                <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full border ${
                  motorRunning 
                    ? 'bg-orange-500 text-white border-orange-600 animate-pulse' 
                    : 'bg-slate-200 text-slate-700 border-slate-300'
                }`}>
                  {motorRunning ? 'PUMP OPEN & RUNNING' : 'STANDBY (CLOSED)'}
                </span>
              </div>
              <p className="text-2xl font-black text-slate-900 font-mono">
                {motorRunning ? '3.8 L/min' : '0.0 L/min'}
              </p>
              <p className="text-xs text-slate-500 mt-1">High-pressure brushless DC motor</p>
            </div>

            {/* Soil Moisture Gauge */}
            <div className="p-4 bg-slate-50 border-2 border-slate-200 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-700 uppercase">Soil Moisture Sensor</span>
                <span className="text-xs font-mono font-bold text-orange-600">{soilMoisture}%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-3 mb-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-amber-400 to-emerald-500 h-full transition-all duration-300"
                  style={{ width: `${soilMoisture}%` }}
                />
              </div>
              <p className="text-xs text-slate-500">
                {soilMoisture >= 60 ? 'Optimal botanical hydration' : 'Dry - requires water supply'}
              </p>
            </div>

            {/* Water Volume Dispensed */}
            <div className="p-4 bg-slate-50 border-2 border-slate-200 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-700 uppercase">Water Dispensed</span>
                <Droplets className="w-4 h-4 text-blue-500" />
              </div>
              <p className="text-2xl font-black text-slate-900 font-mono">
                {waterDispensedLiters} <span className="text-sm font-normal text-slate-600">Liters</span>
              </p>
              <p className="text-xs text-slate-500 mt-1">Recycled eco-greywater supply</p>
            </div>
          </div>

          {/* Sequential Transition to Feature 2 */}
          <div className="flex justify-end pt-3 border-t border-slate-100">
            <button
              id="proceed-to-sunlight-btn"
              onClick={() => {
                sounds.playBeep(600, 0.1);
                setActiveFeature(2);
              }}
              className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md flex items-center gap-2 cursor-pointer"
            >
              <span>Next: Check Plant Sunlight Requirement</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* FEATURE 2: SUNLIGHT QUERY & 30-MINUTE SOLAR HEATING PANELS */}
      {activeFeature === 2 && (
        <div className="bg-white border-2 border-orange-200 rounded-2xl p-6 shadow-md space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-orange-100">
            <div className="flex items-center gap-2">
              <Sun className="w-5 h-5 text-orange-600" />
              <h3 className="text-lg font-bold text-slate-900 font-['Chakra_Petch']">
                Feature 2: Sunlight Requirement Diagnostic & 30-Minute Solar Panels
              </h3>
            </div>
            <span className="text-xs font-mono font-bold text-slate-500">
              Rule: IF (user == 'YES') THEN OPEN SOLAR PANELS (30 MIN)
            </span>
          </div>

          {/* Diagnostic Query Card */}
          <div className="p-5 bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl space-y-3">
            <h4 className="text-base sm:text-lg font-bold text-slate-900">
              GForce System Inquiry: "Does the plant need sunlight?"
            </h4>
            <p className="text-xs sm:text-sm text-slate-600">
              If you confirm YES, the automated servomotors will open the concentrated solar heating & photosynthetic panels for exactly 30 minutes.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                id="btn-sunlight-yes"
                onClick={() => handleSunlightChoice('yes')}
                className={`px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 shadow-sm transition-all cursor-pointer ${
                  needsSunlightAnswer === 'yes'
                    ? 'bg-orange-500 text-white ring-2 ring-orange-400 shadow-md'
                    : 'bg-white hover:bg-orange-100 text-slate-800 border-2 border-orange-300'
                }`}
              >
                <Sun className="w-4 h-4 text-amber-500" />
                <span>YES - Deploy Solar Heating Panels (30 Min)</span>
              </button>

              <button
                id="btn-sunlight-no"
                onClick={() => handleSunlightChoice('no')}
                className={`px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 shadow-sm transition-all cursor-pointer ${
                  needsSunlightAnswer === 'no'
                    ? 'bg-slate-800 text-white shadow-md'
                    : 'bg-white hover:bg-slate-100 text-slate-700 border-2 border-slate-300'
                }`}
              >
                <span>NO - Shading / Rest Mode</span>
              </button>
            </div>
          </div>

          {/* Solar Heating Panels Active State */}
          {solarPanelsOpen && (
            <div className="p-6 bg-slate-900 text-white rounded-2xl border-2 border-orange-500 space-y-4 shadow-xl">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Flame className="w-5 h-5 text-amber-400 animate-bounce" />
                  <div>
                    <h4 className="font-bold text-sm sm:text-base text-amber-400 font-['Chakra_Petch']">
                      SOLAR HEATING & LIGHT PANELS DEPLOYED
                    </h4>
                    <p className="text-[11px] text-slate-400">Target duration: 30 minutes automated cycle</p>
                  </div>
                </div>

                {/* Speed Controls for Simulation */}
                <div className="flex items-center gap-2 text-xs font-mono">
                  <span className="text-slate-400">Simulation Speed:</span>
                  <button
                    onClick={() => setTimerSpeed(1)}
                    className={`px-2 py-0.5 rounded border ${
                      timerSpeed === 1 ? 'bg-orange-500 text-white border-orange-400' : 'bg-slate-800 text-slate-300 border-slate-700'
                    }`}
                  >
                    1x
                  </button>
                  <button
                    onClick={() => setTimerSpeed(15)}
                    className={`px-2 py-0.5 rounded border ${
                      timerSpeed === 15 ? 'bg-orange-500 text-white border-orange-400' : 'bg-slate-800 text-slate-300 border-slate-700'
                    }`}
                  >
                    15x Fast
                  </button>
                  <button
                    onClick={() => setTimerSpeed(60)}
                    className={`px-2 py-0.5 rounded border ${
                      timerSpeed === 60 ? 'bg-orange-500 text-white border-orange-400' : 'bg-slate-800 text-slate-300 border-slate-700'
                    }`}
                  >
                    60x Turbo
                  </button>
                  <button
                    onClick={() => {
                      setSolarSecondsLeft(0);
                      setIsTimerRunning(false);
                      sounds.playBeep(900, 0.2);
                    }}
                    className="px-2 py-0.5 rounded bg-slate-700 hover:bg-slate-600 text-amber-300 border border-slate-600"
                  >
                    Instant Done
                  </button>
                </div>
              </div>

              {/* Countdown Timer Display */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-slate-800/80 rounded-xl border border-slate-700">
                <div className="text-center sm:text-left">
                  <span className="text-xs uppercase tracking-wider text-slate-400 font-mono">
                    Time Remaining (30:00 Cycle)
                  </span>
                  <div className="text-4xl sm:text-5xl font-black font-mono tracking-wider text-orange-400 mt-1">
                    {formatTimer(solarSecondsLeft)}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    {solarSecondsLeft > 0 ? 'Solar thermal irradiation in progress...' : 'Cycle finished. Panels retracted.'}
                  </p>
                </div>

                {/* Play / Pause Timer */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsTimerRunning(!isTimerRunning)}
                    className="p-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold flex items-center gap-1.5 shadow-md"
                  >
                    {isTimerRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                    <span>{isTimerRunning ? 'Pause Timer' : 'Resume'}</span>
                  </button>
                  <button
                    onClick={() => {
                      setSolarSecondsLeft(1800);
                      setIsTimerRunning(true);
                      sounds.playBeep(500, 0.05);
                    }}
                    className="p-3 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-xl"
                    title="Reset 30 minute timer"
                  >
                    <RotateCcw className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Thermal & Solar Telemetry */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                <div className="p-3 bg-slate-800 rounded-lg border border-slate-700">
                  <span className="text-slate-400 text-[10px] block">Panel Tilt</span>
                  <span className="text-base font-bold text-amber-400">45.0° Optimal</span>
                </div>
                <div className="p-3 bg-slate-800 rounded-lg border border-slate-700">
                  <span className="text-slate-400 text-[10px] block">Photon Lux</span>
                  <span className="text-base font-bold text-amber-400">920 W/m²</span>
                </div>
                <div className="p-3 bg-slate-800 rounded-lg border border-slate-700">
                  <span className="text-slate-400 text-[10px] block">Soil Temp</span>
                  <span className="text-base font-bold text-amber-400">24.2 °C</span>
                </div>
                <div className="p-3 bg-slate-800 rounded-lg border border-slate-700">
                  <span className="text-slate-400 text-[10px] block">Battery Status</span>
                  <span className="text-base font-bold text-emerald-400 flex items-center gap-1">
                    <BatteryCharging className="w-3.5 h-3.5" /> 98% (Solar)
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* If user answered NO */}
          {needsSunlightAnswer === 'no' && (
            <div className="p-4 bg-slate-100 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-700 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-slate-500 shrink-0" />
              <span>
                User opted out of solar exposure. Solar panels remain safely retracted. Natural ambient indoor lighting mode active.
              </span>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between items-center pt-3 border-t border-slate-100">
            <button
              onClick={() => setActiveFeature(1)}
              className="px-4 py-2 border border-slate-300 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-50"
            >
              Back to Irrigation Motor
            </button>

            <span className="text-xs text-slate-500 font-medium">
              GF-Home Protocol 100% Fully Configured
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
