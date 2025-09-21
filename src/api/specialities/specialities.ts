import axios from "axios";

import type { ISpecialist } from "@/types";

const TOKEN = import.meta.env.VITE_TOKEN_DOCTOR;
// const TOKEN = localStorage.getItem("token");

// GET SPECIALITIES
export const fetchSpecialitiesData = async (): Promise<ISpecialist[]> => {
    const response = await fetch(
        "https://round5-online-booking-with-doctor-api.huma-volve.com/api/specialities",
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
    return data.data as ISpecialist[];
};

// GET SPECIALITY
export const getSpeciality = async (id: number) => {
    try {
        const response = await axios.get(
            `${import.meta.env.VITE_BASE_URL}specialities/${id}`,
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
