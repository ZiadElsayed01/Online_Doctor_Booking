import type { FormikProps } from "formik";

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import type { IAppointmentSlot, IAppointmentValues } from "@/types";
import { Calendar1Icon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import AlertMsg from "@/components/common/AlertMsg";

type AppointmentDateProps = {
    formik: FormikProps<IAppointmentValues>;
    availableSlots: IAppointmentSlot[];
};

function AppointmentDate({ formik, availableSlots }: AppointmentDateProps) {
    function handleDisableDate(date: Date) {
        const availableDate = availableSlots.find(
            (slot: IAppointmentSlot) =>
                new Date(slot.date).toDateString() === date.toDateString()
        );
        return !availableDate;
    }

    return (
        <>
            <Accordion type="single" collapsible>
                <AccordionItem value="item-1">
                    <div className="flex justify-between items-center gap-1">
                        <label
                            htmlFor="date"
                            className="text-secondary-400 text-sm sm:text-base"
                        >
                            Choose date and time
                        </label>
                        <div className="flex items-center gap-1">
                            <Calendar1Icon className="text-primary-200" />
                            <AccordionTrigger
                                id="date"
                                className="flex items-center justify-start font-normal cursor-pointer border-primary-100 gap-1 text-primary-200"
                            >
                                {formik.values.date
                                    ? new Date(
                                          formik.values.date
                                      ).toLocaleDateString()
                                    : "Select date"}
                            </AccordionTrigger>
                        </div>
                    </div>

                    <hr />

                    <AccordionContent className="mt-4">
                        <Calendar
                            mode="single"
                            selected={
                                formik.values.date
                                    ? new Date(formik.values.date)
                                    : undefined
                            }
                            onSelect={(date) =>
                                formik.setFieldValue("date", date)
                            }
                            className="rounded-lg border w-full h-40 overflow-y-auto"
                            disabled={handleDisableDate}
                        />
                    </AccordionContent>
                </AccordionItem>
            </Accordion>

            {formik.touched.date && formik.errors.date ? (
                <AlertMsg message={formik.errors.date} />
            ) : null}
        </>
    );
}

export default AppointmentDate;
