import { config } from 'dotenv';

config();
export const getApiKey = () => process.env.SEND_GRID_API_KEY;
