export const getDoctorExperince = (year) => {
  if (!year) return 0;

  const currentYear = new Date().getFullYear();
  const startYear = Number(year);

  if (isNaN(startYear) || startYear > currentYear) return 0;

  return currentYear - startYear;
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

export const DashboardRoute = (role, navigate) => {
  if (role === "admin") {
    navigate("/admin/dashboard");
  } else if (role === "doctor") {
    navigate("/doctor/dashboard");
  } else {
    navigate("/dashboard");
  }
};
