const configuredApiUrl =
  import.meta.env.VITE_API_URL || "https://e-commerce-back-end-hknq.vercel.app";

export const API_BASE_URL = configuredApiUrl.replace(/\/+$/, "");
