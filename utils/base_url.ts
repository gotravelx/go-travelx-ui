export const getBaseUrl = () => {
  if (typeof window !== "undefined") {
    const { hostname } = window.location;

    if (hostname.includes("dev")) {
      return "https://dev.gotravelx.com/Chain4Travel/flifo/api";
    } else if (hostname.includes("prd")) {
      return "https://gotravelx.com/Chain4Travel/flifo/api";
    } else {
      return "http://localhost:3000";
    }
  } else {
    return "https://gotravelx.com/Chain4Travel/flifo/api";
  }
};
