import { BadgeCheck, Pin } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import doctorPlaceholderImg from "@/assets/images/doctorPhoto.jpg";

type DoctorHeaderProps = {
    doctorName: string;
    speciality: string;
    location?: string;
    className?: string;
};

function DoctorHeader({
    doctorName,
    speciality,
    location,
    className,
}: DoctorHeaderProps) {
    return (
        <section className={`flex items-center gap-x-3 gap-y-2 ${className}`}>
            <section className="relative">
                <Avatar className="w-24 h-24 shadow-[3px_3px_0px_0px] shadow-primary-100">
                    <AvatarImage
                        src={doctorPlaceholderImg}
                        className="object-cover"
                    />
                    <AvatarFallback>{getInitials(doctorName)}</AvatarFallback>
                </Avatar>
                <BadgeCheck className="fill-primary-100 text-[#ffffffc5] absolute bottom-0 right-0" />
            </section>

            <div className="flex flex-col gap-2">
                <h2 className="font-medium text-lg">Dr. {doctorName}</h2>
                <p className="text-secondary-400 font-normal text-sm">
                    {speciality}
                </p>
                {location && (
                    <div className="flex items-center gap-2 text-secondary-400 font-normal text-sm">
                        <Pin className="text-primary-100" size={20} />
                        <span>{location}</span>
                    </div>
                )}
            </div>
        </section>
    );
}

export default DoctorHeader;
