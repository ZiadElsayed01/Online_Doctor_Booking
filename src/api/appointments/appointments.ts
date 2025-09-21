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
