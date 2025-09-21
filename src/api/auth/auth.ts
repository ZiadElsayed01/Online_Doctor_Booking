import type { ISignIn, ISignUp } from "@/types";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";

const BASE_URL = import.meta.env.VITE_BASE_URL;

let userOTP = "";

export const handleLogin = async (values: ISignIn) => {
  try {
    const res = await axios.post(`${BASE_URL}login`, values);

    if (res.status === 200) {
      toast.success(`Welcome Back ${res.data.data.user.name} 😊`);
      localStorage.setItem("token", res.data.data.token);
      return true;
    }
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    console.error("Login error:", err);
    if (err.response?.status === 401) {
      toast.error("Incorrect email or password");
      return;
    }
    toast.error("Something went wrong");
  }
};

export const handleSignUp = async (values: ISignUp) => {
  try {
    const res = await axios.post(`${BASE_URL}register`, {
      name: values.name,
      email: values.email,
      password: values.password,
      password_confirmation: values.password,
    });

    if (res.status === 201) {
      toast.success("Sign up successful 😊");
      return true;
    }
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    console.error("Sign up error:", err);
    if (err.response?.data.message === "Email is already in use") {
      toast.error("Email is already registered");
      return;
    }
    toast.error("Something went wrong");
  }
};

export const handleSendOtp = async (values: { email: string }) => {
  try {
    const res = await axios.post(`${BASE_URL}send-reset-otp`, values);

    if (res.status === 200) {
      toast.success("Otp sent successfully");

      localStorage.setItem("userEmail", res.data.data.email);

      const otpNote = res.data.data.note;
      const otpMatch = otpNote.match(/\{(\d+)\}/);
      userOTP = otpMatch[1];
      return true;
    }
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    console.error("Send otp error:", err);
    if (err.response?.data.message === "Email not found in our records") {
      toast.error("Email not found");
      return;
    }
    toast.error("Something went wrong");
  }
};

export const handleVerifyOtp = async (otp: string) => {
  if (otp !== userOTP) {
    toast.error("Invalid or expired OTP");
    return;
  }
  try {
    const res = await axios.post(`${BASE_URL}verify-otp`, {
      email: localStorage.getItem("userEmail"),
      otp,
    });

    if (res.status === 200) {
      toast.success("Otp verified successfully");
      return true;
    }
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    console.error("Verify otp error:", err);
    if (err.response?.data.message === "Invalid or expired OTP") {
      toast.error("Invalid or expired OTP");
      return;
    }
    toast.error("Something went wrong");
  }
};

export const handleResetPassword = async (values: {
  password: string;
  password_confirmation: string;
}) => {
  try {
    const res = await axios.post(`${BASE_URL}reset-password`, {
      email: localStorage.getItem("userEmail"),
      otp: userOTP,
      password: values.password,
      password_confirmation: values.password_confirmation,
    });

    if (res.status === 200) {
      toast.success("Password reset successfully");
      localStorage.removeItem("userEmail");
      return true;
    }
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    console.error("Reset password error:", err);
    toast.error("Something went wrong");
  }
};

export const handleLogout = async () => {
  try {
    const res = await axios.post(
      `${BASE_URL}logout`,
      {},
      { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
    );
    if (res.status === 200) {
      localStorage.removeItem("token");
      toast.success("See you soon 👋");
      return true;
    }
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    console.error("Logout error:", err);
    toast.error("Something went wrong");
  }
};
