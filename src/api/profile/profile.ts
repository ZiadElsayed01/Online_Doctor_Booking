import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const TOKEN = localStorage.getItem("token") || import.meta.env.VITE_TOKEN;

export const getProfile = async () => {
    try {
        const response = await axios.get(`${BASE_URL}me`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${TOKEN}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error(error);
        toast.error("Failed to fetch profile");
    }
};

export type UpdateProfilePayload = {
    name: string;
    phone: string;
    email: string;
    birthdate: string | null;
    avatar?: File | null;
};

export async function updateProfile(data: UpdateProfilePayload) {
    try {
        const form = new FormData();
        form.append("name", data.name);
        form.append("phone", data.phone);
        form.append("birthdate", data.birthdate ?? "");
        if (data.avatar instanceof File) {
            form.append("avatar", data.avatar);
        }

        const res = await axios.post(`${BASE_URL}profile`, form, {
            headers: {
                Authorization: `Bearer ${TOKEN}`,
            },
        });

        toast.success("Profile updated successfully");
        return res.data;
    } catch (e) {
        const err = e as AxiosError<{ message?: string }>;
        const msg = err.response?.data?.message || "Failed to update profile";
        toast.error(msg);
        throw err;
    }
}
export async function deleteAccount(password: string) {
    try {
        const res = await axios.post(
            `${BASE_URL}delete_account`,
            { password },
            {
                headers: {
                    Authorization: `Bearer ${TOKEN}`,
                },
            }
        );

        toast.success("delete successfully");
        return res.data;
    } catch (e) {
        const err = e as AxiosError<{ message?: string }>;
        const msg = err.response?.data?.message || "Failed to delete";
        toast.error(msg);
        throw err;
    }
}
export async function logout() {
    try {
        const TOKEN = localStorage.getItem("token");
        const res = await axios.post(
            `${BASE_URL}profile`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${TOKEN}`,
                },
            }
        );

        toast.success("logout successfully");
        return res.data;
    } catch (e) {
        const err = e as AxiosError<{ message?: string }>;
        const msg = err.response?.data?.message || "Failed to logout";
        toast.error(msg);
        throw err;
    }
}
