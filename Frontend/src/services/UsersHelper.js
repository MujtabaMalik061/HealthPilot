import API from "../utils/api";

export const getAllUsersHelper = async (page = 1, limit = 20, search = "") => {
  try {
    const res = await API.get("/api/users/getAllUsers", {
      params: { page, limit, search },
    });
    return res.data;
  } catch (err) {
    throw err.response?.data;
  }
};

export const getUsersByTypeHelper = async (
  page = 1,
  limit = 20,
  search = "",
  role = "doctor",
  specialist = null,
  status = "all",
) => {
  try {
    const res = await API.get(`/api/users/getUsersByType/${status}`, {
      params: { page, limit, search, specialist, role },
    });
    return res.data;
  } catch (err) {
    throw err.response?.data;
  }
};

export const updateUserStatusHelper = async (id, status) => {
  try {
    const res = await API.patch(`/api/users/${id}`, { status: status });
    return res.data;
  } catch (err) {
    throw err.response?.data;
  }
};

export const userCountStatesHelper = async (role = "doctor") => {
  try {
    const res = await API.get(`/api/users/userCountStates/${role}`);
    return res.data;
  } catch (err) {
    throw err.response?.data;
  }
};
