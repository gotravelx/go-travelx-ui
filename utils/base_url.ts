export const getBaseUrl = () => {
  if (typeof window !== "undefined") {
    const { hostname } = window.location;

    if (hostname.includes("dev")) {
      return "https://gotravelx.com/";
    } else if (hostname.includes("qa")) {
      return "https://gotravelx.com/";
    } else if (hostname.includes("stg")) {
      return "https://gotravelx.com/";
    } else if (hostname.includes("prd")) {
      return "https://gotravelx.com/";
    } else {
      return "https://gotravelx.com/";
    }
  } else {
    return "https://gotravelx.com/";
  }
};