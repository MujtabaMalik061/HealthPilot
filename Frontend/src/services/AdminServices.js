import API from "../utils/api";

export const getServicesHelper = async (page = 1, limit = 20, search = "") => {
  try {
    const res = await API.get("/api/services/getAllServices", {
      params: { page, limit, search },
    });
    return res.data;
  } catch (err) {
    throw err.response?.data;
  }
};

export const createServiceHelper = async (data) => {
  try {
    const res = await API.post("/api/services/addService", data);
    return res.data;
  } catch (err) {
    throw err.response?.data;
  }
};

export const updateServiceHelper = async (id, data) => {
  try {
    const res = await API.patch(`/api/services/updateService/${id}`, data);
    return res.data;
  } catch (err) {
    throw err.response?.data;
  }
};

export const deleteServiceHelper = async (id) => {
  try {
    const res = await API.delete(`/api/services/deleteService/${id}`);
    return res.data;
  } catch (err) {
    throw err.response?.data;
  }
};
