export const getPreferredLabeledData = () =>
  JSON.parse(sessionStorage.getItem("labels")) || [];

export const getApiBaseUrl = () => {
  return (
    sessionStorage.getItem("api_base_url") ||
    import.meta.env?.VITE_API_BASE_URL ||
    "http://localhost:5000/"
  );
};
