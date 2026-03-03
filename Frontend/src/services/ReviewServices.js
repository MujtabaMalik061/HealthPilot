import API from "../utils/api";

export const getAllReviewsHelper = async (page = 1, limit = 20) => {
  try {
    const res = await API.get("/api/reviews/getAllReviews", {
      params: { page, limit },
    });
    return res.data;
  } catch (err) {
    throw err;
  }
};

export const getSingleUserReviewsHelper = async (
  userId = null,
  from = "all",
  page = 1,
  limit = 20,
) => {
  try {
    const res = await API.get("/api/reviews/getSingleUserReviews", {
      params: { page, limit, userId, from },
    });
    return res.data;
  } catch (err) {
    throw err;
  }
};

export const getSingleUserReviewCountHelper = async (
  userId = null,
  from = "all",
) => {
  try {
    const res = await API.get("/api/reviews/getSingleUserReviewCount", {
      params: { userId, from },
    });
    return res.data;
  } catch (err) {
    throw err;
  }
};

export const getAppointmentReviewsHelper = async (
  appointmentId = null,
  page = 1,
  limit = 20,
) => {
  try {
    const res = await API.get("/api/reviews/getAppointmentReviews", {
      params: { page, limit, appointmentId },
    });
    return res.data;
  } catch (err) {
    throw err;
  }
};

export const getReviewByIdHelper = async (Id) => {
  try {
    const res = await API.get(`/api/reviews/getReviewById/${Id}`);
    return res.data;
  } catch (err) {
    throw err;
  }
};

export const addReviewHelper = async (data) => {
  try {
    const res = await API.post("/api/reviews/addReview", data);
    return res.data;
  } catch (err) {
    throw err;
  }
};

export const updateReviewHelper = async (Id, data) => {
  const payload = {
    review: data?.review,
    rating: data?.rating,
  };

  try {
    const res = await API.patch(`/api/reviews/updateReview/${Id}`, { payload });
    return res.data;
  } catch (err) {
    throw err;
  }
};

export const deleteReviewHelper = async (Id) => {
  try {
    const res = await API.patch(`/api/reviews/deleteReview/${Id}`);
    return res.data;
  } catch (err) {
    throw err;
  }
};
