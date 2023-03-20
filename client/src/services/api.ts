import axios from "axios";

// eslint-disable-next-line import/no-anonymous-default-export
export const ApiService = axios.create({
  baseURL: process.env.NEXT_PUBLIC_APP_URL,
  timeout: 5000,
});
