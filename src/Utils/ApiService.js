import axios from "axios";

// Base API URL
const API_BASE_URL = " https://loan-finder-identification-fred.trycloudflare.com/api";

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Fetch Active Jobs (No Auth Required)
export const fetchActiveJobs = async (page = 0, size = 40) => {
  try {
    const response = await api.get("/no-auth/jobs", {
      params: { page, size },
    });

    return response.data?.payLoad?.data || [];
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return [];
  }
};
export const applyJob = async (payload) => {
  try {
    const response = await api.post("/no-auth/apply-job", { payLoad: payload });
    return response.data;
  } catch (error) {
    console.error("Error applying job:", error);
    throw error;
  }
};
