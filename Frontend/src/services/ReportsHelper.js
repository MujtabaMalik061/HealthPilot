import API from "../utils/api";

export const getReportsHelper = async (
  page = 1,
  limit = 20,
  search = "",
  status = "all",
) => {
  try {
    const res = await API.get("/api/reports/getReports", {
      params: { page, limit, search, status },
    });
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};

export const addReportHelper = async ({
  sender,
  receiver,
  reportType,
  title,
  description,
  reported,
}) => {
  try {
    const res = await API.post("/api/reports/addReport", {
      sender,
      receiver,
      reportType,
      title,
      description,
      reported,
    });
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};

export const updateReportHelper = async (reportId, updateData) => {
  try {
    const res = await API.patch(
      `/api/reports/updateReport/${reportId}`,
      updateData,
    );
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};

export const resolveReportHelper = async ({
  reportId = null,
  status = "",
  adminResponse = "",
}) => {
  try {
    const res = await API.patch(`/api/reports/resolve-report/${reportId}`, {
      status,
      adminResponse,
    });
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};

export const deleteReportHelper = async (reportId) => {
  try {
    const res = await API.delete(`/api/reports/deleteReport/${reportId}`);
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};

export const getReportByIdHelper = async (reportId) => {
  try {
    const res = await API.get(`/api/reports/getReportById/${reportId}`);
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};

export const getReportsSingleUserHelper = async (
  userId,
  type = "all",
  page = 1,
  limit = 20,
) => {
  try {
    const res = await API.get("/api/reports/getReportsSingleUser", {
      params: { userId, type, page, limit },
    });
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};
