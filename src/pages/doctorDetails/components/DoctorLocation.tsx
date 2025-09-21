import { MapContainer, Marker, TileLayer } from "react-leaflet";
import L from "leaflet";
import { Pin } from "lucide-react";
import "leaflet/dist/leaflet.css";
import pinIcon from "@/assets/images/marker-with-dot.png";

const customIcon = L.icon({
  iconUrl: pinIcon,
  iconSize: [30, 40],
  iconAnchor: [12, 41],
});

type DoctorLocationProps = {
  location: string;
};

function DoctorLocation({ location }: DoctorLocationProps) {
  return (
    <section className="mt-8">
      <h2 className="font-medium text-lg mb-2">Location</h2>

      <div className="relative w-full h-60 overflow-hidden rounded-2xl z-10">
        <MapContainer
          center={[30.022715, 31.23787]}
          zoom={13}
          zoomControl={false}
          scrollWheelZoom={false}
          className="w-full h-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={[30.022715, 31.23787]} icon={customIcon} />
        </MapContainer>

        <div className="absolute left-3 bottom-3 bg-white flex items-center gap-2 px-4 py-2 rounded-md shadow-md z-[999] text-sm">
          <Pin className="text-primary-100" size={20} />
          <span>{location}</span>
        </div>
      </div>
    </section>
  );
}

export default DoctorLocation;
