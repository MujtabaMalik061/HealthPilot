import API from "../utils/api";

export const getAppointmentCountsHelper = async (Id) => {
  try {
    const res = await API.get("/api/appointments/getAppointmentCounts", {
      params: { id : Id}, 
    });
    return res.data;
  } catch (err) {
    throw err;
  }
};

export const getAllAppointmentsHelper = async (
  page = 1,
  limit = 20,
  search = "",
  status = "all",
) => {
  try {
    const res = await API.get("/api/appointments/getAllAppointments", {
      params: { page, limit, search, status },
    });
    return res.data;
  } catch (err) {
    throw err;
  }
};

export const getSingleUserAppointmentsHelper = async (
  userId,
  page = 1,
  limit = 20,
  status = "all",
) => {
  try {
    const res = await API.get(
      `/api/appointments/getSingleUserAppointments/${userId}`,
      {
        params: { page, limit, status },
      },
    );
    return res.data;
  } catch (err) {
    throw err;
  }
};

export const getAppointmentByIdHelper = async (Id) => {
  try {
    const res = await API.get(`/api/appointments/getAppointmentById/${Id}`);
    return res.data;
  } catch (err) {
    throw err;
  }
};

export const getDoctorAvailityTimeByDateHelper = async (doctorId, date) => {
  try {
    const res = await API.get(
      `/api/appointments/getDoctorAvaility/${doctorId}/${date}`,
    );
    return res?.data;
  } catch (err) {
    throw err;
  }
};

export const addAppointmentHelper = async (data) => {
  try {
    const res = await API.post("/api/appointments/addAppointment", data);
    return res?.data;
  } catch (err) {
    throw err;
  }
};

export const updateAppointmentHelper = async (Id, data) => {
  try {
    const res = await API.patch(
      `/api/appointments/updateAppointment/${Id}`,
      data,
    );
    return res.data;
  } catch (err) {
    throw err;
  }
};

export const deleteAppointmentHelper = async (Id) => {
  try {
    const res = await API.delete(
      `/api/appointments/deleteAppointment/${Id}`,
      data,
    );
    return res.data;
  } catch (err) {
    throw err;
  }
};
