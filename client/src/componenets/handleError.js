 export function handleError(error) {
  return (
    error.response?.data?.message ||
    error.message ||
    "Something went wrong. Try again."
  );
}
