const LOCAL_ADDRESS = 'http://localhost:8000/api';
const PRODUCTION_ADDRESS = 'https://artishare-backend-oooc9.ondigitalocean.app/api';
export const devEnv = 'development' === process.env.NODE_ENV;
export const serverAddress = devEnv ? LOCAL_ADDRESS : PRODUCTION_ADDRESS;
export const LOCAL_IMAGE = 'http://localhost:8000/storage/';
export const PRODUCTION_IMAGE = 'https://artishare-imgs.lon1.digitaloceanspaces.com';
export const imageAddress = devEnv ? LOCAL_IMAGE : PRODUCTION_IMAGE;
