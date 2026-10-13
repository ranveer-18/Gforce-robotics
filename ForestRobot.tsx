import React, { useState } from 'react';
import { 
  TreePine, MapPin, Send, AlertTriangle, ShieldCheck, 
  ArrowRight, CheckCircle2, Bot, User, Car, FileText, 
  Search, Radio, Navigation, Siren, Eye, RefreshCw, Download
} from 'lucide-react';
import { OpenStreetMapComponent } from '../OpenStreetMapComponent';
import { sounds } from '../../utils/soundEffects';

interface Message {
  id: string;
  sender: 'robo' | 'suspect' | 'user' | 'system';
  text: string;
  timestamp: string;
  analysis?: string;
  isDeception?: boolean;
}

export const ForestRobot: React.FC = () => {
  
  const [currentStep, setCurrentStep] = useState<number>(1);

  
  const [reporterName, setReporterName] = useState('Forest Ranger Maya Sen');
  const [treeType, setTreeType] = useState('Ancient Teak & Rosewood');
  const [treesCutCount, setTreesCutCount] = useState(14);
  const [complaintNotes, setComplaintNotes] = useState('Heard loud two-stroke chainsaw motors near Sector 4 ravine. Multiple fallen mature timber logs spotted.');
  const [complaintSubmitted, setComplaintSubmitted] = useState(false);

  
  const [forestLocation, setForestLocation] = useState('Sundarbans Biosphere Reserve (Sector 4)');
  const [latitude, setLatitude] = useState(21.9497);
  const [longitude, setLongitude] = useState(89.1833);
  const [isLocationVerified, setIsLocationVerified] = useState(false);

  
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploymentProgress, setDeploymentProgress] = useState(0);
  const [hasArrived, setHasArrived] = useState(false);

  
  const [chatMessages, setChatMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'robo',
      text: 'HALT. You are within a protected sanctuary. GForce autonomous forest law enforcement unit is recording. State your identity and reason for being in this restricted logging quadrant.',
      timestamp: '14:22:05',
    },
    {
      id: '2',
      sender: 'suspect',
      text: "Whoa, chill out robot! I'm just an innocent hiker out here birdwatching. I don't know anything about any fallen trees!",
      timestamp: '14:22:18',
      analysis: 'Deception probability: 89.2%. Subject heart rate 142 bpm, acoustic voice pitch elevated.',
      isDeception: true,
    },
  ]);
  const [userInputMessage, setUserInputMessage] = useState('');
  const [culpritConfirmed, setCulpritConfirmed] = useState(false);

  
  const [policeHandoverDone, setPoliceHandoverDone] = useState(false);

  
  const handleSubmitComplaint = (e: React.FormEvent) => {
    e.preventDefault();
    sounds.playBeep(650, 0.1);
    setComplaintSubmitted(true);
    setCurrentStep(2);
    sounds.speakAnnouncement('Deforestation complaint registered. Requesting location verification on OpenStreetMap.');
  };

  
  const handleVerifyLocation = () => {
    sounds.playBeep(700, 0.15);
    setIsLocationVerified(true);
    sounds.speakAnnouncement('Location verified on OpenStreetMap. Sector coordinates locked.');
  };

  
  const handleStartDispatch = () => {
    setIsDeploying(true);
    sounds.playMotorSound();
    let current = 0;
    const interval = setInterval(() => {
      current += 20;
      setDeploymentProgress(current);
      if (current >= 100) {
        clearInterval(interval);
        setIsDeploying(false);
        setHasArrived(true);
        sounds.playBeep(800, 0.2);
        sounds.speakAnnouncement('GForce has arrived at the forest coordinate. Subject apprehended. Initiating interrogation chatbot.');
        setCurrentStep(4);
      }
    }, 450);
  };

  
  const handleSendChatMessage = (textToSend?: string) => {
    const text = textToSend || userInputMessage;
    if (!text.trim()) return;

    sounds.playBeep(550, 0.08);

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setUserInputMessage('');

    
    setTimeout(() => {
      let suspectReply = '';
      let analysis = '';
      let isFinalCulprit = false;

      if (text.toLowerCase().includes('chainsaw') || text.toLowerCase().includes('tool') || text.toLowerCase().includes('boots')) {
        suspectReply = "Okay, okay... that chainsaw in my pickup belongs to my cousin! I was just holding it for him!";
        analysis = 'Spectrometry Analysis: Fresh sap on gloves matches 120-year-old Teak cut 45 mins ago. Chainsaw serial unregistered.';
        isFinalCulprit = true;
      } else if (text.toLowerCase().includes('permit') || text.toLowerCase().includes('license') || text.toLowerCase().includes('id')) {
        suspectReply = "I forgot my timber permit at home, man! Let me off with a warning, I'll replant them!";
        analysis = 'Database Cross-reference: No state forestry permit ever issued for Suspect (Rajesh "Chop" Varma).';
        isFinalCulprit = true;
      } else {
        suspectReply = "Listen, someone paid me $500 to cut these 14 logs and load them on the truck tonight. I confess, don't shoot!";
        analysis = 'Full confession recorded. Video evidence & biometrics logged. CULPRIT VERIFIED: Rajesh Varma.';
        isFinalCulprit = true;
      }

      const suspectMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'suspect',
        text: suspectReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        analysis: analysis,
        isDeception: !isFinalCulprit,
      };

      const roboVerdictMsg: Message = {
        id: (Date.now() + 2).toString(),
        sender: 'robo',
        text: `VERIFICATION COMPLETE. Culprit identified: Rajesh Varma. Violation: Illegal felling of 14 protected Teak trees (Forest Conservation Act Sec. 26). Restraining culprit and initiating emergency Police Handover.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      };

      setChatMessages((prev) => [...prev, suspectMsg, roboVerdictMsg]);
      setCulpritConfirmed(true);
      sounds.playAlert();
      sounds.speakAnnouncement('Culprit verified and restrained. Ready for police handover.');
    }, 900);
  };

  
  const handlePoliceHandover = () => {
    sounds.playAlert();
    setPoliceHandoverDone(true);
    sounds.speakAnnouncement('Handover report dispatched to Forest Police Unit. Suspect transferred to custody.');
  };

  return (
    <div className="space-y-6">
      {/* Top Robot Badge & Sequential Stepper */}
      <div className="bg-white border-2 border-orange-300 rounded-2xl p-5 shadow-md">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-5 pb-4 border-b border-orange-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-white shadow-md shadow-orange-500/20">
              <TreePine className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-orange-600 tracking-wider">GF-FOREST</span>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-orange-100 text-orange-800 rounded-full border border-orange-300">
                  SDG 15 Life on Land
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-['Chakra_Petch']">
                Anti-Deforestation & Police Handover Operative
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-600">Active Workflow:</span>
            <span className="px-3 py-1 bg-orange-500 text-white font-bold text-xs rounded-lg shadow-xs">
              Feature {currentStep} of 5
            </span>
          </div>
        </div>

        {                           }
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
          {[
            { step: 1, title: '1. User Complaint', desc: 'Illegal cutting alert' },
            { step: 2, title: '2. OpenStreetMap', desc: 'Location verification' },
            { step: 3, title: '3. Dispatch Unit', desc: 'Deploy to forest' },
            { step: 4, title: '4. Interrogate AI', desc: 'Culprit chatbot' },
            { step: 5, title: '5. Police Handover', desc: 'Arrest & evidence' },
          ].map((item) => (
            <button
              key={item.step}
              onClick={() => {
                sounds.playBeep(500, 0.05);
                setCurrentStep(item.step);
              }}
              className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                currentStep === item.step
                  ? 'bg-orange-500 text-white border-orange-600 shadow-md font-bold'
                  : currentStep > item.step
                  ? 'bg-orange-50 text-orange-900 border-orange-200 font-medium'
                  : 'bg-white text-slate-500 border-slate-200 hover:border-orange-200'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-[11px]">{item.title}</span>
                {currentStep > item.step && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
              </div>
              <p className={`text-[10px] truncate ${currentStep === item.step ? 'text-orange-100' : 'text-slate-500'}`}>
                {item.desc}
              </p>
            </button>
          ))}
        </div>
      </div>

      {                                               }
      {currentStep === 1 && (
        <div className="bg-white border-2 border-orange-200 rounded-2xl p-6 shadow-md space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-orange-100">
            <AlertTriangle className="w-5 h-5 text-orange-600" />
            <h3 className="text-lg font-bold text-slate-900 font-['Chakra_Petch']">
              Step 1: File Citizen / Ranger Deforestation Complaint
            </h3>
          </div>
          <p className="text-sm text-slate-600">
            Submit a live report of illegal tree felling. GForce will log the incident and prompt for exact location verification.
          </p>

          <form onSubmit={handleSubmitComplaint} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Reporter / Ranger Name</label>
              <input
                type="text"
                value={reporterName}
                onChange={(e) => setReporterName(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 focus:border-orange-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Tree Species Being Cut</label>
              <input
                type="text"
                value={treeType}
                onChange={(e) => setTreeType(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 focus:border-orange-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Estimated Trees Cut Down</label>
              <input
                type="number"
                min="1"
                max="500"
                value={treesCutCount}
                onChange={(e) => setTreesCutCount(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 focus:border-orange-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Reserve Region / Landmark</label>
              <input
                type="text"
                value={forestLocation}
                onChange={(e) => setForestLocation(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 focus:border-orange-500 focus:outline-none"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Incident Details & Audio Observations</label>
              <textarea
                rows={3}
                value={complaintNotes}
                onChange={(e) => setComplaintNotes(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 focus:border-orange-500 focus:outline-none"
                required
              />
            </div>

            <div className="md:col-span-2 flex justify-end">
              <button
                type="submit"
                id="submit-forest-complaint-btn"
                className="px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-sm rounded-xl shadow-md flex items-center gap-2 cursor-pointer transition-transform hover:scale-[1.01]"
              >
                <span>Transmit Complaint to GForce Robot</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      )}

      {                                             }
      {currentStep === 2 && (
        <div className="bg-white border-2 border-orange-200 rounded-2xl p-6 shadow-md space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-orange-100">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-orange-600" />
              <h3 className="text-lg font-bold text-slate-900 font-['Chakra_Petch']">
                Step 2: Location Request & OpenStreetMap Verification
              </h3>
            </div>
            {isLocationVerified && (
              <span className="flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-300">
                <CheckCircle2 className="w-3.5 h-3.5" /> Coordinates Verified
              </span>
            )}
          </div>

          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs sm:text-sm text-amber-900 flex items-start gap-2.5">
            <Bot className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
            <div>
              <strong>GForce Automated Inquiry:</strong> "Complaint received regarding {treesCutCount} cut {treeType} trees. 
              Please confirm and verify the coordinates on OpenStreetMap so my navigation computer can compute the fastest autonomous patrol vector."
            </div>
          </div>

          {                                  }
          <OpenStreetMapComponent
            latitude={latitude}
            longitude={longitude}
            locationName={forestLocation}
            onLocationChange={(lat, lng, name) => {
              setLatitude(lat);
              setLongitude(lng);
              setForestLocation(name);
              setIsLocationVerified(false);
            }}
            isVerified={isLocationVerified}
            onVerify={handleVerifyLocation}
          />

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <button
              onClick={() => setCurrentStep(1)}
              className="px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg"
            >
              Back to Complaint
            </button>

            <button
              id="proceed-to-dispatch-btn"
              onClick={() => {
                if (!isLocationVerified) {
                  handleVerifyLocation();
                }
                setCurrentStep(3);
                sounds.playBeep(600, 0.1);
              }}
              className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md flex items-center gap-2 cursor-pointer"
            >
              <span>Authorize & Go to Verified Location</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {                    }
      {currentStep === 3 && (
        <div className="bg-white border-2 border-orange-200 rounded-2xl p-6 shadow-md space-y-6">
          <div className="flex items-center gap-2 pb-3 border-b border-orange-100">
            <Navigation className="w-5 h-5 text-orange-600" />
            <h3 className="text-lg font-bold text-slate-900 font-['Chakra_Petch']">
              Step 3: Autonomous Deployment to Verified Forest Sector
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-orange-50/70 border border-orange-200 rounded-xl space-y-1">
              <span className="text-[11px] font-bold text-orange-800 uppercase">Target Sector</span>
              <p className="font-bold text-slate-900 text-sm">{forestLocation}</p>
              <p className="font-mono text-xs text-slate-600">{latitude.toFixed(4)}° N, {longitude.toFixed(4)}° E</p>
            </div>

            <div className="p-4 bg-orange-50/70 border border-orange-200 rounded-xl space-y-1">
              <span className="text-[11px] font-bold text-orange-800 uppercase">Patrol Rover Units</span>
              <p className="font-bold text-slate-900 text-sm">GForce Ground Unit 04 + Aerial Drone Alpha</p>
              <p className="text-xs text-emerald-700 font-semibold">LiDAR & Thermal Cameras Online</p>
            </div>

            <div className="p-4 bg-orange-50/70 border border-orange-200 rounded-xl space-y-1">
              <span className="text-[11px] font-bold text-orange-800 uppercase">Reported Damage</span>
              <p className="font-bold text-slate-900 text-sm">{treesCutCount} Trees Felled</p>
              <p className="text-xs text-orange-700 font-semibold">{treeType}</p>
            </div>
          </div>

          {}
          <div className="p-6 bg-slate-900 text-white rounded-2xl border-2 border-orange-500 relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Radio className="w-5 h-5 text-orange-400 animate-pulse" />
                <span className="font-mono text-xs uppercase tracking-wider text-orange-300 font-bold">
                  Telemetry Ingress Stream
                </span>
              </div>
              <span className="font-mono text-xs px-2 py-0.5 bg-orange-500/30 text-orange-300 border border-orange-400/40 rounded">
                Speed: 42 km/h
              </span>
            </div>

            { }
            <div className="w-full bg-slate-800 rounded-full h-3 mb-3 border border-slate-700 overflow-hidden">
              <div
                className="bg-gradient-to-r from-amber-400 to-orange-500 h-full transition-all duration-300"
                style={{ width: `${deploymentProgress}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-xs font-mono text-slate-300">
              <span>Base Station</span>
              <span>
                {hasArrived ? 'TARGET REACHED (0.0 km)' : isDeploying ? `En Route... (${deploymentProgress}%)` : 'Ready to Dispatch'}
              </span>
              <span>Forest Ravine Target</span>
            </div>

            {hasArrived && (
              <div className="mt-4 p-3 bg-emerald-900/60 border border-emerald-500 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2 text-emerald-300 text-xs font-bold">
                  <CheckCircle2 className="w-4 h-4" />
                  GForce has arrived on scene. Visual contact established with suspect holding chainsaw near felled timber.
                </div>
                <button
                  id="start-interrogation-now-btn"
                  onClick={() => setCurrentStep(4)}
                  className="px-3 py-1 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold rounded-lg"
                >
                  Start Interrogation
                </button>
              </div>
            )}
          </div>

          <div className="flex justify-between items-center">
            <button
              onClick={() => setCurrentStep(2)}
              className="px-4 py-2 border border-slate-300 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-50"
            >
              Back to Map
            </button>

            {!hasArrived && (
              <button
                id="initiate-dispatch-rover-btn"
                disabled={isDeploying}
                onClick={handleStartDispatch}
                className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {isDeploying ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" /> Deploying Autonomous Rover...
                  </>
                ) : (
                  <>
                    <Navigation className="w-4 h-4" /> Dispatch Robot to Forest Coordinates
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      )}

      {                        }
      {currentStep === 4 && (
        <div className="bg-white border-2 border-orange-200 rounded-2xl p-6 shadow-md space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-orange-100">
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-orange-600" />
              <h3 className="text-lg font-bold text-slate-900 font-['Chakra_Petch']">
                Step 4: On-Site Suspect Interrogation Chatbot
              </h3>
            </div>
            {culpritConfirmed && (
              <span className="px-3 py-1 bg-red-100 text-red-800 text-xs font-bold rounded-full border border-red-300 flex items-center gap-1">
                <Siren className="w-3.5 h-3.5 text-red-600" /> Culprit Identified & Confirmed
              </span>
            )}
          </div>

          <p className="text-xs sm:text-sm text-slate-600">
            GForce has confronted the suspect found in the sector. Use the interactive chatbot terminal to interrogate 
            the suspect, verify their claims against telemetry & forestry logs, and establish the culprit.
          </p>

          {             }
          <div className="border-2 border-orange-200 rounded-xl overflow-hidden bg-slate-50">
            {/* Terminal Top Bar */}
            <div className="bg-slate-900 text-white px-4 py-2 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="font-mono text-orange-400 font-bold ml-2">GForce AI Truth-Verification Engine</span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">Suspect ID: SUB-9821</span>
            </div>

            {                   }
            <div className="p-4 space-y-3 max-h-80 overflow-y-auto">
              {chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${
                    msg.sender === 'user' || msg.sender === 'robo' ? 'items-start' : 'items-end'
                  }`}
                >
                  <div
                    className={`max-w-[85%] p-3 rounded-2xl text-xs sm:text-sm shadow-xs ${
                      msg.sender === 'robo'
                        ? 'bg-orange-500 text-white rounded-tl-none font-medium'
                        : msg.sender === 'user'
                        ? 'bg-amber-600 text-white rounded-tl-none'
                        : 'bg-white border-2 border-slate-300 text-slate-900 rounded-tr-none'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase mb-1 opacity-80">
                      {msg.sender === 'robo' && <Bot className="w-3 h-3" />}
                      {msg.sender === 'user' && <User className="w-3 h-3" />}
                      {msg.sender === 'suspect' && <AlertTriangle className="w-3 h-3 text-red-500" />}
                      <span>{msg.sender === 'robo' ? 'GForce Autonomous Unit' : msg.sender === 'user' ? 'Operator Question' : 'Suspect (Rajesh)'}</span>
                      <span className="ml-auto font-mono text-[9px]">{msg.timestamp}</span>
                    </div>
                    <p className="leading-relaxed">{msg.text}</p>
                  </div>

                  {msg.analysis && (
                    <div className="mt-1 max-w-[85%] px-2.5 py-1 bg-amber-100/90 border border-amber-300 rounded text-[11px] text-amber-900 font-mono">
                      🔎 <strong>AI Sensor Log:</strong> {msg.analysis}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {     }
            <div className="p-2.5 bg-orange-50/70 border-t border-orange-200 flex flex-wrap gap-2 text-xs">
              <span className="text-slate-600 text-[11px] font-bold shrink-0 self-center">Interrogation Quick Lines:</span>
              <button
                onClick={() => handleSendChatMessage('State why you are carrying an industrial chainsaw with fresh teak sawdust.')}
                className="px-2.5 py-1 bg-white hover:bg-orange-100 border border-orange-300 rounded-md text-slate-800 text-xs transition-colors"
              >
                Inspect Chainsaw & Sawdust
              </button>
              <button
                onClick={() => handleSendChatMessage('Display your official Department of Forestry timber harvesting permit.')}
                className="px-2.5 py-1 bg-white hover:bg-orange-100 border border-orange-300 rounded-md text-slate-800 text-xs transition-colors"
              >
                Demand Timber Permit
              </button>
              <button
                onClick={() => handleSendChatMessage('Who hired you to cut down these 14 protected trees in this biosphere?')}
                className="px-2.5 py-1 bg-white hover:bg-orange-100 border border-orange-300 rounded-md text-slate-800 text-xs transition-colors"
              >
                Identify Logging Contractor
              </button>
            </div>

            {             }
            <div className="p-3 bg-white border-t border-orange-200 flex items-center gap-2">
              <input
                type="text"
                value={userInputMessage}
                onChange={(e) => setUserInputMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendChatMessage()}
                placeholder="Type interrogation command or query to the suspect..."
                className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-orange-500"
              />
              <button
                id="send-interrogation-btn"
                onClick={() => handleSendChatMessage()}
                className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Interrogate</span>
              </button>
            </div>
          </div>

          <div className="flex justify-between items-center pt-2">
            <button
              onClick={() => setCurrentStep(3)}
              className="px-4 py-2 border border-slate-300 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-50"
            >
              Back to Dispatch
            </button>

            <button
              id="proceed-to-police-handover-btn"
              onClick={() => {
                sounds.playBeep(700, 0.1);
                setCurrentStep(5);
              }}
              className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md flex items-center gap-2 cursor-pointer"
            >
              <span>Proceed to Police Handover Dossier</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {                       }
      {currentStep === 5 && (
        <div className="bg-white border-2 border-orange-200 rounded-2xl p-6 shadow-md space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-orange-100">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-orange-600" />
              <h3 className="text-lg font-bold text-slate-900 font-['Chakra_Petch']">
                Step 5: Official Handover of Culprit to Police
              </h3>
            </div>
            {policeHandoverDone ? (
              <span className="px-3 py-1 bg-emerald-100 text-emerald-900 font-bold text-xs rounded-full border border-emerald-300 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Culprit in Police Custody
              </span>
            ) : (
              <span className="px-3 py-1 bg-orange-100 text-orange-900 font-bold text-xs rounded-full border border-orange-300">
                Ready for Handover
              </span>
            )}
          </div>

          {                                }
          <div className="border-2 border-slate-800 rounded-2xl p-5 bg-gradient-to-b from-white to-orange-50/40 space-y-4 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500">
                  CRIMINAL JUSTICE & WILDLIFE PROTECTION ACT
                </span>
                <h4 className="text-base font-extrabold text-slate-900">
                  OFFICIAL POLICE HANDOVER & ARREST DOSSIER
                </h4>
              </div>
              <div className="text-right">
                <span className="font-mono text-xs font-bold text-orange-700 bg-orange-100 px-2 py-0.5 rounded border border-orange-300">
                  CASE-GF-{Math.floor(100000 + Math.random() * 900000)}
                </span>
                <p className="text-[10px] text-slate-500 font-mono mt-0.5">Timestamp: {new Date().toLocaleString()}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              <div className="p-2.5 bg-white border border-slate-200 rounded-lg">
                <span className="text-[10px] font-bold text-slate-500 uppercase">Apprehended Culprit</span>
                <p className="font-bold text-slate-900 mt-0.5">Rajesh "Chop" Varma</p>
                <p className="text-[10px] text-slate-500">Admitted Contract Logger</p>
              </div>

              <div className="p-2.5 bg-white border border-slate-200 rounded-lg">
                <span className="text-[10px] font-bold text-slate-500 uppercase">Verified OSM Location</span>
                <p className="font-bold text-slate-900 mt-0.5 truncate">{forestLocation}</p>
                <p className="font-mono text-[10px] text-slate-500">{latitude.toFixed(4)}° N, {longitude.toFixed(4)}° E</p>
              </div>

              <div className="p-2.5 bg-white border border-slate-200 rounded-lg">
                <span className="text-[10px] font-bold text-slate-500 uppercase">Seized Evidence</span>
                <p className="font-bold text-slate-900 mt-0.5">{treesCutCount} Logs of {treeType}</p>
                <p className="text-[10px] text-red-600 font-semibold">1x 70cc Chainsaw Confiscated</p>
              </div>

              <div className="p-2.5 bg-white border border-slate-200 rounded-lg">
                <span className="text-[10px] font-bold text-slate-500 uppercase">Law Enforcement Unit</span>
                <p className="font-bold text-slate-900 mt-0.5">Forest Police Squad 9</p>
                <p className="text-[10px] text-emerald-600 font-semibold">Inspector S. K. Roy Assigned</p>
              </div>
            </div>

            {                       }
            <div className="p-3 bg-white border border-slate-200 rounded-lg text-xs space-y-1">
              <span className="font-bold text-slate-700">Digital Evidence Docket:</span>
              <ul className="list-disc list-inside space-y-0.5 text-slate-600 text-[11px]">
                <li>Citizen Complaint initiated by <strong>{reporterName}</strong></li>
                <li>Geospatial location confirmed via OpenStreetMap API and Leaflet coordinates</li>
                <li>GForce autonomous rover video feed recorded active felling & chainsaw operation</li>
                <li>Chatbot interrogation log contains full confession of commercial timber theft</li>
              </ul>
            </div>
          </div>

          {                   }
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <button
              onClick={() => setCurrentStep(4)}
              className="px-4 py-2 border border-slate-300 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-50"
            >
              Review Chatbot Interrogation
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  sounds.playBeep(600, 0.1);
                  alert('Police Dossier PDF generated and saved to law enforcement archive.');
                }}
                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg border border-slate-300 flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Dossier</span>
              </button>

              <button
                id="handover-culprit-to-police-btn"
                disabled={policeHandoverDone}
                onClick={handlePoliceHandover}
                className={`px-6 py-2.5 font-bold text-xs sm:text-sm rounded-xl shadow-md flex items-center gap-2 cursor-pointer transition-all ${
                  policeHandoverDone
                    ? 'bg-emerald-600 text-white cursor-default'
                    : 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 text-white'
                }`}
              >
                {policeHandoverDone ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Culprit Transferred to Forest Police</span>
                  </>
                ) : (
                  <>
                    <Siren className="w-4 h-4 text-white" />
                    <span>Hand Culprit Over to Police</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
