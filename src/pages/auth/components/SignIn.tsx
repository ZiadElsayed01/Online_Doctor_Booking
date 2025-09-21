import { Input } from "@/components/ui/input";
import BsHeartPulse from "../../../assets/images/BsHeartPulse.png";
import curveBgWhite from "../../../assets/images/curve-bg-white.png";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";
import { Loader } from "@/components/common/Loader";
import { handleLogin } from "@/api/auth/auth";
import type { ISignIn } from "@/types";
// import { useUserContext } from "@/context/user-context";

const social = [
  {
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M20 10.025C20 4.50502 15.52 0.0250244 10 0.0250244C4.48 0.0250244 0 4.50502 0 10.025C0 14.865 3.44 18.895 8 19.825V13.025H6V10.025H8V7.52502C8 5.59502 9.57 4.02502 11.5 4.02502H14V7.02502H12C11.45 7.02502 11 7.47502 11 8.02502V10.025H14V13.025H11V19.975C16.05 19.475 20 15.215 20 10.025Z"
          fill="#1877F2"
        />
      </svg>
    ),
  },
  {
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M21.8055 10.0415H21V10H12V14H17.6515C16.827 16.3285 14.6115 18 12 18C8.6865 18 6 15.3135 6 12C6 8.6865 8.6865 6 12 6C13.5295 6 14.921 6.577 15.9805 7.5195L18.809 4.691C17.023 3.0265 14.634 2 12 2C6.4775 2 2 6.4775 2 12C2 17.5225 6.4775 22 12 22C17.5225 22 22 17.5225 22 12C22 11.3295 21.931 10.675 21.8055 10.0415Z"
          fill="#FFC107"
        />
        <path
          d="M3.15302 7.3455L6.43851 9.755C7.32752 7.554 9.48052 6 12 6C13.5295 6 14.921 6.577 15.9805 7.5195L18.809 4.691C17.023 3.0265 14.634 2 12 2C8.15902 2 4.82802 4.1685 3.15302 7.3455Z"
          fill="#FF3D00"
        />
        <path
          d="M12 22C14.583 22 16.93 21.0115 18.7045 19.404L15.6095 16.785C14.572 17.5745 13.3038 18.0014 12 18C9.399 18 7.1905 16.3415 6.3585 14.027L3.0975 16.5395C4.7525 19.778 8.1135 22 12 22Z"
          fill="#4CAF50"
        />
        <path
          d="M21.8055 10.0415H21V10H12V14H17.6515C17.2571 15.1082 16.5467 16.0766 15.608 16.7855L15.6095 16.7845L18.7045 19.4035C18.4855 19.6025 22 17 22 12C22 11.3295 21.931 10.675 21.8055 10.0415Z"
          fill="#1976D2"
        />
      </svg>
    ),
  },
  {
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 16 18"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M13.0535 17.2789C12.0735 18.2289 11.0035 18.0789 9.97354 17.6289C8.88354 17.1689 7.88354 17.1489 6.73354 17.6289C5.29354 18.2489 4.53354 18.0689 3.67354 17.2789C-1.20646 12.2489 -0.486464 4.5889 5.05354 4.3089C6.40354 4.3789 7.34354 5.0489 8.13354 5.1089C9.31354 4.8689 10.4435 4.1789 11.7035 4.2689C13.2135 4.3889 14.3535 4.9889 15.1035 6.0689C11.9835 7.9389 12.7235 12.0489 15.5835 13.1989C15.0135 14.6989 14.2735 16.1889 13.0435 17.2889L13.0535 17.2789ZM8.03354 4.2489C7.88354 2.0189 9.69354 0.178901 11.7735 -0.00109863C12.0635 2.5789 9.43354 4.4989 8.03354 4.2489Z"
          fill="black"
        />
      </svg>
    ),
  },
];

export default function SignIn() {
  const navigate = useNavigate();
  // const { handleGetUser } = useUserContext();

  const validationSchema = yup.object({
    email: yup.string().email("Invalid email").required("Email is required"),
    password: yup
      .string()
      .min(8, "Password must be at least 8 characters")
      .required("Password is required"),
  });

  const handleLoginSubmit = async (values: ISignIn) => {
    const res = await handleLogin(values);
    if (res) {
      navigate("/");
      // await handleGetUser();
    }
  };

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit: handleLoginSubmit,
  });

  return (
    <>
      <div className="relative h-screen py-14 lg:py-0">
        <div className="flex flex-col gap-6 lg:gap-0 lg:flex-row justify-center lg:justify-between h-full">
          <div className="flex items-center justify-center lg:absolute lg:top-10 lg:left-20">
            <img className="w-10 h-10" src={BsHeartPulse} alt="Logo" />
          </div>

          <div className="w-[80%] flex flex-col justify-center mx-auto lg:w-1/3">
            <h1 className="text-2xl font-bold text-center">Sign in</h1>
            <p className="text-xs text-center my-4">
              Please provide all information required to access your account
            </p>

            <form onSubmit={formik.handleSubmit}>
              <div>
                <Label>Email</Label>
                <Input
                  type="email"
                  placeholder="Email"
                  name="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  autoComplete="email"
                />
                {formik.errors.email && formik.touched.email ? (
                  <p className="text-red-500 text-sm mt-1">
                    {formik.errors.email}
                  </p>
                ) : null}
              </div>

              <div>
                <Label>Password</Label>
                <Input
                  type="password"
                  placeholder="Password"
                  name="password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  autoComplete="current-password"
                />
                {formik.errors.password && formik.touched.password ? (
                  <p className="text-red-500 text-sm mt-1">
                    {formik.errors.password}
                  </p>
                ) : null}
              </div>

              <Link to="/forget-password" className="text-primary my-4 block">
                Forgot the password?
              </Link>

              <Button
                className="w-full py-6"
                type="submit"
                disabled={
                  formik.isSubmitting || Object.keys(formik.errors).length > 0
                }
              >
                {formik.isSubmitting ? (
                  <Loader size={"md"} variant="white" />
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>

            <div className="my-8">
              <div className="w-full relative h-0.5 bg-gray-200">
                <div className="absolute text-gray-400 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-2 rounded-full">
                  or
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between gap-2 mb-6">
              {social.map((item, index) => (
                <div
                  key={index}
                  className="bg-white p-4 rounded-2xl border cursor-pointer"
                >
                  {item.icon}
                </div>
              ))}
            </div>

            <div className="text-center">
              Don’t have an account?{" "}
              <Link to="/sign-up" className="text-primary">
                Sign Up
              </Link>
            </div>
          </div>
          <div className="hidden lg:flex w-[40%]">
            <img
              src={curveBgWhite}
              alt=""
              className="w-full object-cover h-full"
            />
          </div>
        </div>
      </div>
    </>
  );
}
