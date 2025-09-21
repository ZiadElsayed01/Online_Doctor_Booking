import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { formatDate } from "date-fns";

import ScheduleLabel from "@/components/common/ScheduleLabel";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { getInitials } from "@/lib/utils";
import type { ISpeciality, IAppointment } from "@/types";
import doctorPlaceholderImg from "@/assets/images/doctorPhoto.jpg";
import { Pin } from "lucide-react";
import { getSpeciality } from "@/api/specialities/specialities";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

type AppointmentCardProps = {
    appointment: IAppointment;
};

function AppointmentCard({ appointment }: AppointmentCardProps) {
    const { date, time, doctor, status } = appointment;
    const [speciality, setSpeciality] = useState<ISpeciality | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchSpeciality() {
            try {
                setIsLoading(true);
                const res = await getSpeciality(doctor.specialist_id);
                setSpeciality(res.data);
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        }

        fetchSpeciality();
    }, []);

    return (
        <Card className="w-full max-w-sm gap-2">
            <CardHeader>
                <CardTitle className="flex items-center justify-between gap-2">
                    <ScheduleLabel
                        iconStyle="text-secondary-300"
                        textStyle="text-secondary-300 font-normal text-xs"
                    >
                        {formatDate(date, "EEEE, MMMM dd")} - {time}
                    </ScheduleLabel>
                    <p className="text-sm font-normal">{status}</p>
                </CardTitle>
            </CardHeader>

            <hr />

            <CardContent>
                <div className="flex items-center gap-2">
                    <Avatar className="w-14 h-14 border-1 border-secondary-200">
                        <AvatarImage
                            src={doctor.profile_image || doctorPlaceholderImg}
                            alt={doctor.name + "'s image"}
                            className="object-cover"
                        />
                        <AvatarFallback>
                            {getInitials(doctor.name)}
                        </AvatarFallback>
                    </Avatar>

                    <div>
                        <h2 className="text-primary-200 font-medium text-base">
                            {doctor.name}
                        </h2>
                        {isLoading ? (
                            <p>Loading...</p>
                        ) : !speciality ? null : (
                            <p className="text-secondary-400 text-base">
                                {speciality.name_en}
                            </p>
                        )}
                    </div>
                </div>
                <div className="flex items-center gap-1 text-sm mt-2">
                    <Pin className="text-secondary-300" size={18} />
                    <span className="text-secondary-400">hospital 57375</span>
                </div>
            </CardContent>

            <CardFooter className="flex items-center gap-4 mt-2">
                <Button variant="outline" className="flex-1">
                    Cancel
                </Button>
                <Button
                    className="flex-1"
                    onClick={() => navigate(`/doctors/${doctor.id}`)}
                >
                    Reschedule
                </Button>
            </CardFooter>
        </Card>
    );
}

export default AppointmentCard;
