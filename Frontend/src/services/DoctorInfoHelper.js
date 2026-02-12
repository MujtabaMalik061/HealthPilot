import API from "../utils/api";

export const updateDoctorDetailsHelper = async (userId, formData) => {
  try {
    const res = await API.patch(
      `/api/auth/updateDoctorDetails/${userId}`,
      formData,
    );
    return res.data;
  } catch (err) {
    throw err.response?.data;
  }
};