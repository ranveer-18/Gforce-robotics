import React from 'react';
import { Shield, Volume2, VolumeX, Sparkles, Home, ChevronRight, Cpu, Download } from 'lucide-react';
import { RobotId } from '../types';
import { sounds } from '../utils/soundEffects';

interface HeaderProps {
  activeRobot: RobotId | null;
  onSelectRobot: (id: RobotId | null) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeRobot,
  onSelectRobot,
  soundEnabled,
  onToggleSound,
}) => {
  const getRobotTitle = (id: RobotId) => {
    switch (id) {
      case 'gf-forest':
        return 'GF-Forest • Anti-Deforestation & Police Handover';
      case 'gf-home':
        return 'GF-Home • Soil Hydration & Solar Thermal Panels';
      case 'gf-traffic':
        return 'GF-Traffic • YOLOv11n Jam, Littering & PUC Verification';
      case 'gf-hydra':
        return 'GF-Hydra • Water Litter, Weekly Bleach & Magnetic Extractor';
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b-2 border-orange-300 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                sounds.playBeep(520, 0.08);
                onSelectRobot(null);
              }}
              className="flex items-center gap-2.5 text-left group focus:outline-none"
            >
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-orange-500 via-amber-500 to-orange-600 flex items-center justify-center text-white font-bold shadow-md shadow-orange-500/20 group-hover:scale-105 transition-transform border border-amber-200">
                <Cpu className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-xl sm:text-2xl tracking-tight text-slate-900 font-['Chakra_Petch']">
                    G<span className="text-orange-600">FORCE</span>
                  </span>
                  <span className="px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider bg-orange-100 text-orange-800 border border-orange-300 rounded-full">
                    SDG Robotics
                  </span>
                </div>
                <p className="text-[11px] sm:text-xs text-slate-600 font-medium hidden sm:block">
                  Autonomous Sustainable Development Robotics Suite
                </p>
              </div>
            </button>

            {/* Breadcrumb if robot active */}
            {activeRobot && (
              <div className="hidden md:flex items-center gap-1.5 pl-3 border-l border-slate-300 text-xs">
                <button
                  onClick={() => onSelectRobot(null)}
                  className="text-slate-600 hover:text-orange-600 font-medium flex items-center gap-1 transition-colors"
                >
                  <Home className="w-3.5 h-3.5" />
                  Main Menu
                </button>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-semibold text-orange-700 bg-orange-50 px-2 py-0.5 rounded border border-orange-200">
                  {getRobotTitle(activeRobot).split(' • ')[0]}
                </span>
              </div>
            )}
          </div>

          {/* Right Controls: Sound, Status, SDG badges */}
          <div className="flex items-center gap-2 sm:gap-3">
            {activeRobot && (
              <button
                onClick={() => {
                  sounds.playBeep(450, 0.08);
                  onSelectRobot(null);
                }}
                className="px-3 py-1.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-orange-50 hover:text-orange-700 border border-slate-300 rounded-lg transition-colors flex items-center gap-1.5"
              >
                <Home className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Main Menu</span>
              </button>
            )}

            <a
              href="/gforce-robotics-project.zip"
              download="gforce-robotics-project.zip"
              title="Download entire project code as a ZIP archive"
              className="px-3 py-1.5 text-xs font-bold text-white bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 rounded-lg shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Download ZIP</span>
            </a>

            <button
              onClick={() => {
                onToggleSound();
                if (!soundEnabled) {
                  sounds.soundEnabled = true;
                  sounds.playBeep(650, 0.1);
                } else {
                  sounds.soundEnabled = false;
                }
              }}
              title={soundEnabled ? 'Mute sound announcements' : 'Enable sound announcements'}
              className={`p-2 rounded-lg border transition-all ${
                soundEnabled
                  ? 'bg-orange-100 text-orange-700 border-orange-300 hover:bg-orange-200'
                  : 'bg-slate-100 text-slate-400 border-slate-200 hover:bg-slate-200'
              }`}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-amber-50 to-orange-50 border border-orange-200 rounded-lg">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-[11px] font-bold text-slate-700">Autonomous Fleet Active</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
