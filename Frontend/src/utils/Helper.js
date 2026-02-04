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
