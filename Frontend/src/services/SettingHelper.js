import API from "../utils/api";

export const UpdateProfileHelper = async (userId, formData) => {
  try {
    const res = await API.patch(`/api/auth/${userId}`, formData);
    return res.data;
  } catch (err) {
    throw err.response?.data;
  }
};

export const updatePasswordHelper = async (userId, formData) => {
  try {
    const res = await API.patch(`/api/auth/updatePassword/${userId}`, formData);
    return res.data;
  } catch (err) {
    throw err.response?.data;
  }
};

export const updatePushHelper = async (userId, formData) => {
  try {
    const res = await API.patch(`/api/users/update-push/${userId}`, formData);
    return res.data;
  } catch (err) {
    throw err.response?.data;
  }
};

export const forgetPasswordHelper = async ({ email }) => {
  try {
    const res = await API.post("/api/auth/forget-password", { email });
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};

export const otpCheckHelper = async ({ email, otpCode }) => {
  try {
    const res = await API.post("/api/auth/otp-check", { email, otpCode });
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};

export const newPasswordHelper = async ({ email, newPassword }) => {
  try {
    const res = await API.post("/api/auth/new-password", {
      email,
      newPassword,
    });
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};
