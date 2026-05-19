import API from "./api";

export const getDoctorExperince = (value) => {
  if (!value) return 0;

  const currentYear = new Date().getFullYear();

  let startYear;
  if (typeof value === "string" || value instanceof Date) {
    const date = new Date(value);
    if (isNaN(date.getTime())) return 0;
    startYear = date.getFullYear();
  } else {
    startYear = Number(value);
  }

  if (isNaN(startYear) || startYear > currentYear) return 0;

  return currentYear - startYear;
};

export const getDoctorAvailabilty = (availableDays = []) => {
  if (!availableDays.length) return false;

  const now = new Date();
  const currentDay = now.toLocaleDateString("en-US", { weekday: "long" });
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const convertToMinutes = (timeStr) => {
    const [time, modifier] = timeStr.split(" ");
    let [hours, minutes] = time.split(":").map(Number);

    if (modifier === "PM" && hours !== 12) hours += 12;
    if (modifier === "AM" && hours === 12) hours = 0;

    return hours * 60 + minutes;
  };
  const todaySchedule = availableDays.find((item) => item.day === currentDay);

  if (!todaySchedule) return false;

  const startMinutes = convertToMinutes(todaySchedule.start);
  const endMinutes = convertToMinutes(todaySchedule.end);

  return currentMinutes >= startMinutes && currentMinutes <= endMinutes;
};

export const getInitialsByName = (name) => {
  if (!name) return "";

  return name
    .trim()
    .split(" ")
    .filter(Boolean)
    .map((word) => word[0].toUpperCase())
    .join("");
};

export const timeAgo = (dateString) => {
  if (!dateString) return "";

  const now = new Date();
  const past = new Date(dateString);
  const diff = Math.floor((now - past) / 1000);

  if (diff < 60) return `${diff}s ago`;

  const minutes = Math.floor(diff / 60);
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;

  const weeks = Math.floor(days / 7);
  if (weeks < 4) return `${weeks}w ago`;

  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;

  const years = Math.floor(days / 365);
  return `${years}y ago`;
};

export const formateTimeInM = (time) => {
  if (!time) return "N/A";

  if (/am|pm/i.test(time)) {
    return time;
  }

  const parts = time.split(":");
  if (parts.length !== 2) return time;

  const [hoursStr, minutes] = parts;
  let hours = parseInt(hoursStr, 10);

  if (isNaN(hours)) return time;

  const ampm = hours >= 12 ? "PM" : "AM";

  hours = hours % 12;
  if (hours === 0) hours = 12;

  return `${hours.toString().padStart(2, "0")}:${minutes} ${ampm}`;
};

export const formateDate = (date) => {
  if (!date) return "-";

  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();

  return `${day}/${month}/${year}`;
};

export const DashboardRoute = (role, navigate) => {
  if (role === "admin") {
    navigate("/admin/dashboard");
  } else if (role === "doctor") {
    navigate("/doctor/dashboard");
  } else {
    navigate("/dashboard");
  }
};

export const handleUploadImage = async (avatarFile) => {
  try {
    let avatarUrl = "";
    if (avatarFile) {
      const formData = new FormData();
      formData.append("image", avatarFile);
      const res = await fetch(
        `${import.meta.env.VITE_IMAGE_BACKEND}/addImage`,
        {
          method: "POST",
          body: formData,
        },
      );

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to upload avatar");

      avatarUrl = data.url;
    }
    return avatarUrl;
  } catch (err) {
    console.error("Failed to Upload Image:", err);
  }
};

export const getAdminId = async () => {
  try {
    const res = await API.get("/api/auth/getAdminId");
    return res.data;
  } catch (err) {
    throw err.response?.data;
  }
};

export const getUserById = async (id) => {
  try {
    const res = await API.get(`/api/auth/getUserDetailsById/${id}`);
    return res.data;
  } catch (err) {
    throw err.response?.data;
  }
};

export const store = {
  name: "Health pilot",
  address: "Paksitan, Lahore, Gulberg",
  openingHours: "11:00AM - 08:00PM",
  phone: "+923234567891",
  about: "We offer best doctors and services",
  links: [
    {
      link: "/landing-services",
      keywords: [
        "Our Services",
        "Services",
        "Medical Services",
        "Healthcare Services",
        "Hospital Services",
        "Clinic Services",
        "Doctor Consultation",
        "Specialist Doctors",
        "Ear Specialist",
        "Eye Specialist",
        "Dental Care",
        "Teeth Treatment",
        "ENT Services",
        "Ophthalmology",
        "Dentistry",
        "General Physician",
        "Pediatrics",
        "Dermatology",
        "Orthopedics",
        "Cardiology",
        "Neurology",
        "Medical Checkup",
        "Health Care",
        "Treatment Services",
      ],
    },
    {
      link: "/landing-doctors",
      keyWords: [
        "Our Doctors",
        "Doctors",
        "Find Doctors",
        "Book Doctor",
        "Doctor Appointment",
        "Specialist Doctors",
        "Experienced Doctors",
        "Qualified Doctors",
        "Medical Experts",
        "Healthcare Professionals",
        "Hospital Doctors",
        "Clinic Doctors",
        "Consult Doctor Online",
        "Top Doctors",
        "Best Doctors",
        "General Physician",
        "Surgeons",
        "ENT Specialist",
        "Eye Specialist",
        "Dental Specialist",
        "Pediatrician",
        "Dermatologist",
        "Cardiologist",
        "Neurologist",
        "Orthopedic Doctor",
        "Doctor List",
        "Browse Doctors",
      ],
    },
    {
      link: "/about",
      keyWords: [
        "About Us",
        "About",
        "Our Story",
        "Who We Are",
        "Healthcare Company",
        "Medical Organization",
        "Hospital Information",
        "Our Mission",
        "Our Vision",
        "Trusted Healthcare",
        "Experienced Medical Team",
        "Quality Care",
        "Patient Care",
      ],
    },
    {
      link: "/contact",
      keyWords: [
        "Contact Us",
        "Contact",
        "Get in Touch",
        "Support",
        "Help Center",
        "Customer Support",
        "Appointment Help",
        "Clinic Contact",
        "Hospital Contact",
        "Email Support",
        "Call Us",
        "Feedback",
        "Inquiry",
      ],
    },
    {
      link: "/careers",
      keyWords: [
        "Careers",
        "Jobs",
        "Join Us",
        "Work With Us",
        "Hiring",
        "Medical Jobs",
        "Hospital Careers",
        "Healthcare Jobs",
        "Apply Now",
        "Job Openings",
        "Vacancies",
        "Nursing Jobs",
        "Doctor Jobs",
        "Staff Recruitment",
      ],
    },
    {
      link: "/privacy",
      keyWords: [
        "Privacy Policy",
        "Data Protection",
        "User Privacy",
        "Personal Data",
        "Information Security",
        "Privacy Terms",
        "Data Usage",
        "Patient Privacy",
        "GDPR",
        "Policy Information",
        "Website Privacy",
        "Confidentiality",
      ],
    },
    {
      link: "/terms",
      keyWords: [
        "Terms of Service",
        "Terms",
        "Terms and Conditions",
        "User Agreement",
        "Legal Terms",
        "Service Rules",
        "Usage Policy",
        "Website Terms",
        "Conditions of Use",
        "Healthcare Terms",
        "Platform Rules",
        "Service Agreement",
      ],
    },
  ],
};

export const theme = {
  "--backGround": "var(--background)",
  "--botBg": "var(--border)",
  "--botTc": "var(--card-foreground)",
  "--userBg": "var(--primary)",
  "--userTc": "#ffffff",
  "--btnBg": "var(--primary)",
  "--btnTc": "#ffffff",
  "--headBg": "var(--primary)",
  "--headTc": "#ffffff",
};
