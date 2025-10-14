'use client';

import { useEffect, useRef } from 'react';

interface Area {
  name: string;
  coordinates: [number, number];
  total: number;
  stunting: number;
  children: any[];
  description?: string;
  href?: string | null;
}

interface DistributionMapProps {
  areas: Area[];
}

export default function DistributionMap({ areas }: DistributionMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  useEffect(() => {
    if (!mapRef.current || areas.length === 0) return;

    let mapInstance: any = null;

    const initMap = async () => {
      try {
        const L = await import('leaflet');
        // Import CSS from CDN instead since module import isn't working
        const leafletStyles = document.createElement('link');
        leafletStyles.rel = 'stylesheet';
        leafletStyles.href = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/leaflet.css';
        document.head.appendChild(leafletStyles);

        // Fix Leaflet marker icons
        delete (L.Icon.Default.prototype as any)._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
          iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        });

        // Calculate center point
        const centerLat = areas.reduce((sum, area) => sum + area.coordinates[0], 0) / areas.length;
        const centerLng = areas.reduce((sum, area) => sum + area.coordinates[1], 0) / areas.length;

        // Clean up existing map instance before creating new one
        if (mapInstanceRef.current) {
          mapInstanceRef.current.remove();
          mapInstanceRef.current = null;
        }

        // Clear the map container's innerHTML to ensure clean state
        if (mapRef.current) {
          mapRef.current.innerHTML = '';
        }

        // Create map instance
        mapInstance = L.map(mapRef.current!).setView([centerLat, centerLng], 10);
        mapInstanceRef.current = mapInstance;

        // Add OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution: '© OpenStreetMap contributors'
        }).addTo(mapInstance);

        // Create custom markers for different risk levels
        const createCustomIcon = (color: string) => {
          return L.divIcon({
            className: 'custom-marker',
            html: `<div style="
              background-color: ${color};
              width: 20px;
              height: 20px;
              border-radius: 50%;
              border: 3px solid white;
              box-shadow: 0 2px 4px rgba(0,0,0,0.3);
            "></div>`,
            iconSize: [20, 20],
            iconAnchor: [10, 10],
          });
        };

        // Add markers for each area
        areas.forEach(area => {
          const stuntingRate = (area.stunting / area.total) * 100;
          let color = '#10B981'; // Green for low risk
          
          if (stuntingRate > 30) {
            color = '#EF4444'; // Red for high risk
          } else if (stuntingRate > 10) {
            color = '#F59E0B'; // Yellow for medium risk
          }

          const marker = L.marker(area.coordinates, {
            icon: createCustomIcon(color)
          }).addTo(mapInstance);

          const popupContent = `
            <div style="min-width: 250px;">
              <h3 style="margin: 0 0 8px 0; font-weight: bold;">${area.name}</h3>
              <p style="margin: 4px 0;"><strong>Total Children:</strong> ${area.total}</p>
              <p style="margin: 4px 0;"><strong>Stunting Cases:</strong> ${area.stunting}</p>
              <p style="margin: 4px 0;"><strong>Stunting Rate:</strong> ${stuntingRate.toFixed(1)}%</p>
              ${area.description ? `<p style="margin: 4px 0; font-style: italic; color: #666;">${area.description}</p>` : ''}
              <div style="margin-top: 8px; padding: 4px; border-radius: 4px; background-color: ${color}20; color: ${color}; font-size: 12px;">
                ${stuntingRate > 30 ? '🔴 High Risk Area' : 
                  stuntingRate > 10 ? '🟡 Medium Risk Area' : '🟢 Low Risk Area'}
              </div>
              ${area.href ? `<div style="margin-top: 8px;"><a href="${area.href}" style="display: inline-block; padding: 6px 12px; background-color: #3B82F6; color: white; text-decoration: none; border-radius: 4px; font-size: 12px; font-weight: 500;">View Details</a></div>` : ''}
            </div>
          `;

          marker.bindPopup(popupContent);
        });
        // Add legend
        const legend = new L.Control({ position: 'bottomright' });
        legend.onAdd = function() {
          const div = L.DomUtil.create('div', 'info legend');
          div.style.backgroundColor = 'white';
          div.style.padding = '10px';
          div.style.borderRadius = '5px';
          div.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';
          div.innerHTML = `
            <h4 style="margin: 0 0 8px 0; font-size: 14px; color: #111827; font-weight: bold;">Risk Levels</h4>
            <div style="display: flex; align-items: center; margin: 4px 0;">
              <div style="width: 12px; height: 12px; border-radius: 50%; background-color: #EF4444; margin-right: 8px;"></div>
              <span style="font-size: 12px; color: #374151; font-weight: 500;">High Risk (>30%)</span>
            </div>
            <div style="display: flex; align-items: center; margin: 4px 0;">
              <div style="width: 12px; height: 12px; border-radius: 50%; background-color: #F59E0B; margin-right: 8px;"></div>
              <span style="font-size: 12px; color: #374151; font-weight: 500;">Medium Risk (10-30%)</span>
            </div>
            <div style="display: flex; align-items: center; margin: 4px 0;">
              <div style="width: 12px; height: 12px; border-radius: 50%; background-color: #10B981; margin-right: 8px;"></div>
              <span style="font-size: 12px; color: #374151; font-weight: 500;">Low Risk (<10%)</span>
            </div>
          `;
          return div;
        };
        legend.addTo(mapInstance);
      } catch (error) {
        console.error('Error initializing map:', error);
      }
    };

    initMap();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [areas]);

  return <div ref={mapRef} className="w-full h-[600px] rounded-lg" />;
} 