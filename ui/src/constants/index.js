export const getPreferredLabeledData = () =>
  JSON.parse(sessionStorage.getItem("labels")) || [];
