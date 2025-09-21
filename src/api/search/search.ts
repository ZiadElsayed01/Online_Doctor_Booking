import type { IDoctorDetails } from '@/types';

// Function to fetch coordinates from address
export const fetchCoordinates = async (address: string) => {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        address
      )}`
    );
    const data = await res.json();
    if (data.length > 0) {
      return {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon),
      };
    }
    return null;
  } catch (error) {
    console.error('Error fetching coordinates:', error);
    return null;
  }
};

// Function to load Leaflet CSS and JS
export const loadLeafletAssets = (): Promise<void> => {
  return new Promise((resolve) => {
    // Check if Leaflet is already loaded
    if ((window as any).L) {
      resolve();
      return;
    }

    // CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.7.1/dist/leaflet.css';
    link.crossOrigin = '';
    document.head.appendChild(link);

    // JS
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.7.1/dist/leaflet.js';
    script.crossOrigin = '';
    script.onload = () => resolve();
    document.body.appendChild(script);
  });
};

// Function to initialize the map
export const initializeMap = async (
  doctors: IDoctorDetails[],
  onMarkerClick: (doctor: IDoctorDetails & { lat: number; lng: number }) => void
): Promise<L.Map | null> => {
  try {

    await loadLeafletAssets();
    
    const L = (window as any).L;
    if (!L) return null;

    // Create map
    const map = L.map('map').setView([30.0444, 31.2357], 12);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(map);

    const doctorIcon = L.icon({
      iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });

    
    for (const doctor of doctors) {
      let coords = { lat: doctor.lat ?? 0, lng: doctor.lng ?? 0 };

    
      if (!doctor.lat || !doctor.lng) {
        const fetched = await fetchCoordinates(doctor.address ?? '');
        if (fetched) coords = fetched;
      }


      if (coords.lat && coords.lng) {
        L.marker([coords.lat, coords.lng], { icon: doctorIcon })
          .addTo(map)
          .on('click', () => {
            onMarkerClick({ ...doctor, ...coords });
            map.setView([coords.lat!, coords.lng!], 15);
          });
      }
    }

    return map;
  } catch (error) {
    console.error('Error initializing map:', error);
    return null;
  }
};


export const updateMapView = async (
  map: L.Map | null,
  doctor: IDoctorDetails
): Promise<{ lat?: number; lng?: number }> => {
  if (!map) return {};

  let coords = { lat: doctor.lat, lng: doctor.lng };

  if (!coords.lat || !coords.lng) {
    const fetched = await fetchCoordinates(
      doctor.address ? doctor.address : 'El Nasr Hospital, Cairo'
    );
    if (fetched) coords = fetched;
  }

  if (coords.lat && coords.lng) {
    map.setView([coords.lat, coords.lng], 15);
  }

  return coords;
};