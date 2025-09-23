export type IUserData = {
  id: number;
  name: string;
  email: string;
  phone: string;
  birthdate: Date;
  avatar: string;
  email_verified_at: null;
  created_at: Date;
  updated_at: Date;
};

export type IDoctorDetails = {
  doctor_profile_id: number;
  about: string;
  experience_years: number;
  price_per_hour: string;
  user_id: number;
  name: string;
  email: string;
  phone: string;
  specialty_id: number;
  specialty_name_en: string;
  specialty_name_ar: string;
  specialty_description: string;
  hospital_id: number;
  hospital_name: string;
  hospital_city: string;
  hospital_start_time: string;
  hospital_end_time: string;
  average_rating: string;
  reviews_count: number;
  address?: string;
  lat?: number;
  lng?: number;
  availability: {
    availability_id: number;
    day: string;
    start_time: string;
    end_time: string;
  }[];
};

export type IFavouriteDoctor = {
  doctor_profile_id: number;
  about: string;
  experience_years: number;
  price_per_hour: string;
  user_id: number;
  name: string;
  email: string;
  phone: string;
  specialty_id: number;
  specialty_name_en: string;
  specialty_name_ar: string;
  specialty_description: string;
  hospital_id: number;
  hospital_name: string;
  hospital_city: string;
  hospital_start_time: string;
  hospital_end_time: string;
  availability_id: number;
  day: string;
  start_time: string;
  end_time: string;
  average_rating: string;
  reviews_count: number;
  availability: {
    availability_id: number;
    day: string;
    start_time: string;
    end_time: string;
  }[];
};

export type ISpecialist = {
  id: number;
  name_en: string;
  name_ar: string;
  description: string;
  icon: string;
  status: number;
  created_at: Date;
  updated_at: Date;
};

export type ISpeciality = {
  id: number;
  name_en: string;
  name_ar: string;
  description: string;
  icon: string;
  status: number;
  created_at: Date;
  updated_at: Date;
};

export type IBooking = {
  id: number;
  user_id: number;
  doctor_profile_id: number;
  appointment_date: Date;
  appointment_time: string;
  status: string;
  price: string;
  payment_id: null;
  created_at: Date;
  updated_at: Date;
  doctor_profile: IDoctorProfile;
};

export type IDoctorProfile = {
  id: number;
  user_id: number;
  specialties_id: number;
  hospital_id: number;
  about: string;
  experience_years: number;
  price_per_hour: string;
  created_at: Date;
  updated_at: Date;
  doctor: IDoctor;
};

export type IDoctor = {
  id: number;
  name: string;
  avatar: string;
  email: string;
  stripe_id: string;
  email_verified_at: Date;
  is_active: number;
  phone: string;
  birthdate: Date;
  created_at: null;
  updated_at: null;
};

export type IAppointmentSlot = {
  date: Date;
  time: string;
};

export type IUserCard = {
  id: number;
  stripe_pm_id: string;
  user_id: number;
  card_holder_name: string;
  last_four: string;
  brand: string;
  exp_month: string;
  exp_year: string;
  created_at: Date;
  updated_at: Date;
};

export type INotification = {
  id: string;
  title: string;
  message: string;
  icon: string;
  color: string;
  type: string;
  is_read: boolean;
  read_at: Date;
  created_at: Date;
  created_at_formatted: string;
};

export type ISignIn = {
  email: string;
  password: string;
};

export type ISignUp = {
  name: string;
  email: string;
  password: string;
};

export type IAppointmentValues = {
  date: string;
  time: string;
  doctor_id: number;
};

export type IDoctorReview = {
  id: number;
  user_id: number;
  doctor_id: number;
  rating: number;
  comment: string;
  created_at: Date;
  updated_at: Date;
  user: User;
};

export type IReviewsResponse = {
  current_page: number;
  data: IReview[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: IReviewsLink[];
  next_page_url: string;
  path: string;
  per_page: number;
  prev_page_url: null;
  to: number;
  total: number;
};

export type IReview = {
  id: number;
  user_id: number;
  doctor_id: number;
  rating: number;
  comment: string;
  created_at: Date;
  updated_at: Date;
  user: User;
};

export type User = {
  id: number;
  name: Name;
  avatar: null;
};

export enum Name {
  Cfbcb = "cfbcb",
  HumaVolve = "Huma Volve",
  Mohamed = "Mohamed",
}

export type IReviewsLink = {
  url: null | string;
  label: string;
  active: boolean;
};

export type IAppointment = {
  id: number;
  user_id: number;
  doctor_id: number;
  date: Date;
  time: string;
  status: string;
  is_paid: number;
  payment_reference: null;
  created_at: Date;
  updated_at: Date;
  doctor: {
    id: number;
    name: string;
    profile_image: null;
    phone: string;
    email: string;
    specialist_id: number;
    bio: string;
    available_slots: string[];
    status: boolean;
    created_at: Date;
    updated_at: Date;
  };
};
