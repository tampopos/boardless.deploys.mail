import { config } from 'dotenv';

config();
export const getApiKey = () => String(process.env.SENDGRID_API_KEY);
