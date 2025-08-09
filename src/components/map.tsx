'use client';

import { useEffect, useRef } from 'react';

interface MapProps {
  center: [number, number];
  markers: Array<{
    position: [number, number];
    popup?: string;
  }>;
}

export default function Map({ center, markers }: MapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const isInitializedRef = useRef(false);

  useEffect(() => {
    let isMounted = true;

    // Dynamically import Leaflet to avoid SSR issues
    const initMap = async () => {
      // Skip if already initialized or no container
      if (isInitializedRef.current || !mapRef.current) return;

      const L = await import('leaflet');
      await import('leaflet/dist/leaflet.css');

      // Check if component is still mounted and not already initialized
      if (!isMounted || !mapRef.current || isInitializedRef.current) return;

      try {
        // Fix Leaflet marker icons
        delete (L.Icon.Default.prototype as any)._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
          iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        });

        // Create map instance
        const map = L.map(mapRef.current, {
          center: center,
          zoom: 13
        });
        
        mapInstanceRef.current = map;
        isInitializedRef.current = true;

        // Add OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution: '© OpenStreetMap contributors'
        }).addTo(map);

        // Add markers
        markers.forEach(marker => {
          const m = L.marker(marker.position).addTo(map);
          if (marker.popup) {
            m.bindPopup(marker.popup);
          }
        });
      } catch (error) {
        console.error('Error initializing map:', error);
      }
    };

    initMap();

    // Cleanup function
    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        isInitializedRef.current = false;
      }
    };
  }, []); // Empty dependency array since we handle updates separately

  // Handle updates to center and markers
  useEffect(() => {
    if (!mapInstanceRef.current || !isInitializedRef.current) return;

    // Update center
    mapInstanceRef.current.setView(center, 13);

    // Clear existing markers
    mapInstanceRef.current.eachLayer((layer: any) => {
      if (layer instanceof L.Marker) {
        layer.remove();
      }
    });

    // Add new markers
    markers.forEach(marker => {
      const m = L.marker(marker.position).addTo(mapInstanceRef.current);
      if (marker.popup) {
        m.bindPopup(marker.popup);
      }
    });
  }, [center, markers]);

  return <div ref={mapRef} className="w-full h-[400px] rounded-lg" />;
}