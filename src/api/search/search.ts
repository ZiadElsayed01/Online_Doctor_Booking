import type { IDoctorDetails } from '@/types';

// Function to fetch coordinates from address
export const fetchCoordinates = async (address: string) => {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        address+" egypt"
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

// Function to fetch hospitals in a city
export const fetchHospitals = async (city: string) => {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=hospital ${encodeURIComponent(
        city
      )}&limit=5`
    );
    const data = await res.json();
    return data.map((item: any) => ({
      name: item.display_name,
      lat: parseFloat(item.lat),
      lng: parseFloat(item.lon),
    }));
  } catch (error) {
    console.error('Error fetching hospitals:', error);
    return [];
  }
};

// Function to load Leaflet CSS and JS
export const loadLeafletAssets = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if ((window as any).L) {
      resolve();
      return;
    }

    // CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.7.1/dist/leaflet.css';
    link.crossOrigin = '';
    link.onerror = () => reject(new Error('Failed to load Leaflet CSS'));
    document.head.appendChild(link);

    // JS
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.7.1/dist/leaflet.js';
    script.crossOrigin = '';
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Leaflet JS'));
    document.body.appendChild(script);
  });
};

// Function to initialize the map
export const initializeMap = async (
  doctors: IDoctorDetails[],
  onMarkerClick: (doctor: IDoctorDetails & { lat: number; lng: number }) => void
): Promise<any | null> => {
  try {
    await loadLeafletAssets();

    const L = (window as any).L;
    if (!L) {
      console.error('Leaflet not loaded');
      return null;
    }

    // Check if map container exists
    const mapContainer = document.getElementById('map');
    if (!mapContainer) {
      console.error('Map container not found');
      return null;
    }

    // Check if map already initialized
    
    // Create map
    const map = L.map('map').setView([30.0444, 31.2357], 10);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(map);

    // Doctor icon
    const doctorIcon = L.icon({
      iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });

    // Hospital icon
    const hospitalIcon = L.icon({
      iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
      iconSize: [30, 30],
      iconAnchor: [15, 30],
      popupAnchor: [0, -30],
    });

    const bounds = L.latLngBounds();
    let hasValidMarkers = false;

    // Process doctors sequentially to avoid rate limiting
    for (const doctor of doctors) {
      let coords = { lat: doctor.lat ?? 0, lng: doctor.lng ?? 0 };

      // Fetch doctor coords if not provided
      if (!doctor.lat || !doctor.lng) {
        if (doctor.address) {
          const fetched = await fetchCoordinates(doctor.address);
          if (fetched) coords = fetched;
        }
      }

      if (coords.lat && coords.lng && coords.lat !== 0 && coords.lng !== 0) {
        // Doctor marker
        const doctorMarker = L.marker([coords.lat, coords.lng], { icon: doctorIcon })
          .addTo(map)
          .on('click', () => {
            onMarkerClick({ ...doctor, ...coords });
            map.setView([coords.lat, coords.lng], 15);
          });

        doctorMarker.bindPopup(`<b>دكتور: ${doctor.name}</b><br>${doctor.address ?? ''}`);
        bounds.extend([coords.lat, coords.lng]);
        hasValidMarkers = true;

        // Fetch hospitals for this doctor's city (with delay to avoid rate limiting)
        if (doctor.hospital_city) {
          setTimeout(async () => {
            const hospitals = await fetchHospitals(doctor.hospital_city);
            hospitals.forEach((hospital: any) => {
              L.marker([hospital.lat, hospital.lng], { icon: hospitalIcon })
                .addTo(map)
                .bindPopup(`<b>مستشفى</b><br>${hospital.name}`);
              bounds.extend([hospital.lat, hospital.lng]);
            });
            
            if (hasValidMarkers && bounds.isValid()) {
              map.fitBounds(bounds, { padding: [20, 20] });
            }
          }, 1000 * doctors.indexOf(doctor)); // Stagger requests
        }
      }
    }

    // Fit bounds after all markers are added
    if (hasValidMarkers && bounds.isValid()) {
      setTimeout(() => {
        map.fitBounds(bounds, { padding: [20, 20] });
      }, 2000);
    } else {
      // Default view if no valid markers
      map.setView([30.0444, 31.2357], 10);
    }

    return map;
  } catch (error) {
    console.error('Error initializing map:', error);
    return null;
  }
};

// Update map view for selected doctor
export const updateMapView = async (
  map: any,
  doctor: IDoctorDetails
): Promise<{ lat?: number; lng?: number }> => {
  if (!map) return {};

  let coords = { lat: doctor.lat, lng: doctor.lng };

  if (!coords.lat || !coords.lng) {
    const address = doctor.address || doctor.hospital_city || 'Cairo';
    const fetched = await fetchCoordinates(address);
    if (fetched) coords = fetched;
  }

  if (coords.lat && coords.lng) {
    map.setView([coords.lat, coords.lng], 15);
    
    // Open popup for this doctor
    map.eachLayer((layer: any) => {
      if (layer instanceof (window as any).L.Marker) {
        const latLng = layer.getLatLng();
        if (latLng.lat === coords.lat && latLng.lng === coords.lng) {
          layer.openPopup();
        }
      }
    });
  }

  return coords;
};

// Cleanup function to remove map
export const cleanupMap = (map: any) => {
  if (map) {
    map.remove();
  }
};