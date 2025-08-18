import { BASE_URL } from "@/constants";

export const clearUserSession = () => {
  localStorage.removeItem("token");
  // localStorage.removeItem("userData")
};

export const transformImageUrl = (url: string) => {
  return `${BASE_URL}${url}`;
};
