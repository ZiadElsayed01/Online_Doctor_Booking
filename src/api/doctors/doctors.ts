import axios from "axios";

import type { IDoctorDetails } from "@/types";
import type { IAppointmentValues } from "@/types";

// const TOKEN = import.meta.env.VITE_TOKEN_DOCTOR;
const TOKEN = localStorage.getItem("token") ?? "";

// GET DOCTORS DATA
export const fetchDoctorsData = async (): Promise<IDoctorDetails[]> => {
    const response = await fetch(
        "https://round5-online-booking-with-doctor-api.huma-volve.com/api/doctors",
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization:
                    "Bearer 7|SWbACSDKrqnrOpdVEiPPpPMvi5BYToGBDb1UW1uC67c0cf5e",
            },
        }
    );

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.data as IDoctorDetails[];
};

// GET DOCTOR DETAILS
export const getDoctorDetails = async (id: string) => {
    try {
        const response = await axios.get(
            `${import.meta.env.VITE_BASE_URL}doctors/${id}`,
            {
                headers: {
                    Authorization: `Bearer ${TOKEN}`,
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

// GET DOCTOR REVIEWS
export const getDoctorReviews = async (link: string) => {
    try {
        const response = await axios.get(link, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${TOKEN}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

// POST REVIEW
export const addReview = async (reviewData: {
    doctorId: number;
    rating: number;
    comment: string;
}) => {
    try {
        const response = await axios.post(
            `${import.meta.env.VITE_BASE_URL}doctors/${
                reviewData.doctorId
            }/reviews`,
            { rating: reviewData.rating, comment: reviewData.comment },
            {
                headers: {
                    Authorization: `Bearer ${TOKEN}`,
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

// GET DOCTOR AVAILABLE SLOTS
export const getAvailableSlots = async (id: string) => {
    try {
        const response = await axios.get(
            `${import.meta.env.VITE_BASE_URL}doctors/${id}/available-slots`,
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${TOKEN}`,
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
                    Authorization: `Bearer ${TOKEN}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};
