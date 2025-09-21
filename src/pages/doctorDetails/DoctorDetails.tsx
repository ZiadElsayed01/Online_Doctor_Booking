import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

import DoctorHeader from "./components/DoctorHeader";
import DoctorStats from "./components/DoctorStats";
import AboutDoctor from "./components/AboutDoctor";
import DoctorReviews from "./components/DoctorReviews";
import { getAvailableSlots, getDoctorDetails } from "@/api/doctors/doctors";
import { Loader } from "@/components/common/Loader";
import PageHeader from "@/pages/doctorDetails/components/PageHeader";
import Appointment from "./components/Appointment";
import DoctorLocation from "./components/DoctorLocation";
import type { IAppointmentSlot } from "@/types";
import AlertMsg from "@/components/common/AlertMsg";

function DoctorDetails() {
    const [availableSlots, setAvailableSlots] = useState<IAppointmentSlot[]>(
        []
    );
    const [doctorDetails, setDoctorDetails] = useState<any | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const { doctorId } = useParams();

    useEffect(() => {
        async function fetchDoctorData() {
            try {
                if (!doctorId) return setError("Doctor Id is required");
                setIsLoading(true);

                const doctorDetailsRes = await getDoctorDetails(doctorId);
                setDoctorDetails(doctorDetailsRes.data);

                const availableSlotsRes = await getAvailableSlots(doctorId);
                setAvailableSlots(availableSlotsRes.available_slots);
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        }

        fetchDoctorData();
    }, []);

    if (isLoading) return <Loader className="mx-auto mt-40" size="xl" />;
    if (error || !doctorDetails)
        return (
            <AlertMsg
                message={
                    error || "Something went wrong cannot get doctor details."
                }
                className="mx-auto mt-40 flex flex-col items-center gap-4 text-3xl"
            />
        );

    return (
        <>
            <div className="grid lg:grid-cols-5 grid-cols-1 gap-8">
                {/* START DOCTOR DETAILS SECTION */}
                <PageHeader
                    title="Doctor Details"
                    className="lg:hidden"
                    doctorId={doctorDetails.doctor_profile_id}
                />
                <div className="lg:col-span-2 lg:col-start-4 bg-secondary-100 rounded-xl px-2 sm:px-8 py-8">
                    <DoctorHeader
                        doctorName={doctorDetails.name}
                        speciality={doctorDetails.specialty_name_en}
                        className="sm:flex-col sm:items-center sm:text-center"
                    />
                    <DoctorStats
                        experienceYears={doctorDetails.experience_years}
                        reviewsCount={doctorDetails.reviews_count}
                        rating={doctorDetails.average_rating}
                    />
                    <AboutDoctor about={doctorDetails?.about} />
                    <DoctorLocation
                        location={`hospital ${doctorDetails.hospital_name}`}
                    />
                </div>
                {/* END DOCTOR DETAILS SECTION */}

                <div className="lg:col-span-3 lg:row-start-1 ">
                    <PageHeader
                        title="Make an appointment"
                        className="hidden lg:flex mb-8"
                        doctorId={doctorDetails.doctor_profile_id}
                    />
                    <h2 className="font-medium text-lg mb-4 lg:hidden">
                        Make an appointment
                    </h2>
                    {/* START BOOKING AN APPOINTMENT SECTION */}
                    <Appointment
                        availableSlots={availableSlots}
                        doctorDetails={doctorDetails}
                    />
                    {/* END BOOKING AN APPOINTMENT SECTION */}

                    {/* START DOCTOR REVIEWS SECTION */}
                    <DoctorReviews
                        reviewsCount={doctorDetails.reviews_count}
                        rating={doctorDetails.average_rating}
                        doctorId={doctorDetails.doctor_profile_id}
                    />
                    {/* END DOCTOR REVIEWS SECTION */}
                </div>
            </div>
        </>
    );
}

export default DoctorDetails;
