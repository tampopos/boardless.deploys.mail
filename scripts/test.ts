import { config } from 'dotenv';

config();
const getApiKey = () => process.env.SEND_GRID_API_KEY;
console.info(getApiKey());
