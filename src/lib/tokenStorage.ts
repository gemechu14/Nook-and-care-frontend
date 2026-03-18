const ACCESS_KEY = "access_token";
const REFRESH_KEY = "refresh_token";

export const tokenStorage = {
  getAccess: () =>
    typeof window !== "undefined" ? localStorage.getItem(ACCESS_KEY) : null,
  setAccess: (t: string) => localStorage.setItem(ACCESS_KEY, t),
  getRefresh: () =>
    typeof window !== "undefined" ? localStorage.getItem(REFRESH_KEY) : null,
  setRefresh: (t: string) => localStorage.setItem(REFRESH_KEY, t),
  clear: () => {
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(REFRESH_KEY);
  },
};







