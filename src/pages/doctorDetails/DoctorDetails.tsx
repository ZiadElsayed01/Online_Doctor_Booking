import {
    useLoaderData,
    useNavigation,
    type LoaderFunctionArgs,
} from "react-router-dom";

import DoctorHeader from "./components/DoctorHeader";
import DoctorStats from "./components/DoctorStats";
import AboutDoctor from "./components/AboutDoctor";
import DoctorReviews from "./components/DoctorReviews";
import { getAvailableSlots, getDoctorDetails } from "@/api/doctors/doctors";
import { Loader } from "@/components/common/Loader";
import PageHeader from "@/pages/doctorDetails/components/PageHeader";
import Appointment from "./components/Appointment";
import DoctorLocation from "./components/DoctorLocation";

function DoctorDetails() {
    const { doctorDetails, availableSlots } = useLoaderData();
    const navigation = useNavigation();
    const isLoading = navigation.state === "loading";

    return (
        <>
            {isLoading ? (
                <Loader className="mx-auto mt-40" size="xl" />
            ) : (
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
            )}
        </>
    );
}

export async function loader({ params }: LoaderFunctionArgs) {
    const token = localStorage.getItem("token");
    if (!token) return;

    const { doctorId } = params;

    if (!doctorId) throw new Response("Doctor Id is required", { status: 400 });

    const doctorDetails = await getDoctorDetails(doctorId);
    const availableSlots = await getAvailableSlots(doctorId);

    return {
        doctorDetails: doctorDetails.data,
        availableSlots: availableSlots.available_slots,
    };
}

export default DoctorDetails;
