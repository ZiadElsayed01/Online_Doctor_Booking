import axios from "axios";
import toast from "react-hot-toast";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const TOKEN = localStorage.getItem("token") || import.meta.env.VITE_TOKEN;

export const getNotification = async () => {
    try {
        const response = await axios.get(`${BASE_URL}notifications`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${TOKEN}`,
            },
        });
        // هنا نرجّع الـ array بتاعت النوتيفيكيشنز
        return response.data.data.data;
    } catch (error) {
        console.error(error);
        toast.error("Failed to fetch notifications");
        return [];
    }
};
