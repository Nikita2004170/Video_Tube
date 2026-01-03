import api from "./axios";

export const registerAPI = (data) => api.post("/register", data);
export const loginAPI = (data) => api.post("/login", data);
export const forgotPasswordAPI = (data) => api.post("/forgotpassword", data);
export const resetPasswordAPI = (token, data) =>
  api.post(`/resetpassword/${token}`, data);
export const logoutAPI = () => api.post("/logout");
export const updatePasswordAPI = (data) =>
  api.put("/updatepassword", data);
