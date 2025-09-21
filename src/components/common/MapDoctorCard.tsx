import { Clock, Star } from "lucide-react";
import imageDo from "../../assets/images/doctorPhoto.jpg";
import type { IDoctorDetails } from "@/types";

interface MapDoctorCardProps {
    doctor: IDoctorDetails;
    isSelected: boolean;
    onSelect: (doctor: IDoctorDetails) => void;
}

const MapDoctorCard = ({
    doctor,
    isSelected,
    onSelect,
}: MapDoctorCardProps) => {
    return (
        <div
            className={`flex items-center p-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                isSelected ? "bg-blue-50 border-blue-300" : ""
            }`}
            onClick={() => onSelect(doctor)}
        >
            <div className="w-14 h-14 rounded-lg overflow-hidden mr-3 bg-gray-200 flex-shrink-0">
                <img
                    src={imageDo}
                    alt={doctor.name}
                    className="w-full h-full object-cover"
                />
            </div>
            <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 text-sm">
                    {doctor.name}
                </h3>
                <p className="text-gray-600 text-xs truncate">
                    {doctor.specialty_name_en}
                </p>
                <div className="flex items-center mt-1 space-x-3">
                    <div className="flex items-center">
                        <Star className="w-3 h-3 text-yellow-400 fill-current mr-1" />
                        <span className="text-xs font-medium text-gray-700">
                            {Number(doctor.average_rating).toFixed(1)}
                        </span>
                    </div>
                    <div className="flex items-center text-gray-500">
                        <Clock className="w-3 h-3 mr-1" />
                        <span className="text-xs">{doctor.price_per_hour}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MapDoctorCard;
