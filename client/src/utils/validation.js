export const validationMessages = {
  name: "Use 2-60 characters.",
  email: "Use a valid email address.",
  password: "Use at least 8 characters with uppercase, lowercase, and a number.",
  currentPassword: "Current password is required to change your password.",
  sharePassword: "Use 6-64 characters for shared-link protection.",
};

export const getApiError = (error) => {
  if (error?.response?.data?.errors?.length) {
    return error.response.data.errors.map((item) => item.message).join(", ");
  }

  return error?.response?.data?.message || "Something went wrong. Please try again.";
};
