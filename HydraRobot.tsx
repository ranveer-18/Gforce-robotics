import React, { useState, useEffect, useRef } from 'react';
import { 
  Waves, AlertTriangle, ShieldCheck, Clock, Magnet, 
  CheckCircle2, XCircle, ArrowRight, Volume2, 
  Play, Pause, RotateCcw, Power, Sparkles, Filter, Droplet
} from 'lucide-react';
import { sounds } from '../../utils/soundEffects';

export const HydraRobot: React.FC = () => {
  const [activeTab, setActiveTab] = useState<number>(1);

  // FEATURE 1: WATER LITTER DETECTION & STOP INTERVENTION
  const [waterLitterDetected, setWaterLitterDetected] = useState<boolean>(false);
  const [suspectStopped, setSuspectStopped] = useState<boolean>(false);

  const handleSimulateWaterLitter = () => {
    sounds.playAlert();
    setWaterLitterDetected(true);
    setSuspectStopped(false);
    sounds.speakAnnouncement('WARNING! LITTERING IN WATER BODY DETECTED! INITIATING DIRECT STOP WARNING TO CITIZEN!');
  };

  const handleStopSuspect = () => {
    sounds.playAlert();
    setSuspectStopped(true);
    sounds.speakAnnouncement('Citizen ordered to cease. Trash retrieved from shoreline. Incident cataloged.');
  };

  // FEATURE 2: ONCE IN A WEEK BLEACHING POWDER TIMER & DISPENSER
  // 7 days in seconds = 7 * 24 * 3600 = 604,800 seconds
  const [weeklySecondsRemaining, setWeeklySecondsRemaining] = useState<number>(604800);
  const [isWeeklyTimerActive, setIsWeeklyTimerActive] = useState<boolean>(true);
  const [bleachDispensing, setBleachDispensing] = useState<boolean>(false);
  const [lastBleachedTimestamp, setLastBleachedTimestamp] = useState<string>('Never (Cycle Pending)');
  const [waterPurityScore, setWaterPurityScore] = useState<number>(68);

  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isWeeklyTimerActive) {
      timerIntervalRef.current = setInterval(() => {
        setWeeklySecondsRemaining((prev) => {
          if (prev <= 1) {
            // Trigger bleaching
            triggerBleachCycle();
            return 604800; // Reset 7 days
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    }
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [isWeeklyTimerActive]);

  const triggerBleachCycle = () => {
    sounds.playMotorSound();
    setBleachDispensing(true);
    sounds.speakAnnouncement('Weekly scheduled cycle reached. Dispensing calibrated bleaching powder into water reservoir.');

    setTimeout(() => {
      setBleachDispensing(false);
      setLastBleachedTimestamp(new Date().toLocaleString());
      setWaterPurityScore(96);
      sounds.playBeep(850, 0.2);
      sounds.speakAnnouncement('Bleaching powder successfully distributed. Water bacteria neutralized by 98 percent.');
    }, 3000);
  };

  const formatDaysHoursMins = (totalSecs: number) => {
    const days = Math.floor(totalSecs / 86400);
    const hours = Math.floor((totalSecs % 86400) / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;
    return `${days}d ${hours}h ${mins}m ${secs}s`;
  };

  // FEATURE 3: USER PERMIT & MAGNETIC TRASH EXTRACTOR MACHINE
  const [userPermitGranted, setUserPermitGranted] = useState<boolean | null>(null);
  const [magnetMachineRunning, setMagnetMachineRunning] = useState<boolean>(false);
  const [extractedKgMetal, setExtractedKgMetal] = useState<number>(0);
  const [extractedKgPlastic, setExtractedKgPlastic] = useState<number>(0);

  const handleGrantPermit = () => {
    setUserPermitGranted(true);
    setMagnetMachineRunning(true);
    sounds.playMotorSound();
    sounds.speakAnnouncement('User operational permit granted. Engaging heavy-duty aquatic magnetic extraction machine.');

    let metal = 0;
    let plastic = 0;
    const interval = setInterval(() => {
      metal += 3.8;
      plastic += 2.4;
      setExtractedKgMetal(Number(metal.toFixed(1)));
      setExtractedKgPlastic(Number(plastic.toFixed(1)));

      if (metal >= 48) {
        clearInterval(interval);
        sounds.playBeep(800, 0.15);
        sounds.speakAnnouncement('Aquatic sector cleared of ferrous and floating trash. Extraction complete.');
      }
    }, 400);
  };

  const handleDenyPermit = () => {
    setUserPermitGranted(false);
    setMagnetMachineRunning(false);
    sounds.playBeep(450, 0.1);
    sounds.speakAnnouncement('Operational permit denied. Magnetic machine remains docked in safe standby.');
  };

  return (
    <div className="space-y-6">
      {/* Top Robot Badge & 3-Feature Stepper */}
      <div className="bg-white border-2 border-orange-300 rounded-2xl p-5 shadow-md">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4 pb-4 border-b border-orange-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-white shadow-md shadow-orange-500/20">
              <Waves className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-orange-600 tracking-wider">GF-HYDRA</span>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-orange-100 text-orange-900 rounded-full border border-orange-300">
                  SDG 6 Clean Water
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-['Chakra_Petch']">
                Aquatic Protection & Debris Extractor Operative
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-600">Feature:</span>
            <span className="px-3 py-1 bg-orange-500 text-white font-bold text-xs rounded-lg shadow-xs">
              {activeTab} of 3
            </span>
          </div>
        </div>

        {/* 3 Sequential Feature Tabs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
          {[
            { id: 1, title: '1. Water Litter Model & Stop', desc: 'Detect water trash & order violator to stop' },
            { id: 2, title: '2. Weekly Bleach Timer', desc: 'Once-in-a-week automated bleaching cycle' },
            { id: 3, title: '3. Magnetic Trash Harvester', desc: 'User-permitted magnetic extraction machine' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                sounds.playBeep(500, 0.05);
                setActiveTab(tab.id);
              }}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-orange-500 text-white border-orange-600 shadow-md font-bold'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-orange-200'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs sm:text-sm font-bold">{tab.title}</span>
                <CheckCircle2 className={`w-3.5 h-3.5 ${activeTab === tab.id ? 'text-white' : 'text-slate-300'}`} />
              </div>
              <p className={`text-[11px] ${activeTab === tab.id ? 'text-orange-100' : 'text-slate-500'}`}>
                {tab.desc}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* FEATURE 1: WATER LITTER MODEL & STOP VIOLATOR */}
      {activeTab === 1 && (
        <div className="bg-white border-2 border-orange-200 rounded-2xl p-6 shadow-md space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-orange-100">
            <div className="flex items-center gap-2">
              <Waves className="w-5 h-5 text-orange-600" />
              <h3 className="text-lg font-bold text-slate-900 font-['Chakra_Petch']">
                Feature 1: Water Litter Training Model & Direct Stop Intervention
              </h3>
            </div>
            <span className="text-xs font-mono font-bold text-slate-500">
              Model: HydroLitter-v3.weights
            </span>
          </div>

          <p className="text-xs sm:text-sm text-slate-600">
            GForce Hydra scans riverbanks, lakefronts, and water bodies using a water-surface litter training model. If anyone is found throwing trash into the water, the robot issues an immediate high-decibel audible command & flashing beacon to halt the violator.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Visualizer Feed */}
            <div className="p-5 bg-slate-950 text-white rounded-2xl border-2 border-orange-500 space-y-4">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-orange-400 font-bold">RIVERBANK AI SURVEILLANCE</span>
                <span className="text-slate-400">SECTOR C CANAL DOCK</span>
              </div>

              <div className="h-48 bg-slate-900 rounded-xl relative overflow-hidden flex items-center justify-center border border-slate-800">
                {waterLitterDetected ? (
                  <div className="text-center p-4 space-y-2">
                    <div className="inline-block p-2 bg-red-600 text-white rounded-full animate-bounce">
                      <AlertTriangle className="w-6 h-6" />
                    </div>
                    <div className="text-sm font-bold text-red-400 font-['Chakra_Petch']">
                      WATER CONTAMINATION DETECTED!
                    </div>
                    <p className="text-xs text-amber-300 font-mono">
                      Subject throwing polythene plastic bag into river stream
                    </p>
                    <p className="text-[11px] text-slate-400">
                      GForce Acoustic Strobe Activated • Distance to Target: 14 meters
                    </p>
                  </div>
                ) : (
                  <div className="text-center p-4 text-slate-500">
                    <Waves className="w-8 h-8 mx-auto mb-2 opacity-50 text-orange-400" />
                    <p className="text-xs">Waterway clear of active pollutants</p>
                    <p className="text-[10px] text-slate-600 mt-1">AI training model actively monitoring perimeter</p>
                  </div>
                )}
              </div>

              <button
                id="simulate-water-litter-btn"
                onClick={handleSimulateWaterLitter}
                className="w-full py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <AlertTriangle className="w-4 h-4" />
                <span>Simulate Person Throwing Trash into Water</span>
              </button>
            </div>

            {/* Stop Intervention Control Card */}
            <div className="p-5 bg-orange-50/70 border-2 border-orange-300 rounded-2xl flex flex-col justify-between space-y-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-orange-800">
                  Autonomous Intervention Protocol
                </span>
                <div className="mt-2 p-3 bg-white rounded-xl border border-orange-200 text-xs text-slate-700 space-y-1.5">
                  <p><strong>Rule:</strong> If anyone found throwing trash &rarr; STOP THEM IMMEDIATELY</p>
                  <p><strong>Deterrent:</strong> 115dB Directional Acoustic Megaphone + Strobe Beam</p>
                  <p><strong>Command Audio:</strong> "STOP! DO NOT DISCARD TRASH IN WATER!"</p>
                </div>
              </div>

              <button
                id="stop-violator-now-btn"
                disabled={!waterLitterDetected || suspectStopped}
                onClick={handleStopSuspect}
                className={`w-full py-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all ${
                  !waterLitterDetected
                    ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
                    : suspectStopped
                    ? 'bg-emerald-600 text-white cursor-default'
                    : 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 text-white'
                }`}
              >
                {suspectStopped ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" /> Violator Stopped & Trash Retrieved
                  </>
                ) : (
                  <>
                    <Volume2 className="w-4 h-4" /> Issue Immediate Voice Order to Stop
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Next Button */}
          <div className="flex justify-end pt-2">
            <button
              onClick={() => {
                sounds.playBeep(600, 0.1);
                setActiveTab(2);
              }}
              className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md flex items-center gap-2 cursor-pointer"
            >
              <span>Next: Weekly Bleaching Powder Dispenser</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* FEATURE 2: ONCE IN A WEEK BLEACHING POWDER TIMER & DISPENSER */}
      {activeTab === 2 && (
        <div className="bg-white border-2 border-orange-200 rounded-2xl p-6 shadow-md space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-orange-100">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-orange-600" />
              <h3 className="text-lg font-bold text-slate-900 font-['Chakra_Petch']">
                Feature 2: Once-In-A-Week Bleaching Powder Automated Timer & Dispenser
              </h3>
            </div>
            <span className="text-xs font-mono font-bold text-slate-500">
              Recurring 7-Day Protocol
            </span>
          </div>

          <p className="text-xs sm:text-sm text-slate-600">
            To prevent bacterial contamination, algae bloom, and waterborne pathogens, GForce Hydra is equipped with an automated once-a-week timer that dispenses measured, eco-safe bleaching powder (Calcium Hypochlorite) into the water body.
          </p>

          {/* Weekly Countdown Timer Card */}
          <div className="p-6 bg-slate-950 text-white rounded-2xl border-2 border-orange-500 space-y-4 shadow-xl">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-orange-400 animate-spin" />
                <span className="font-bold text-orange-300 font-['Chakra_Petch']">
                  RECURRING WEEKLY DISINFECTION SCHEDULE
                </span>
              </div>
              <span className="text-xs font-mono bg-slate-800 px-2.5 py-1 rounded text-slate-300 border border-slate-700">
                Cycle: Every 7 Days (168 Hours)
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-slate-900 rounded-xl border border-slate-800">
              <div>
                <span className="text-xs uppercase tracking-wider text-slate-400 font-mono">
                  Time Until Next Scheduled Bleaching Cycle
                </span>
                <div className="text-3xl sm:text-4xl font-black font-mono text-amber-400 mt-1">
                  {formatDaysHoursMins(weeklySecondsRemaining)}
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Last Dispensed: <span className="text-slate-200 font-semibold">{lastBleachedTimestamp}</span>
                </p>
              </div>

              {/* Fast Forward / Manual Trigger */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  id="trigger-weekly-bleach-btn"
                  disabled={bleachDispensing}
                  onClick={triggerBleachCycle}
                  className="px-4 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 text-white rounded-xl font-bold text-xs flex items-center gap-2 shadow-md cursor-pointer disabled:opacity-60"
                >
                  <Droplet className="w-4 h-4" />
                  <span>{bleachDispensing ? 'Dispensing Powder...' : 'Trigger Bleaching Cycle (Manual Test)'}</span>
                </button>
              </div>
            </div>

            {/* Water Quality Telemetry */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
              <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                <span className="text-slate-400 text-[10px] block">Bleach Dose</span>
                <span className="text-base font-bold text-amber-400">12.5 kg Ca(ClO)₂</span>
              </div>
              <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                <span className="text-slate-400 text-[10px] block">Water Purity Score</span>
                <span className="text-base font-bold text-emerald-400">{waterPurityScore}% (Sanitized)</span>
              </div>
              <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                <span className="text-slate-400 text-[10px] block">Water pH</span>
                <span className="text-base font-bold text-blue-400">7.2 Balanced</span>
              </div>
              <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                <span className="text-slate-400 text-[10px] block">Bacterial Reduction</span>
                <span className="text-base font-bold text-emerald-400">-98.5% Safe</span>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center pt-2">
            <button
              onClick={() => setActiveTab(1)}
              className="px-4 py-2 border border-slate-300 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-50"
            >
              Back to Litter Deterrent
            </button>

            <button
              onClick={() => {
                sounds.playBeep(600, 0.1);
                setActiveTab(3);
              }}
              className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md flex items-center gap-2 cursor-pointer"
            >
              <span>Next: User-Permitted Magnetic Trash Extractor</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* FEATURE 3: USER PERMIT & MAGNETIC TRASH EXTRACTOR MACHINE */}
      {activeTab === 3 && (
        <div className="bg-white border-2 border-orange-200 rounded-2xl p-6 shadow-md space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-orange-100">
            <div className="flex items-center gap-2">
              <Magnet className="w-5 h-5 text-orange-600" />
              <h3 className="text-lg font-bold text-slate-900 font-['Chakra_Petch']">
                Feature 3: User-Permitted Magnetic & Conveyor Trash Extractor
              </h3>
            </div>
            <span className="text-xs font-mono font-bold text-slate-500">
              Rule: REQUIRE USER PERMIT &rarr; ENGAGE MAGNET HARVESTER
            </span>
          </div>

          <p className="text-xs sm:text-sm text-slate-600">
            GForce Hydra is equipped with an industrial-grade neodymium magnetic extraction drum and mesh conveyor. In accordance with safety protocol, it requires explicit operator authorization before deploying to remove submerged metallic and floating trash from the water.
          </p>

          {/* User Permit Authorization Card */}
          <div className="p-5 bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 border-2 border-orange-300 rounded-2xl space-y-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-orange-600" />
              <h4 className="text-base font-extrabold text-slate-900">
                Operator Authorization Required: Grant Permit to Engage Magnetic Harvester?
              </h4>
            </div>
            <p className="text-xs sm:text-sm text-slate-700">
              Deploying the magnetic extractor will submerge the electromagnets, activate the debris conveyor, and clear metallic trash and surface plastic refuse from the sector.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                id="grant-magnetic-permit-btn"
                onClick={handleGrantPermit}
                className={`px-6 py-3 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md cursor-pointer transition-all ${
                  userPermitGranted === true
                    ? 'bg-emerald-600 text-white ring-2 ring-emerald-400'
                    : 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 text-white'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>GRANT PERMIT (ENGAGE MAGNETIC EXTRACTOR)</span>
              </button>

              <button
                id="deny-magnetic-permit-btn"
                onClick={handleDenyPermit}
                className={`px-5 py-3 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 cursor-pointer transition-all ${
                  userPermitGranted === false
                    ? 'bg-slate-800 text-white'
                    : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-300'
                }`}
              >
                <XCircle className="w-4 h-4 text-red-500" />
                <span>Deny / Keep in Standby</span>
              </button>
            </div>
          </div>

          {/* Harvester Active Machine Visualizer */}
          {userPermitGranted && (
            <div className="p-6 bg-slate-950 text-white rounded-2xl border-2 border-orange-500 space-y-4 shadow-xl">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Magnet className="w-5 h-5 text-amber-400 animate-pulse" />
                  <div>
                    <h4 className="font-bold text-sm sm:text-base text-amber-400 font-['Chakra_Petch']">
                      MAGNETIC TRASH EXTRACTOR ACTIVE IN WATER
                    </h4>
                    <p className="text-[11px] text-slate-400">Neodymium electromagnets & automated conveyor lifting debris</p>
                  </div>
                </div>

                <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-full text-xs font-mono font-bold">
                  PERMIT AUTH: OPERATOR-APPROVED
                </span>
              </div>

              {/* Extraction Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 bg-slate-900 rounded-xl border border-slate-800">
                  <span className="text-xs text-slate-400 uppercase font-mono">Submerged Metal Removed</span>
                  <div className="text-3xl font-black text-amber-400 font-mono mt-1">
                    {extractedKgMetal} <span className="text-sm font-normal text-slate-400">kg</span>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1">Rusted scrap, tin cans, iron rebar</p>
                </div>

                <div className="p-4 bg-slate-900 rounded-xl border border-slate-800">
                  <span className="text-xs text-slate-400 uppercase font-mono">Floating Debris Trapped</span>
                  <div className="text-3xl font-black text-orange-400 font-mono mt-1">
                    {extractedKgPlastic} <span className="text-sm font-normal text-slate-400">kg</span>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1">Plastics, bottles, packaging film</p>
                </div>

                <div className="p-4 bg-slate-900 rounded-xl border border-slate-800">
                  <span className="text-xs text-slate-400 uppercase font-mono">Total Water Cleaned</span>
                  <div className="text-3xl font-black text-emerald-400 font-mono mt-1">
                    {(extractedKgMetal + extractedKgPlastic).toFixed(1)} <span className="text-sm font-normal text-slate-400">kg</span>
                  </div>
                  <p className="text-[10px] text-emerald-400 mt-1">Direct SDG 6 Hydro impact</p>
                </div>
              </div>
            </div>
          )}

          {userPermitGranted === false && (
            <div className="p-4 bg-slate-100 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-700 flex items-center gap-2">
              <XCircle className="w-5 h-5 text-red-500 shrink-0" />
              <span>
                Operational permit was denied by the user. The magnetic extraction drum remains safely powered off and docked.
              </span>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between items-center pt-2">
            <button
              onClick={() => setActiveTab(2)}
              className="px-4 py-2 border border-slate-300 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-50"
            >
              Back to Weekly Bleaching
            </button>
            <span className="text-xs font-semibold text-slate-500">
              GF-Hydra Operative Protocol Complete
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
