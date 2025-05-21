const LOCAL_ADDRESS = "http://localhost:8000/api";
// const PRODUCTION_ADDRESS =
//   "https://walrus-app-65k3h.ondigitalocean.app/api";
export const devEnv = "development" === process.env.NODE_ENV;
export const serverAddress = devEnv ? LOCAL_ADDRESS : LOCAL_ADDRESS;
export const LOCAL_IMAGE = "http://localhost:8000/storage/";
export const NEXT_PUBLIC_IMAGE_PROTOCOL = devEnv ? "http" : "https";
export const NEXT_PUBLIC_IMAGE_HOSTNAME = devEnv
  ? "localhost"
  : "pfemanager.lon1.digitaloceanspaces.com";
export const PRODUCTION_IMAGE = `${NEXT_PUBLIC_IMAGE_PROTOCOL}://${NEXT_PUBLIC_IMAGE_HOSTNAME}/storage/`;
export const imageAddress = devEnv ? LOCAL_IMAGE : PRODUCTION_IMAGE;
