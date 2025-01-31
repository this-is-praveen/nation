export const getPreferredLabeledData = () => {
  const envData = import.meta.env?.VITE_LABELS
    ? JSON.parse(import.meta.env?.VITE_LABELS)
    : null;

  return JSON.parse(sessionStorage.getItem("labels")) || envData || [];
};

export const getApiBaseUrl = () => {
  return (
    sessionStorage.getItem("api_base_url") ||
    import.meta.env?.VITE_API_BASE_URL ||
    "http://localhost:5000/"
  );
};
