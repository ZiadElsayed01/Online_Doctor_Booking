import {
    useLoaderData,
    useNavigation,
    useSearchParams,
    type LoaderFunctionArgs,
} from "react-router-dom";
import { useState } from "react";
import { isSameDay } from "date-fns";

import { getUserAppointments } from "@/api/appointments/appointments";
import AppointmentCard from "./components/AppointmentCard";
import type { IAppointment } from "@/types";
import AppointmentFilterTabs from "./components/AppointmentFilterTabs";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Loader } from "@/components/common/Loader";
import AppointmentCalender from "./components/AppointmentCalender";
import NoData from "@/components/common/NoData";

function Appointments() {
    const [dates, setDates] = useState<Date[] | undefined>(undefined);

    const { userAppointmentsRes } = useLoaderData();
    const userAppointments = userAppointmentsRes.appointments;
    const filterdAppointments =
        dates && dates.length > 0
            ? userAppointments.filter((appointment: IAppointment) =>
                  dates?.some((date) =>
                      isSameDay(new Date(appointment.date), new Date(date))
                  )
              )
            : userAppointments;

    const [searchParams, setSearchParams] = useSearchParams();
    const filterBy = searchParams.get("filter");

    const navigation = useNavigation();
    const isLoading = navigation.state === "loading";

    return (
        <div className="relative">
            <div className="flex items-center justify-between">
                <h1 className="font-medium text-base sm:text-lg mb-4">
                    Your appointments
                </h1>
                <AppointmentCalender dates={dates} setDates={setDates} />
            </div>

            <Tabs
                defaultValue={filterBy || "all"}
                onValueChange={(value) => setSearchParams(`?filter=${value}`)}
            >
                <AppointmentFilterTabs />

                {isLoading ? (
                    <Loader className="mt-40 mx-auto" size="xl" />
                ) : filterdAppointments.length === 0 ? (
                    <NoData />
                ) : (
                    <TabsContent
                        value={filterBy || "all"}
                        className="flex flex-wrap items-center gap-6 justify-center xl:justify-start"
                    >
                        {filterdAppointments.map(
                            (appointment: IAppointment) => (
                                <AppointmentCard
                                    appointment={appointment}
                                    key={appointment.id}
                                />
                            )
                        )}
                    </TabsContent>
                )}
            </Tabs>
        </div>
    );
}

export async function loader({ request }: LoaderFunctionArgs) {
    const token = localStorage.getItem("token");
    if (!token) return;
    const url = new URL(request.url);
    const filterBy = url.searchParams.get("filter");
    const userAppointmentsRes = await getUserAppointments(filterBy);

    return { userAppointmentsRes };
}

export default Appointments;
