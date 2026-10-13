import React, { useState } from 'react';
import { Header } from './components/Header';
import { MainMenu } from './components/MainMenu';
import { ForestRobot } from './components/robots/ForestRobot';
import { HomeRobot } from './components/robots/HomeRobot';
import { TrafficRobot } from './components/robots/TrafficRobot';
import { HydraRobot } from './components/robots/HydraRobot';
import { RobotId } from './types';
import { sounds } from './utils/soundEffects';
import { Leaf, Shield, Globe, Award, Sparkles } from 'lucide-react';

export default function App() {
  const [activeRobot, setActiveRobot] = useState<RobotId | null>(null);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  const handleToggleSound = () => {
    setSoundEnabled((prev) => !prev);
  };

  const handleSelectRobot = (id: RobotId | null) => {
    setActiveRobot(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-['Plus_Jakarta_Sans'] antialiased selection:bg-orange-200 selection:text-orange-950">
      {/* Top High-Contrast White & Saffron Header */}
      <Header
        activeRobot={activeRobot}
        onSelectRobot={handleSelectRobot}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {!activeRobot ? (
          <MainMenu onSelectRobot={handleSelectRobot} />
        ) : (
          <div>
            {activeRobot === 'gf-forest' && <ForestRobot />}
            {activeRobot === 'gf-home' && <HomeRobot />}
            {activeRobot === 'gf-traffic' && <TrafficRobot />}
            {activeRobot === 'gf-hydra' && <HydraRobot />}
          </div>
        )}
      </main>

      {/* Sustainable Development SDG High-Contrast Footer */}
      <footer className="bg-white border-t-2 border-orange-200 py-8 px-4 sm:px-6 lg:px-8 mt-12 text-xs text-slate-600">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-orange-500 text-white flex items-center justify-center font-bold text-xs shadow-xs">
              GF
            </div>
            <div>
              <p className="font-bold text-slate-900 text-sm font-['Chakra_Petch']">
                GForce Autonomous Robotics Program
              </p>
              <p className="text-[11px] text-slate-500">
                Built for Global Sustainable Development Goals (UN SDGs 6, 11, 12, 15)
              </p>
            </div>
          </div>

          {/* SDG Goal Badges */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            <span className="px-2.5 py-1 bg-green-50 text-green-800 border border-green-300 rounded-full font-bold text-[10px]">
              SDG 15: Life On Land (GF-Forest)
            </span>
            <span className="px-2.5 py-1 bg-amber-50 text-amber-900 border border-amber-300 rounded-full font-bold text-[10px]">
              SDG 12: Sustainable Consumption (GF-Home)
            </span>
            <span className="px-2.5 py-1 bg-orange-50 text-orange-900 border border-orange-300 rounded-full font-bold text-[10px]">
              SDG 11: Sustainable Cities (GF-Traffic)
            </span>
            <span className="px-2.5 py-1 bg-blue-50 text-blue-900 border border-blue-300 rounded-full font-bold text-[10px]">
              SDG 6: Clean Water (GF-Hydra)
            </span>
          </div>

          <div className="text-center md:text-right text-[11px] text-slate-500">
            <span>White & Saffron High-Contrast UI • Real-time Leaflet OSM Integration</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
