import React from 'react';
import { TreePine, Home, TrafficCone, Waves, ArrowRight, ShieldCheck, Zap, Sparkles, Cpu, Clock, CheckCircle2 } from 'lucide-react';
import { RobotId } from '../types';
import { sounds } from '../utils/soundEffects';

interface MainMenuProps {
  onSelectRobot: (id: RobotId) => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({ onSelectRobot }) => {
  const robots = [
    {
      id: 'gf-forest' as RobotId,
      code: 'GF-FOREST',
      name: 'Forest Defense & Anti-Logging Robot',
      tagline: 'Deforestation complaints, OpenStreetMap verification & culprit interrogation',
      sdg: 'SDG 15: Life on Land',
      features: [
        'User complaint intake on tree cutting & illegal logging',
        'OpenStreetMap interactive coordinate verification',
        'Autonomous rover & patrol drone dispatch to forest sector',
        'On-site suspect interrogation chatbot with truth-verification',
        'Culprit identification & official handover to Forest Police',
      ],
      icon: TreePine,
      badge: '5-Stage Mission',
      accent: 'border-orange-500',
    },
    {
      id: 'gf-home' as RobotId,
      code: 'GF-HOME',
      name: 'Smart Botanical & Solar Habitat Robot',
      tagline: 'Automated 24h soil hydration motor & 30-minute solar heating panels',
      sdg: 'SDG 12: Sustainable Habitats',
      features: [
        'Plant dry time assessment (hours without irrigation)',
        'Automatic motor pump trigger if time > 24 hours',
        'Interactive sunlight necessity diagnostic query',
        'Automated 30-minute solar heating & growth panel deployment',
        'Real-time soil moisture and solar thermal flux telemetry',
      ],
      icon: Home,
      badge: 'Dual-Cycle Eco',
      accent: 'border-amber-500',
    },
    {
      id: 'gf-traffic' as RobotId,
      code: 'GF-TRAFFIC',
      name: 'Clean Air & Road Litter Enforcement Robot',
      tagline: 'YOLOv11n traffic jam engine-off, litter AI police handover & 3-criteria PUC checks',
      sdg: 'SDG 11: Sustainable Cities',
      features: [
        'YOLOv11n vehicle detection & severe jam engine-off announcement',
        'AI litter training model detecting road trash & police handover',
        '3-Criteria Pollution Paper (PUC) inspection verification',
        '• Criterion 1: Expiry date conditional validity statement',
        '• Criterion 2: Vehicle photo to real traffic camera visual match',
        '• Criterion 3: Official authority seal and stamp authentication',
      ],
      icon: TrafficCone,
      badge: 'Triple AI Protocol',
      accent: 'border-orange-600',
    },
    {
      id: 'gf-hydra' as RobotId,
      code: 'GF-HYDRA',
      name: 'Aquatic Protection & Debris Extractor Robot',
      tagline: 'Waterway litter deterrent, weekly bleaching dispenser & magnetic trash harvester',
      sdg: 'SDG 6: Clean Water & Sanitation',
      features: [
        'Water litter AI vision model detecting trash thrown into water',
        'Immediate audible warning siren & strobe to stop violators',
        'Weekly automated bleaching powder cycle dispenser & 7-day timer',
        'User operational permit authorization system',
        'Electromagnetic debris & trash extraction harvester in action',
      ],
      icon: Waves,
      badge: 'Aquatic Multi-Tool',
      accent: 'border-orange-500',
    },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Saffron & White Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-white via-orange-50/70 to-amber-100/50 border-2 border-orange-300 rounded-2xl p-6 sm:p-10 shadow-lg">
        {/* Subtle Decorative Saffron Accents */}
        <div className="absolute -top-12 -right-12 w-56 h-56 bg-orange-400/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-amber-400/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-100/90 border border-orange-300 rounded-full text-xs font-bold text-orange-900 mb-4 shadow-xs">
            <Cpu className="w-3.5 h-3.5 text-orange-600" />
            <span>GForce robots based on AIML for Sustainable Development</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight font-['Chakra_Petch'] leading-tight">
            Autonomous Robotics for <span className="text-orange-600 underline decoration-amber-400 decoration-4 underline-offset-4">Sustainable Development</span>
          </h1>

          <p className="mt-4 text-base sm:text-lg text-slate-700 leading-relaxed font-normal">
            Select a specialized robotic operative below. Each robot executes its complete suite of sustainable 
            interventions <strong className="text-slate-900 font-semibold">one by one</strong>—combining real-time sensor feedback, OpenStreetMap geospatial verification, computer vision detection, automated timers, and police law enforcement dossiers.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3 text-xs font-semibold text-slate-800">
            <span className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-orange-200 rounded-lg shadow-xs">
              <CheckCircle2 className="w-4 h-4 text-orange-600" /> High-Contrast Saffron UI
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-orange-200 rounded-lg shadow-xs">
              <Zap className="w-4 h-4 text-amber-600" /> Sequential Feature Automation
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-orange-200 rounded-lg shadow-xs">
              <ShieldCheck className="w-4 h-4 text-emerald-600" /> Police Dossier Integration
            </span>
          </div>
        </div>
      </div>

      {/* Robot Selection Cards Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-['Chakra_Petch']">
              Select an Operative Unit
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Pick a robot to start its comprehensive step-by-step automated workflow.
            </p>
          </div>
          <span className="text-xs font-bold text-orange-700 bg-orange-100 px-3 py-1 rounded-full border border-orange-300">
            4 Operatives Ready
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {robots.map((robot) => {
            const IconComponent = robot.icon;
            return (
              <div
                key={robot.id}
                id={`card-${robot.id}`}
                className="bg-white border-2 border-orange-200 hover:border-orange-500 rounded-2xl p-6 shadow-md hover:shadow-xl transition-all flex flex-col justify-between group relative overflow-hidden"
              >
                {/* Top Saffron Accent Line */}
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-orange-500 via-amber-400 to-orange-600" />

                <div>
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-white shadow-md shadow-orange-500/25 group-hover:scale-110 transition-transform">
                        <IconComponent className="w-6 h-6" />
                      </div>
                      <div>
                        <span className="font-mono text-xs font-bold text-orange-600 tracking-wider">
                          {robot.code}
                        </span>
                        <h3 className="text-lg sm:text-xl font-bold text-slate-900 group-hover:text-orange-700 transition-colors">
                          {robot.name}
                        </h3>
                      </div>
                    </div>
                    <span className="text-[11px] font-bold px-2.5 py-1 bg-amber-50 text-amber-900 border border-amber-300 rounded-full shrink-0">
                      {robot.badge}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-600 mb-4 font-medium">
                    {robot.tagline}
                  </p>

                  <div className="text-[11px] font-bold text-orange-800 bg-orange-50/80 px-2.5 py-1 rounded-md border border-orange-200 inline-block mb-4">
                    {robot.sdg}
                  </div>

                  {/* Feature Checklist */}
                  <div className="space-y-1.5 mb-6 border-t border-slate-100 pt-3">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                      Sequential Execution Protocol:
                    </p>
                    {robot.features.map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                        <span className="w-4 h-4 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <span className="leading-tight">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Launch Button */}
                <button
                  id={`btn-launch-${robot.id}`}
                  onClick={() => {
                    sounds.playBeep(600, 0.1);
                    onSelectRobot(robot.id);
                  }}
                  className="w-full py-3 px-4 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-sm rounded-xl shadow-md shadow-orange-500/25 flex items-center justify-center gap-2 group-hover:gap-3 transition-all cursor-pointer border border-amber-300"
                >
                  <span>Engage {robot.code} Workflow</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
