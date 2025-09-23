import type { IAppointmentValues } from "@/types";
import axios from "axios";

// const TOKEN = import.meta.env.VITE_TOKEN_DOCTOR;
// const TOKEN = localStorage.getItem("token") ?? "";

// GET USER APPOINTMENTS
export const getUserAppointments = async (filterBy: null | string) => {
    try {
        const response = await axios.get(
            `${import.meta.env.VITE_BASE_URL}my-bookings?filter=${
                filterBy ?? ""
            }`,
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                    "Content-Type": "application/json",
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

// POST DOCTOR APPOINTMENT
export const createDoctorAppointment = async (data: IAppointmentValues) => {
    try {
        const response = await axios.post(
            `${import.meta.env.VITE_BASE_URL}appointments`,
            data,
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

// CANCEL USER APPOINTMENT
export const cancelAppointment = async (appointmentId: number) => {
    try {
        const response = await axios.post(
            `${
                import.meta.env.VITE_BASE_URL
            }appointments/${appointmentId}/cancel`,
            null,
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                    "Content-Type": "application/json",
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};
