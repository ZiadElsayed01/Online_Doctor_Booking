import { Star, Clock, Heart } from "lucide-react";
import type { IDoctorDetails } from "../../types";
import doctorPhoto from "../../assets/images/doctorPhoto.jpg";
import { Link } from "react-router-dom";
import { useState } from "react";

type DoctorCardProps = {
  doctor: IDoctorDetails;
  isFavourite: boolean;
  onToggleFavourite?: (id: number) => void;
};

export const formatTime = (time: string) => {
  const [hours, minutes] = time?.split(":")?.map(Number) ?? [];
  const suffix = hours >= 12 ? "PM" : "AM";
  const formattedHours = ((hours + 11) % 12) + 1; // يحول 13 → 1
  return `${formattedHours}:${minutes?.toString()?.padStart(2, "0")} ${suffix}`;
};

function CardDoctor({
  doctor,
  isFavourite,
  onToggleFavourite,
}: DoctorCardProps) {
  const [toggleHeart, setToggleHeart] = useState(isFavourite);
  return (
    <>
      <div className="border border-gray-300 p-4 rounded-lg text-xs lg:text-base">
        <div className="flex items-start gap-4 mb-2">
          <img
            src={doctorPhoto}
            alt={doctor.name}
            className="w-[97px] h-[88px] rounded-[10px] bg-gray-200 flex-shrink-0 object-cover"
          />
          <div className="flex-1 min-w-0">
            <div className="flex justify-between">
              <div>
                <h3 className="font-medium text-gray-900">{doctor.name}</h3>
                <p className="text-sm text-gray-600 my-2">
                  {doctor.specialty_name_en} | {doctor.hospital_name}
                </p>
              </div>
              {/* hidden if router is /  */}
              {location.pathname !== "/" && (
                <button
                  type="button"
                  title="Heart"
                  onClick={(e) => {
                    e.preventDefault();
                    onToggleFavourite?.(doctor.doctor_profile_id);
                    setToggleHeart((prev) => !prev);
                  }}
                >
                  <Heart
                    size={30}
                    className={`${
                      toggleHeart
                        ? "fill-red-500 text-red-500"
                        : "text-gray-600"
                    } cursor-pointer`}
                  />
                </button>
              )}
            </div>

            <div className="flex flex-col sm:flex-row text-xs gap-2 sm:items-center">
              <div className="flex items-center gap-1">
                <Star size={14} className="fill-yellow-400 text-yellow-400" />
                <span className="font-medium">
                  {Number(doctor.average_rating).toFixed(1)}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Clock size={16} className="text-gray-400" />
                <span className="font-medium">
                  <span>
                    {formatTime(doctor.availability[0].start_time)} -{" "}
                    {formatTime(doctor.availability[0].end_time)}
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mb-2">
          <span className="text-md font-medium text-black">
            Price
            <span className="text-sm text-gray-400">/hour</span>
          </span>
          <span className="text-md font-semibold text-orange-500">
            ${doctor.price_per_hour}
          </span>
        </div>

        <Link to={`/doctors/${doctor.user_id}`} key={doctor.doctor_profile_id}>
          <button
            type="button"
            className="w-full text-white cursor-pointer bg-primary py-2 px-4 rounded-lg hover:bg-primary/80 transition-colors font-medium"
          >
            Book appointment
          </button>
        </Link>
      </div>
    </>
  );
}

export default CardDoctor;
