import { getProfile, updateProfile } from "@/api/profile/profile";
import { ErrorMessage, Field, Form, Formik } from "formik";
import {
    Camera,
    ChevronDown,
    ChevronLeft,
    Mail,
    MapPin,
    Phone,
    User as UserIcon,
} from "lucide-react";
import React from "react";
import ReactCountryFlag from "react-country-flag";
import * as Yup from "yup";
import type { IUserData } from "../../types/index";
import { useNavigate } from "react-router-dom";

const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
];
const days = Array.from({ length: 31 }, (_, i) => i + 1);
const currentYear = new Date().getFullYear();
const years = Array.from({ length: 100 }, (_, i) => currentYear - i);

const COUNTRIES = [
    { code: "EG", dial: "+20" },
    { code: "SA", dial: "+966" },
    { code: "AE", dial: "+971" },
] as const;

function dialFromCountry(code: string) {
    return COUNTRIES.find((c) => c.code === code)?.dial ?? "+20";
}
function guessCountryFromPhone(phone: string): string {
    const t = (phone || "").replace(/\s+/g, "");
    if (t.startsWith("+966")) return "SA";
    if (t.startsWith("+971")) return "AE";
    if (t.startsWith("+20")) return "EG";
    return "EG";
}
function splitPhone(phone: string) {
    const code = guessCountryFromPhone(phone);
    const dial = dialFromCountry(code);
    const local = (phone || "").replace(/\s+/g, "").replace(dial, "");
    return { countryCode: code, local };
}
function parseBirthdate(iso?: string | null) {
    if (!iso) return { day: "", month: "", year: "" };
    const m = iso.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (!m) return { day: "", month: "", year: "" };
    const year = m[1];
    const month = months[Number(m[2]) - 1] ?? "";
    const day = String(Number(m[3]));
    return { day, month, year };
}
function buildBirthdate(
    y?: string | number,
    mName?: string,
    d?: string | number
) {
    if (!y || !mName || !d) return null;
    const idx = months.indexOf(String(mName));
    if (idx < 0) return null;
    const mm = String(idx + 1).padStart(2, "0");
    const dd = String(d).padStart(2, "0");
    return `${y}-${mm}-${dd}`;
}

type FormValues = {
    email: string;
    fullName: string;
    avatar: string;
    avatarFile: File | null;
    phone: string;
    countryCode: string;
    day: string | number | "";
    month: string | "";
    year: string | number | "";
};

const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email").required("Required"),
    fullName: Yup.string().min(2, "Too short").required("Required"),
    avatar: Yup.string()
        .url("Invalid URL")
        .nullable()
        .transform((v) => (v === "" ? null : v)),
    phone: Yup.string()
        .matches(/^[0-9]{7,15}$/, "Digits only (7–15)")
        .required("Required"),
    countryCode: Yup.string().required("Required"),
    day: Yup.mixed().required("Required"),
    month: Yup.string()
        .oneOf(months as unknown as string[])
        .required("Required"),
    year: Yup.mixed().required("Required"),
});

function InputWithIcon({
    name,
    placeholder,
    icon: Icon,
    type = "text",
}: {
    name: keyof FormValues;
    placeholder: string;
    icon: React.ElementType;
    type?: string;
}) {
    return (
        <div>
            <div className="flex items-center gap-2 rounded-xl border border-zinc-200 bg-zinc-100 px-3 py-3">
                <Icon className="h-4 w-4 text-zinc-500" />
                <Field
                    name={name}
                    type={type}
                    placeholder={placeholder}
                    className="w-full bg-transparent text-sm text-zinc-800 outline-none placeholder:text-zinc-400"
                />
            </div>
            <ErrorMessage
                name={name}
                component="div"
                className="mt-1 text-xs text-rose-600"
            />
        </div>
    );
}

export default function EditProfilePage() {
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);
    const [profile, setProfile] = React.useState<IUserData | null>(null);

    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const [avatarPreview, setAvatarPreview] = React.useState<string | null>(
        null
    );
    const nav = useNavigate();
    React.useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await getProfile();
                setProfile(data.data.user);
            } catch {
                setError("Failed to load profile");
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const initialValues: FormValues = React.useMemo(() => {
        if (!profile) {
            return {
                email: "",
                fullName: "",
                avatar: "",
                avatarFile: null,
                phone: "",
                countryCode: "EG",
                day: "",
                month: "",
                year: "",
            };
        }

        const email = profile.email ?? "";
        const fullName = profile.name ?? "";
        const avatar = profile.avatar ?? "";

        const { countryCode, local } = profile.phone
            ? splitPhone(profile.phone)
            : { countryCode: "EG", local: "" };

        const { day, month, year } = profile.birthdate
            ? parseBirthdate(profile.birthdate as any)
            : { day: "", month: "", year: "" };

        return {
            email,
            fullName,
            avatar,
            avatarFile: null,
            phone: local,
            countryCode,
            day,
            month,
            year,
        };
    }, [profile]);

    async function onSubmit(values: FormValues) {
        console.log(values);
        const birthdate = buildBirthdate(values.year, values.month, values.day);
        const phone = `${dialFromCountry(
            values.countryCode
        )}${values.phone.replace(/\s+/g, "")}`;

        await updateProfile({
            name: values.fullName,
            email: values.email,
            phone,
            birthdate,
            avatar: values.avatarFile,
        });
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-white">
                <div className="mx-auto w-full max-w-sm sm:max-w-md md:max-w-lg px-4 md:px-6">
                    <div className="flex items-center gap-2 py-3">
                        <div className="h-9 w-9 rounded-full bg-zinc-100" />
                        <div className="mx-auto h-6 w-28 rounded bg-zinc-100" />
                        <div className="w-9" />
                    </div>
                    <div className="mt-6 space-y-4">
                        {[...Array(6)].map((_, i) => (
                            <div
                                key={i}
                                className="h-12 rounded-xl bg-zinc-100"
                            />
                        ))}
                    </div>
                </div>
            </div>
        );
    }
    if (error) {
        return (
            <div className="min-h-screen bg-white">
                <div className="mx-auto w-full max-w-sm sm:max-w-md md:max-w-lg px-4 md:px-6 py-6">
                    <p className="text-rose-600">{error}</p>
                    <button
                        onClick={() => location.reload()}
                        className="mt-3 rounded-lg bg-zinc-900 px-3 py-2 text-sm text-white"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }
    if (!profile) return null;

    return (
        <div className="min-h-screen bg-white">
            <div className="mx-auto w-full max-w-sm sm:max-w-md md:max-w-lg px-4 md:px-6">
                <div className="flex items-center gap-2 py-3">
                    <button
                        type="button"
                        aria-label="Back"
                        className="-ml-2 rounded-full p-2 hover:bg-zinc-100"
                        onClick={() => nav("/profile")}
                    >
                        <ChevronLeft className="h-5 w-5 text-zinc-700" />
                    </button>
                    <h1 className="mx-auto text-lg font-semibold text-zinc-900">
                        Edit Profile
                    </h1>
                    <div className="w-9" />
                </div>

                <div className="mt-2 flex flex-col items-center">
                    <div className="relative">
                        <img
                            src={avatarPreview || profile.avatar}
                            alt="Avatar"
                            className="h-24 w-24 rounded-full object-cover ring-2 ring-white shadow"
                        />

                        <button
                            type="button"
                            className="absolute -bottom-1 -right-1 rounded-full border border-zinc-200 bg-white p-1 shadow"
                            aria-label="Change avatar"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <Camera className="h-4 w-4 text-zinc-700" />
                        </button>

                        <Formik
                            key={profile?.id ?? "empty-seed"}
                            initialValues={{ avatarFile: null } as any}
                            onSubmit={() => {}}
                        >
                            {() => (
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => {
                                        const file =
                                            e.currentTarget.files?.[0] ?? null;
                                        if (file)
                                            setAvatarPreview(
                                                URL.createObjectURL(file)
                                            );
                                    }}
                                />
                            )}
                        </Formik>
                    </div>

                    <h2 className="mt-3 text-base font-semibold text-zinc-900">
                        {profile.name}
                    </h2>
                    <p className="mt-1 flex items-center gap-1 text-xs text-zinc-500">
                        <MapPin className="h-4 w-4" /> 129, El-Nasr Street,
                        Cairo
                    </p>
                </div>

                <Formik
                    key={profile?.id ?? "empty"}
                    initialValues={initialValues}
                    enableReinitialize
                    validationSchema={validationSchema}
                    onSubmit={onSubmit}
                    validateOnBlur
                    validateOnChange={false}
                >
                    {({ setFieldValue, values }) => (
                        <Form className="mt-6 space-y-4">
                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                ref={fileInputRef}
                                onChange={(e) => {
                                    const file =
                                        e.currentTarget.files?.[0] ?? null;
                                    setFieldValue("avatarFile", file);
                                    if (file)
                                        setAvatarPreview(
                                            URL.createObjectURL(file)
                                        );
                                }}
                            />

                            <InputWithIcon
                                name="email"
                                placeholder="Email"
                                icon={Mail}
                                type="email"
                            />
                            <InputWithIcon
                                name="fullName"
                                placeholder="FullName"
                                icon={UserIcon}
                            />

                            <div>
                                <div className="flex items-center gap-2 rounded-xl border border-zinc-200 bg-zinc-100 px-2 py-2">
                                    <div className="flex items-center gap-2 rounded-lg bg-white px-2 py-2">
                                        <ReactCountryFlag
                                            countryCode={
                                                values.countryCode || "EG"
                                            }
                                            svg
                                            aria-label={values.countryCode}
                                            style={{
                                                width: "1.25rem",
                                                height: "1.25rem",
                                                borderRadius: "3px",
                                            }}
                                            className="shadow-sm"
                                        />
                                        <select
                                            value={values.countryCode}
                                            onChange={(e) =>
                                                setFieldValue(
                                                    "countryCode",
                                                    e.target.value
                                                )
                                            }
                                            className="appearance-none bg-transparent pr-4 text-sm outline-none"
                                            aria-label="Country code"
                                        >
                                            {COUNTRIES.map((c) => (
                                                <option
                                                    key={c.code}
                                                    value={c.code}
                                                >
                                                    {c.dial}
                                                </option>
                                            ))}
                                        </select>
                                        <ChevronDown className="h-4 w-4 text-zinc-500" />
                                    </div>

                                    <div className="flex w-full items-center gap-2">
                                        <Phone className="h-4 w-4 text-zinc-500" />
                                        <Field
                                            name="phone"
                                            placeholder="Enter your number"
                                            className="w-full bg-transparent py-1.5 text-sm text-zinc-800 outline-none placeholder:text-zinc-400"
                                        />
                                    </div>
                                </div>
                                <ErrorMessage
                                    name="phone"
                                    component="div"
                                    className="mt-1 text-xs text-rose-600"
                                />
                            </div>

                            <div className="pt-2">
                                <p className="mb-2 text-sm font-semibold text-zinc-900">
                                    Select your birthday
                                </p>

                                <div className="grid grid-cols-3 gap-3">
                                    <div>
                                        <div className="flex items-center justify-between rounded-xl border border-zinc-200 bg-zinc-100 px-3 py-2">
                                            <Field
                                                as="select"
                                                name="day"
                                                className="w-full appearance-none bg-transparent text-sm outline-none"
                                            >
                                                <option value="">Day</option>
                                                {days.map((d) => (
                                                    <option key={d} value={d}>
                                                        {d}
                                                    </option>
                                                ))}
                                            </Field>
                                            <ChevronDown className="h-4 w-4 text-zinc-500" />
                                        </div>
                                        <ErrorMessage
                                            name="day"
                                            component="div"
                                            className="mt-1 text-xs text-rose-600"
                                        />
                                    </div>

                                    <div>
                                        <div className="flex items-center justify-between rounded-xl border border-zinc-200 bg-zinc-100 px-3 py-2">
                                            <Field
                                                as="select"
                                                name="month"
                                                className="w-full appearance-none bg-transparent text-sm outline-none"
                                            >
                                                <option value="">Month</option>
                                                {months.map((m) => (
                                                    <option key={m} value={m}>
                                                        {m}
                                                    </option>
                                                ))}
                                            </Field>
                                            <ChevronDown className="h-4 w-4 text-zinc-500" />
                                        </div>
                                        <ErrorMessage
                                            name="month"
                                            component="div"
                                            className="mt-1 text-xs text-rose-600"
                                        />
                                    </div>

                                    <div>
                                        <div className="flex items-center justify-between rounded-xl border border-zinc-200 bg-zinc-100 px-3 py-2">
                                            <Field
                                                as="select"
                                                name="year"
                                                className="w-full appearance-none bg-transparent text-sm outline-none"
                                            >
                                                <option value="">Year</option>
                                                {years.map((y) => (
                                                    <option key={y} value={y}>
                                                        {y}
                                                    </option>
                                                ))}
                                            </Field>
                                            <ChevronDown className="h-4 w-4 text-zinc-500" />
                                        </div>
                                        <ErrorMessage
                                            name="year"
                                            component="div"
                                            className="mt-1 text-xs text-rose-600"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="pt-2">
                                <button
                                    type="submit"
                                    className="w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-medium text-white shadow-md hover:bg-blue-700"
                                >
                                    Edit Profile
                                </button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
}
