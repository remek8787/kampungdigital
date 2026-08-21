export const APP_BASE_PATH = (process.env.NEXT_PUBLIC_BASE_PATH || "/kampungdigital").replace(/\/$/, "");
export const appPath = (path = "/") => {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${APP_BASE_PATH}${normalized === "/" ? "" : normalized}` || "/";
};
