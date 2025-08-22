import React, { useEffect, useRef, useState } from 'react';
import { MapPin, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

const Map = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const [mapboxToken, setMapboxToken] = useState('');
  const [showTokenInput, setShowTokenInput] = useState(false);
  const [mapInitialized, setMapInitialized] = useState(false);

  // TreePod location coordinates - Valle Las Trancas
  const treepodLocation = {
    lng: -71.4826,
    lat: -36.9059
  };

  const initializeMap = async (token: string) => {
    if (!mapContainer.current || !token) return;

    try {
      // Dynamically import mapbox-gl
      const mapboxgl = await import('mapbox-gl');
      await import('mapbox-gl/dist/mapbox-gl.css');

      mapboxgl.default.accessToken = token;
      
      const map = new mapboxgl.default.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/outdoors-v12',
        center: [treepodLocation.lng, treepodLocation.lat],
        zoom: 13,
        pitch: 45,
      });

      // Add navigation controls
      map.addControl(
        new mapboxgl.default.NavigationControl({
          visualizePitch: true,
        }),
        'top-right'
      );

      // Add marker for TreePod location
      const marker = new mapboxgl.default.Marker({
        color: '#059669', // Verde TreePod
        scale: 1.2
      })
        .setLngLat([treepodLocation.lng, treepodLocation.lat])
        .setPopup(
          new mapboxgl.default.Popup({ offset: 25 })
            .setHTML('<div style="padding: 10px; text-align: center;"><h3 style="margin: 0 0 5px 0; color: #059669;">TreePod Glamping</h3><p style="margin: 0; font-size: 14px;">Valle Las Trancas, Ñuble</p></div>')
        )
        .addTo(map);

      // Show popup by default
      marker.getPopup().addTo(map);

      setMapInitialized(true);
      setShowTokenInput(false);

    } catch (error) {
      console.error('Error initializing map:', error);
    }
  };

  const handleTokenSubmit = () => {
    if (mapboxToken.trim()) {
      localStorage.setItem('mapbox_token', mapboxToken.trim());
      initializeMap(mapboxToken.trim());
    }
  };

  useEffect(() => {
    // Check if we have a stored token
    const storedToken = localStorage.getItem('mapbox_token');
    if (storedToken) {
      setMapboxToken(storedToken);
      initializeMap(storedToken);
    } else {
      setShowTokenInput(true);
    }
  }, []);

  if (showTokenInput) {
    return (
      <div className="relative w-full h-[400px] bg-gray-100 rounded-lg overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center p-6">
          <Card className="w-full max-w-md p-6 text-center">
            <MapPin className="w-12 h-12 mx-auto mb-4 text-primary" />
            <h3 className="text-lg font-semibold mb-2">Configurar Mapa</h3>
            <p className="text-gray-600 mb-4 text-sm">
              Para mostrar el mapa interactivo, necesitas un token público de Mapbox.
            </p>
            <div className="space-y-3">
              <Input
                type="text"
                placeholder="Pega tu token público de Mapbox aquí"
                value={mapboxToken}
                onChange={(e) => setMapboxToken(e.target.value)}
              />
              <Button 
                onClick={handleTokenSubmit}
                disabled={!mapboxToken.trim()}
                className="w-full"
              >
                Inicializar Mapa
              </Button>
              <p className="text-xs text-gray-500">
                Obtén tu token en{' '}
                <a 
                  href="https://mapbox.com/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  mapbox.com
                </a>
              </p>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[400px] bg-gray-100 rounded-lg overflow-hidden">
      {!mapInitialized && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
            <p className="text-gray-600">Cargando mapa...</p>
          </div>
        </div>
      )}
      <div ref={mapContainer} className="absolute inset-0" />
      
      {/* Reset button */}
      {mapInitialized && (
        <div className="absolute top-4 left-4">
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              localStorage.removeItem('mapbox_token');
              setShowTokenInput(true);
              setMapInitialized(false);
              setMapboxToken('');
            }}
            className="bg-white/90 backdrop-blur-sm"
          >
            <AlertCircle className="w-4 h-4 mr-1" />
            Cambiar Token
          </Button>
        </div>
      )}
    </div>
  );
};

export default Map;