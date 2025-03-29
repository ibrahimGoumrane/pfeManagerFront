const LOCAL_ADDRESS = 'http://localhost:8000/api';
const PRODUCTION_ADDRESS = 'https://artishare-backend-oooc9.ondigitalocean.app/api';
export const devEnv = 'development' === process.env.NODE_ENV;
export const serverAddress = devEnv ? LOCAL_ADDRESS : PRODUCTION_ADDRESS;
export const imgAddress = 'https://artishare-imgs.lon1.digitaloceanspaces.com';