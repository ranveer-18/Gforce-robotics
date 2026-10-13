import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { MapPin, CheckCircle, Navigation, Layers } from 'lucide-react';

interface Props {
  latitude: number;
  longitude: number;
  locationName: string;
  onLocationChange?: (lat: number, lng: number, name: string) => void;
  isVerified?: boolean;
  onVerify?: () => void;
}

export const OpenStreetMapComponent: React.FC<Props> = ({
  latitude,
  longitude,
  locationName,
  onLocationChange,
  isVerified,
  onVerify,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const [mapReady, setMapReady] = useState(false);

  // Preset forest reserves for quick testing
  const forestPresets = [
    { name: 'Sundarbans Biosphere Reserve', lat: 21.9497, lng: 89.1833 },
    { name: 'Jim Corbett National Park (Sector 4)', lat: 29.5300, lng: 78.7747 },
    { name: 'Kaziranga Forest Sanctuary (Zone A)', lat: 26.5775, lng: 93.1711 },
    { name: 'Black Forest Reserve (Schwarzwald)', lat: 48.1764, lng: 8.2144 },
    { name: 'Olympic National Rainforest', lat: 47.8021, lng: -123.6044 },
  ];

  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Custom Saffron Robot Map Pin
    const saffronIcon = L.divIcon({
      className: 'custom-saffron-pin',
      html: `
        <div style="background-color: #F97316; width: 34px; height: 34px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); display: flex; align-items: center; justify-content: center; border: 3px solid #FFFFFF; box-shadow: 0 4px 10px rgba(0,0,0,0.35);">
          <div style="transform: rotate(45deg); color: white; font-weight: bold; font-size: 13px;">GF</div>
        </div>
      `,
      iconSize: [34, 34],
      iconAnchor: [17, 34],
      popupAnchor: [0, -32],
    });

    const map = L.map(mapContainerRef.current, {
      center: [latitude, longitude],
      zoom: 12,
      attributionControl: false,
    });

    // OpenStreetMap standard tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
    }).addTo(map);

    const marker = L.marker([latitude, longitude], { icon: saffronIcon, draggable: true })
      .addTo(map)
      .bindPopup(`<b>${locationName}</b><br/>GForce Forest Patrol Boundary`)
      .openPopup();

    marker.on('dragend', (e) => {
      const target = e.target as L.Marker;
      const pos = target.getLatLng();
      if (onLocationChange) {
        onLocationChange(Number(pos.lat.toFixed(4)), Number(pos.lng.toFixed(4)), `Custom Forest Coordinates (${pos.lat.toFixed(4)}, ${pos.lng.toFixed(4)})`);
      }
    });

    map.on('click', (e) => {
      marker.setLatLng(e.latlng);
      if (onLocationChange) {
        onLocationChange(Number(e.latlng.lat.toFixed(4)), Number(e.latlng.lng.toFixed(4)), `Selected Geo-Sector (${e.latlng.lat.toFixed(4)}, ${e.latlng.lng.toFixed(4)})`);
      }
    });

    mapInstanceRef.current = map;
    markerRef.current = marker;
    setMapReady(true);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
      markerRef.current = null;
    };
  }, []);

  // Update center when props change
  useEffect(() => {
    if (mapInstanceRef.current && markerRef.current) {
      mapInstanceRef.current.setView([latitude, longitude], 12);
      markerRef.current.setLatLng([latitude, longitude]);
      markerRef.current.setPopupContent(`<b>${locationName}</b><br/>Lat: ${latitude}, Lng: ${longitude}`);
    }
  }, [latitude, longitude, locationName]);

  return (
    <div className="bg-white border-2 border-orange-200 rounded-xl overflow-hidden shadow-md">
      {/* Map Control Bar */}
      <div className="p-3 bg-gradient-to-r from-orange-50 to-amber-50 border-b border-orange-200 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-orange-500 text-white rounded-lg">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-bold text-orange-800 uppercase tracking-wider">OpenStreetMap Real-time Integration</span>
            <p className="text-sm font-semibold text-slate-800 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-orange-600" />
              {locationName}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono bg-white px-2.5 py-1 border border-orange-300 rounded text-slate-700 font-semibold shadow-xs">
            GPS: {latitude.toFixed(4)}°, {longitude.toFixed(4)}°
          </span>
          {onVerify && (
            <button
              id="verify-osm-location-btn"
              onClick={onVerify}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-all shadow-xs ${
                isVerified
                  ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                  : 'bg-orange-500 hover:bg-orange-600 text-white'
              }`}
            >
              {isVerified ? (
                <>
                  <CheckCircle className="w-3.5 h-3.5" /> Verified on OpenStreetMap
                </>
              ) : (
                <>
                  <Navigation className="w-3.5 h-3.5" /> Verify Location on Map
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Preset Reserve Selector */}
      <div className="px-3 py-2 bg-orange-50/50 border-b border-orange-100 flex items-center gap-2 overflow-x-auto text-xs">
        <span className="text-slate-600 font-medium shrink-0">Quick Forest Presets:</span>
        {forestPresets.map((preset) => (
          <button
            key={preset.name}
            onClick={() => onLocationChange && onLocationChange(preset.lat, preset.lng, preset.name)}
            className={`shrink-0 px-2.5 py-1 rounded-md border text-xs transition-colors ${
              locationName === preset.name
                ? 'bg-orange-500 text-white border-orange-600 font-bold'
                : 'bg-white text-slate-700 border-orange-200 hover:border-orange-400'
            }`}
          >
            {preset.name.split(' (')[0]}
          </button>
        ))}
      </div>

      {/* Leaflet OSM Container */}
      <div
        ref={mapContainerRef}
        className="w-full h-64 sm:h-80 z-0 bg-slate-100 relative"
      />

      <div className="px-3 py-1.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
        <span>© OpenStreetMap contributors | Leaflet Engine</span>
        <span>Click anywhere on the map or drag the saffron pin to calibrate coordinate telemetry</span>
      </div>
    </div>
  );
};
