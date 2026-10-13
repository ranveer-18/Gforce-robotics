import React, { useState, useEffect } from 'react';
import { 
  TrafficCone, AlertTriangle, ShieldCheck, Volume2, 
  Car, Trash2, FileCheck, CheckCircle2, XCircle, 
  ArrowRight, Radio, Siren, Eye, RefreshCw, Cpu, Award
} from 'lucide-react';
import { sounds } from '../../utils/soundEffects';

interface VehicleDetect {
  id: string;
  type: string;
  confidence: number;
  color: string;
  x: number;
  y: number;
  plate: string;
}

export const TrafficRobot: React.FC = () => {
  const [activeTab, setActiveTab] = useState<number>(1);

  // FEATURE 1: YOLOV11N JAM DETECTION
  const [vehicleCount, setVehicleCount] = useState<number>(10);
  const [engineOffAnnounced, setEngineOffAnnounced] = useState<boolean>(false);
  const [yoloScanning, setYoloScanning] = useState<boolean>(true);

  // Simulated YOLO detections
  const detectedVehicles: VehicleDetect[] = [
    { id: 'v1', type: 'Sedan Car', confidence: 0.96, color: 'Silver', x: 15, y: 35, plate: 'MH-12-DE-4412' },
    { id: 'v2', type: 'Public Bus', confidence: 0.93, color: 'Blue', x: 45, y: 25, plate: 'DL-01-TC-9801' },
    { id: 'v3', type: 'Commercial Truck', confidence: 0.91, color: 'Orange', x: 75, y: 30, plate: 'KA-04-TR-1190' },
    { id: 'v4', type: 'Hatchback', confidence: 0.95, color: 'White', x: 25, y: 65, plate: 'TN-07-HA-3310' },
    { id: 'v5', type: 'Motorcycle', confidence: 0.94, color: 'Black', x: 60, y: 70, plate: 'GJ-01-MC-8821' },
    { id: 'v6', type: 'Electric SUV', confidence: 0.97, color: 'Red', x: 80, y: 65, plate: 'HR-26-EV-5544' },
  ];

  const isSevereJam = vehicleCount >= 8;

  // Trigger engine-off announcement when jam is heavy
  const triggerEngineOffAnnouncement = () => {
    sounds.playAlert();
    setEngineOffAnnounced(true);
    const msg = `ATTENTION ALL DRIVERS. SEVERE TRAFFIC CONGESTION DETECTED BY YOLOV11N MODEL WITH ${vehicleCount} VEHICLES. INITIATE TEMPORARY ENGINE OFF PROTOCOL TO CURB IDLE EMISSIONS.`;
    sounds.speakAnnouncement(msg);
  };

  // FEATURE 2: LITTER DETECTION & POLICE HANDOVER
  const [litterDetected, setLitterDetected] = useState<boolean>(false);
  const [litterItem, setLitterItem] = useState<string>('Plastic Beverage Bottle');
  const [violatorPlate, setViolatorPlate] = useState<string>('DL-01-AX-9942');
  const [litterPoliceReportDone, setLitterPoliceReportDone] = useState<boolean>(false);

  const handleSimulateLittering = () => {
    sounds.playAlert();
    setLitterDetected(true);
    setLitterPoliceReportDone(false);
    sounds.speakAnnouncement('Litter training model detected trash thrown on road. Vehicle plate captured. Handing violator to police.');
  };

  const handleHandoverLitterToPolice = () => {
    sounds.playAlert();
    setLitterPoliceReportDone(true);
    sounds.speakAnnouncement('Littering citation and video proof transmitted to Traffic Police HQ.');
  };

  // FEATURE 3: POLLUTION PAPER (PUC) 3-CRITERIA INSPECTION
  interface TestVehiclePUC {
    plate: string;
    model: string;
    realCarColor: string;
    expiryDate: string;
    paperPhotoColor: string;
    paperPhotoModel: string;
    stampAuthentic: boolean;
    stampCode: string;
    description: string;
  }

  const testVehicles: TestVehiclePUC[] = [
    {
      plate: 'DL-04-MZ-1024',
      model: 'Hyundai Creta (White)',
      realCarColor: 'White',
      expiryDate: '2027-04-15', // VALID
      paperPhotoColor: 'White',
      paperPhotoModel: 'Hyundai Creta',
      stampAuthentic: true,
      stampCode: 'RTO-AUTH-SEAL-8892',
      description: 'Fully Compliant: Valid Date, Matching Vehicle Photo, Authentic Transport Stamp',
    },
    {
      plate: 'MH-02-CB-8819',
      model: 'Honda City (Silver)',
      realCarColor: 'Silver',
      expiryDate: '2024-02-10', // EXPIRED!
      paperPhotoColor: 'Silver',
      paperPhotoModel: 'Honda City',
      stampAuthentic: true,
      stampCode: 'RTO-AUTH-SEAL-4410',
      description: 'FAILS CRITERION 1: PUC Certificate is expired by over 12 months',
    },
    {
      plate: 'KA-01-EE-7731',
      model: 'Mahindra Scorpio (Black)',
      realCarColor: 'Black',
      expiryDate: '2026-11-20',
      paperPhotoColor: 'Silver Sedan', // MISMATCH PHOTO!
      paperPhotoModel: 'Maruti Dzire',
      stampAuthentic: true,
      stampCode: 'RTO-AUTH-SEAL-7721',
      description: 'FAILS CRITERION 2: Paper vehicle photo does NOT match real car in traffic',
    },
    {
      plate: 'HR-26-QK-9011',
      model: 'Tata Nexon (Blue)',
      realCarColor: 'Blue',
      expiryDate: '2026-12-05',
      paperPhotoColor: 'Blue',
      paperPhotoModel: 'Tata Nexon',
      stampAuthentic: false, // COUNTERFEIT STAMP!
      stampCode: 'INVALID-FAKE-SEAL-0000',
      description: 'FAILS CRITERION 3: Counterfeit / Forged transport authority seal detected by model',
    },
  ];

  const [selectedVehicleIdx, setSelectedVehicleIdx] = useState<number>(0);
  const currentPUC = testVehicles[selectedVehicleIdx];

  // Evaluate 3 Criteria:
  // 1. Conditional statement check on expiry date
  const todayStr = '2026-09-17';
  const isDateValid = new Date(currentPUC.expiryDate) >= new Date(todayStr);

  // 2. Vehicle photo match model (trained Siamese model matching photo against real vehicle)
  const isPhotoMatch = currentPUC.realCarColor.toLowerCase().includes(currentPUC.paperPhotoColor.toLowerCase()) &&
                       currentPUC.model.toLowerCase().includes(currentPUC.paperPhotoModel.toLowerCase());

  // 3. Official seal & stamp check
  const isStampValid = currentPUC.stampAuthentic;

  const allPassed = isDateValid && isPhotoMatch && isStampValid;

  return (
    <div className="space-y-6">
      {/* Top Robot Badge & 3-Feature Stepper */}
      <div className="bg-white border-2 border-orange-300 rounded-2xl p-5 shadow-md">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4 pb-4 border-b border-orange-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-600 to-amber-500 flex items-center justify-center text-white shadow-md shadow-orange-500/20">
              <TrafficCone className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-orange-600 tracking-wider">GF-TRAFFIC</span>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-orange-100 text-orange-900 rounded-full border border-orange-300">
                  SDG 11 Sustainable Cities
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-['Chakra_Petch']">
                Clean Air, Road Litter & PUC Enforcement Operative
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
            { id: 1, title: '1. YOLOv11n Jam Detection', desc: 'Detect vehicle count & engine off announcement' },
            { id: 2, title: '2. Litter Training Model', desc: 'Detect road thrash & handover to police' },
            { id: 3, title: '3. 3-Criteria Pollution Check', desc: 'Date, photo match & official seal validation' },
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

      {/* FEATURE 1: YOLOV11N MODEL JAM DETECTION & ENGINE OFF */}
      {activeTab === 1 && (
        <div className="bg-white border-2 border-orange-200 rounded-2xl p-6 shadow-md space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-orange-100">
            <div className="flex items-center gap-2">
              <Cpu className="w-5 h-5 text-orange-600" />
              <h3 className="text-lg font-bold text-slate-900 font-['Chakra_Petch']">
                Feature 1: YOLOv11n Neural Vision & Engine-Off Eco Announcement
              </h3>
            </div>
            <span className="text-xs font-mono font-bold text-slate-500">
              Model: YOLOv11n-nano-traffic.pt
            </span>
          </div>

          <p className="text-xs sm:text-sm text-slate-600">
            GForce processes high-angle road intersection cameras with the ultralight YOLOv11n model. If severe traffic congestion is detected, it triggers a loud public announcement instructing drivers to temporarily turn off idling engines.
          </p>

          {/* YOLOv11n Interactive Camera Feed Visualizer */}
          <div className="relative rounded-2xl overflow-hidden bg-slate-950 border-2 border-orange-500 p-4 min-h-[300px] flex flex-col justify-between shadow-xl">
            {/* Top HUD */}
            <div className="flex items-center justify-between z-10">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                </span>
                <span className="text-xs font-mono font-bold text-orange-400">
                  LIVE FEED: JUNCTION 14 EAST HIGHWAY • YOLOv11n FPS: 48.2
                </span>
              </div>
              <span className="text-xs font-mono bg-slate-800 text-slate-200 px-2 py-0.5 rounded border border-slate-700">
                Inference Latency: 4.8ms
              </span>
            </div>

            {/* Simulated Road with Bounding Boxes */}
            <div className="relative my-4 h-48 sm:h-56 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 rounded-xl overflow-hidden border border-slate-800">
              {/* Lane Markings */}
              <div className="absolute inset-0 flex justify-around items-center pointer-events-none opacity-20">
                <div className="w-1 h-full border-r-2 border-dashed border-white" />
                <div className="w-1 h-full border-r-2 border-dashed border-white" />
                <div className="w-1 h-full border-r-2 border-dashed border-white" />
              </div>

              {/* Bounding Boxes on Detected Vehicles */}
              {detectedVehicles.slice(0, Math.min(vehicleCount, detectedVehicles.length)).map((v) => (
                <div
                  key={v.id}
                  className="absolute p-1 border-2 border-amber-400 bg-amber-400/10 rounded text-[10px] font-mono text-amber-300 shadow-sm"
                  style={{ left: `${v.x}%`, top: `${v.y}%`, transform: 'translate(-50%, -50%)' }}
                >
                  <div className="bg-slate-950 px-1 py-0.5 rounded border border-amber-400/60 font-bold whitespace-nowrap">
                    {v.type} <span className="text-orange-400 font-normal">{(v.confidence * 100).toFixed(0)}%</span>
                  </div>
                </div>
              ))}

              {/* Center Severe Alert Overlay if Jam is Heavy */}
              {isSevereJam && (
                <div className="absolute inset-0 bg-red-950/60 backdrop-blur-[1px] flex flex-col items-center justify-center p-4 text-center">
                  <div className="p-3 bg-red-600/90 text-white rounded-full mb-2 animate-bounce shadow-lg">
                    <Siren className="w-8 h-8" />
                  </div>
                  <h4 className="text-base sm:text-xl font-extrabold text-white tracking-wide font-['Chakra_Petch']">
                    SEVERE TRAFFIC CONGESTION DETECTED!
                  </h4>
                  <p className="text-xs text-red-200 max-w-md mt-1">
                    {vehicleCount} vehicles queued. Critical idling pollution accumulation.
                  </p>
                </div>
              )}
            </div>

            {/* Bottom HUD: Count & Engine-Off Status */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800 text-xs font-mono">
              <div className="flex items-center gap-2">
                <span className="text-slate-400">Total Vehicles In Jam:</span>
                <span className="text-xl font-bold text-orange-400 font-mono">{vehicleCount}</span>
                <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                  isSevereJam ? 'bg-red-500/20 text-red-400 border border-red-500/40' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                }`}>
                  {isSevereJam ? 'CRITICAL GRIDLOCK' : 'MODERATE FLOW'}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  id="trigger-engine-off-btn"
                  onClick={triggerEngineOffAnnouncement}
                  className="px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 text-white rounded-xl font-bold flex items-center gap-2 shadow-md cursor-pointer"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>Broadcast Temporary Engine-Off Protocol</span>
                </button>
              </div>
            </div>
          </div>

          {/* Jam Density Interactive Slider */}
          <div className="p-4 bg-orange-50/70 border border-orange-200 rounded-xl space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-800">
              <span>Simulate Real-time Vehicle Density:</span>
              <span className="text-orange-700 font-mono text-sm">{vehicleCount} Vehicles</span>
            </div>
            <input
              type="range"
              min="2"
              max="20"
              value={vehicleCount}
              onChange={(e) => {
                const val = Number(e.target.value);
                setVehicleCount(val);
                if (val >= 8 && !engineOffAnnounced) {
                  triggerEngineOffAnnouncement();
                }
              }}
              className="w-full accent-orange-600 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-500">
              <span>Light Traffic (2-4)</span>
              <span>Moderate (5-7)</span>
              <span className="text-orange-700 font-bold">Severe Jam (&ge;8: Triggers Engine-Off)</span>
            </div>
          </div>

          {/* Environmental Impact of Engine-Off */}
          {engineOffAnnounced && (
            <div className="p-4 bg-emerald-50 border-2 border-emerald-300 rounded-xl flex flex-wrap items-center justify-between gap-3 text-xs text-emerald-900">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <div>
                  <strong>Temporary Engine-Off Broadcast Active:</strong> Idling engines stopped across {vehicleCount} vehicles.
                </div>
              </div>
              <div className="flex items-center gap-3 font-mono font-bold">
                <span>Fuel Saved: ~{(vehicleCount * 0.45).toFixed(1)} L/hr</span>
                <span>CO2 Prevented: ~{(vehicleCount * 1.15).toFixed(1)} kg/hr</span>
              </div>
            </div>
          )}

          {/* Next Button */}
          <div className="flex justify-end pt-2">
            <button
              onClick={() => {
                sounds.playBeep(600, 0.1);
                setActiveTab(2);
              }}
              className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md flex items-center gap-2 cursor-pointer"
            >
              <span>Next: Road Litter Training AI & Police Handover</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* FEATURE 2: ROAD LITTER TRAINING MODEL & POLICE HANDOVER */}
      {activeTab === 2 && (
        <div className="bg-white border-2 border-orange-200 rounded-2xl p-6 shadow-md space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-orange-100">
            <div className="flex items-center gap-2">
              <Trash2 className="w-5 h-5 text-orange-600" />
              <h3 className="text-lg font-bold text-slate-900 font-['Chakra_Petch']">
                Feature 2: Litter Vision AI Model & Handover to Police
              </h3>
            </div>
            <span className="text-xs font-mono font-bold text-slate-500">
              Model: Litter-RoadNet-v4.weights
            </span>
          </div>

          <p className="text-xs sm:text-sm text-slate-600">
            Uses a dedicated high-speed convolutional model trained to detect littering events in real time. When a driver or passenger throws trash from a moving vehicle, the AI locks onto the trajectory, captures the vehicle plate, and compiles an automated police evidence package.
          </p>

          {/* Litter Detection Demo Console */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Camera Simulation View */}
            <div className="p-4 bg-slate-950 text-white rounded-2xl border-2 border-orange-500 space-y-3">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-orange-400 font-bold">LITTER SURVEILLANCE FEED</span>
                <span className="text-slate-400">CAM-08 WEST HIGHWAY</span>
              </div>

              <div className="h-48 bg-slate-900 rounded-xl relative overflow-hidden flex items-center justify-center border border-slate-800">
                {litterDetected ? (
                  <div className="space-y-2 text-center p-4">
                    <div className="inline-block p-2 bg-red-600 text-white rounded-full animate-bounce">
                      <AlertTriangle className="w-6 h-6" />
                    </div>
                    <div className="text-sm font-bold text-red-400 font-['Chakra_Petch']">
                      LITTERING EVENT DETECTED (98.6% AI CONFIDENCE)
                    </div>
                    <div className="font-mono text-xs text-amber-300">
                      Vehicle: {violatorPlate} • Item: {litterItem}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      GPS: 28.6139° N, 77.2090° E • Velocity: 54 km/h
                    </div>
                  </div>
                ) : (
                  <div className="text-center p-4 text-slate-500">
                    <Eye className="w-8 h-8 mx-auto mb-2 opacity-50 text-orange-400" />
                    <p className="text-xs">AI Litter Vision scanning traffic stream...</p>
                    <p className="text-[10px] text-slate-600 mt-1">No road trash detected currently</p>
                  </div>
                )}
              </div>

              <button
                id="simulate-road-litter-btn"
                onClick={handleSimulateLittering}
                className="w-full py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                <span>Simulate Littering Event (Throwing Trash On Road)</span>
              </button>
            </div>

            {/* Police Handover Card */}
            <div className="p-4 bg-orange-50/70 border-2 border-orange-300 rounded-2xl flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-orange-800">
                    Traffic Police Incident Handover
                  </span>
                  {litterPoliceReportDone && (
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded border border-emerald-300">
                      Transmitted
                    </span>
                  )}
                </div>

                <div className="space-y-2 text-xs text-slate-700 bg-white p-3 rounded-xl border border-orange-200">
                  <p><strong>Offense:</strong> Section 278 Public Health & Highway Littering</p>
                  <p><strong>Plate Recognized:</strong> <span className="font-mono font-bold text-orange-700">{violatorPlate}</span></p>
                  <p><strong>Contraband:</strong> {litterItem} thrown onto active roadway</p>
                  <p><strong>Automated Penalty:</strong> ₹2,500 Fine / Mandatory Community Service</p>
                </div>
              </div>

              <button
                id="handover-litter-police-btn"
                disabled={!litterDetected || litterPoliceReportDone}
                onClick={handleHandoverLitterToPolice}
                className={`w-full py-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all ${
                  !litterDetected
                    ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
                    : litterPoliceReportDone
                    ? 'bg-emerald-600 text-white cursor-default'
                    : 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 text-white'
                }`}
              >
                {litterPoliceReportDone ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" /> Handed Over to Traffic Police
                  </>
                ) : (
                  <>
                    <Siren className="w-4 h-4" /> Hand Over Violator to Police
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Next Button */}
          <div className="flex justify-between items-center pt-2">
            <button
              onClick={() => setActiveTab(1)}
              className="px-4 py-2 border border-slate-300 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-50"
            >
              Back to Jam Detection
            </button>

            <button
              onClick={() => {
                sounds.playBeep(600, 0.1);
                setActiveTab(3);
              }}
              className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md flex items-center gap-2 cursor-pointer"
            >
              <span>Next: 3-Criteria Pollution Paper Inspection</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* FEATURE 3: POLLUTION PAPER 3-CRITERIA INSPECTION */}
      {activeTab === 3 && (
        <div className="bg-white border-2 border-orange-200 rounded-2xl p-6 shadow-md space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-orange-100">
            <div className="flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-orange-600" />
              <h3 className="text-lg font-bold text-slate-900 font-['Chakra_Petch']">
                Feature 3: Pollution Paper (PUC) 3-Criteria Neural Inspection
              </h3>
            </div>
            <span className="text-xs font-mono font-bold text-slate-500">
              3 AI Models & Conditions Active
            </span>
          </div>

          <p className="text-xs sm:text-sm text-slate-600">
            GForce inspects the Pollution Under Control (PUC) certificate for vehicles in traffic against <strong>3 distinct criteria</strong>:
            <br />
            <strong>1) Conditional Expiry Statement:</strong> Checks certificate validity date against current date.
            <br />
            <strong>2) Visual Vehicle Match Model:</strong> Matches the printed photo on the paper to the actual vehicle in the traffic camera.
            <br />
            <strong>3) Official Stamp & Seal Authentication:</strong> Deep forensic inspection of the official authority stamp.
          </p>

          {/* Test Vehicle Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
              Select Vehicle In Traffic Queue to Inspect:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
              {testVehicles.map((tv, idx) => (
                <button
                  key={tv.plate}
                  onClick={() => {
                    sounds.playBeep(520, 0.08);
                    setSelectedVehicleIdx(idx);
                  }}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    selectedVehicleIdx === idx
                      ? 'bg-orange-500 text-white border-orange-600 shadow-md font-bold'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-orange-300'
                  }`}
                >
                  <span className="font-mono text-xs block opacity-80">{tv.plate}</span>
                  <p className="text-xs sm:text-sm font-bold truncate mt-0.5">{tv.model}</p>
                  <p className={`text-[10px] mt-1 line-clamp-2 ${selectedVehicleIdx === idx ? 'text-orange-100' : 'text-slate-500'}`}>
                    {tv.description}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* 3 Criteria Evaluation Breakdown Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* CRITERION 1: CONDITIONAL STATEMENT ON EXPIRY DATE */}
            <div className={`p-4 rounded-xl border-2 space-y-2 ${
              isDateValid ? 'bg-emerald-50/70 border-emerald-400 text-emerald-950' : 'bg-red-50/70 border-red-400 text-red-950'
            }`}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider">Criterion 1</span>
                {isDateValid ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-600" />
                )}
              </div>
              <h4 className="font-bold text-sm">Conditional Expiry Date Check</h4>
              <p className="text-xs opacity-80">
                Evaluating: <code className="font-mono bg-white/70 px-1 py-0.5 rounded">expiryDate &gt;= today</code>
              </p>
              <div className="p-2 bg-white/90 rounded border text-xs font-mono">
                <div>Paper Expiry: <strong>{currentPUC.expiryDate}</strong></div>
                <div>Current Date: <strong>{todayStr}</strong></div>
                <div className={`mt-1 font-bold ${isDateValid ? 'text-emerald-700' : 'text-red-700'}`}>
                  Result: {isDateValid ? 'VALID (PASSED)' : 'EXPIRED (FAILED)'}
                </div>
              </div>
            </div>

            {/* CRITERION 2: VEHICLE PHOTO TO REAL CAR MATCH */}
            <div className={`p-4 rounded-xl border-2 space-y-2 ${
              isPhotoMatch ? 'bg-emerald-50/70 border-emerald-400 text-emerald-950' : 'bg-red-50/70 border-red-400 text-red-950'
            }`}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider">Criterion 2</span>
                {isPhotoMatch ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-600" />
                )}
              </div>
              <h4 className="font-bold text-sm">Visual Photo Match Model</h4>
              <p className="text-xs opacity-80">
                Trained Siamese Net matching paper vehicle photo to camera stream.
              </p>
              <div className="p-2 bg-white/90 rounded border text-xs font-mono">
                <div>Real Vehicle: <strong>{currentPUC.model}</strong></div>
                <div>Paper Photo: <strong>{currentPUC.paperPhotoModel} ({currentPUC.paperPhotoColor})</strong></div>
                <div className={`mt-1 font-bold ${isPhotoMatch ? 'text-emerald-700' : 'text-red-700'}`}>
                  Result: {isPhotoMatch ? '98.4% MATCH (PASSED)' : '31.2% MISMATCH (FAILED)'}
                </div>
              </div>
            </div>

            {/* CRITERION 3: OFFICIAL STAMP & SEAL VERIFICATION */}
            <div className={`p-4 rounded-xl border-2 space-y-2 ${
              isStampValid ? 'bg-emerald-50/70 border-emerald-400 text-emerald-950' : 'bg-red-50/70 border-red-400 text-red-950'
            }`}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider">Criterion 3</span>
                {isStampValid ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-600" />
                )}
              </div>
              <h4 className="font-bold text-sm">Official Stamp Authentication</h4>
              <p className="text-xs opacity-80">
                Optical forensic model checking official Transport seal integrity.
              </p>
              <div className="p-2 bg-white/90 rounded border text-xs font-mono">
                <div>Seal Code: <strong>{currentPUC.stampCode}</strong></div>
                <div>Watermark: <strong>{currentPUC.stampAuthentic ? 'Cryptographic Genuine' : 'Counterfeit / Missing'}</strong></div>
                <div className={`mt-1 font-bold ${isStampValid ? 'text-emerald-700' : 'text-red-700'}`}>
                  Result: {isStampValid ? 'AUTHENTIC SEAL (PASSED)' : 'FRAUDULENT SEAL (FAILED)'}
                </div>
              </div>
            </div>
          </div>

          {/* Overall Verdict Banner */}
          <div className={`p-4 rounded-2xl border-2 flex flex-wrap items-center justify-between gap-4 ${
            allPassed
              ? 'bg-emerald-100 border-emerald-400 text-emerald-950'
              : 'bg-red-100 border-red-400 text-red-950'
          }`}>
            <div className="flex items-center gap-3">
              <Award className={`w-8 h-8 ${allPassed ? 'text-emerald-600' : 'text-red-600'}`} />
              <div>
                <h4 className="text-base font-extrabold font-['Chakra_Petch']">
                  OVERALL PUC INSPECTION VERDICT: {allPassed ? 'CERTIFIED PASS' : 'VIOLATION - IMPOUND & CITATION'}
                </h4>
                <p className="text-xs mt-0.5">
                  Vehicle: <strong>{currentPUC.plate}</strong> • {allPassed ? 'All 3 criteria successfully fulfilled' : currentPUC.description}
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                sounds.playBeep(allPassed ? 750 : 400, 0.15);
                sounds.speakAnnouncement(
                  allPassed 
                    ? `Vehicle ${currentPUC.plate} passed all three pollution paper criteria.`
                    : `Inspection failure for vehicle ${currentPUC.plate}. Violation ticket issued.`
                );
              }}
              className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-900 border border-slate-300 font-bold text-xs rounded-xl shadow-xs"
            >
              Announce Verdict
            </button>
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center pt-2">
            <button
              onClick={() => setActiveTab(2)}
              className="px-4 py-2 border border-slate-300 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-50"
            >
              Back to Road Litter AI
            </button>
            <span className="text-xs font-semibold text-slate-500">
              All GF-Traffic Protocols Complete
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
