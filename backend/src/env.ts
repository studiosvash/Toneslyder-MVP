import dotenv from 'dotenv';

dotenv.config();

export interface EnvConfig {
  port: number;
  providerMode: 'mock' | 'real';
  apiKey: string;
  modelId: string;
  apiBase: string;
  httpsEnable: boolean;
  httpsCertPath: string;
  httpsKeyPath: string;
}

export const env: EnvConfig = {
  port: parseInt(process.env.PORT || '8787', 10),
  providerMode: (process.env.PROVIDER_MODE as 'mock' | 'real') || 'mock',
  apiKey: process.env.API_KEY || '',
  modelId: process.env.MODEL_ID || 'gpt-4o-mini',
  apiBase: process.env.API_BASE || 'https://api.openai.com/v1',
  httpsEnable: process.env.HTTPS_ENABLE === 'true',
  httpsCertPath: process.env.HTTPS_CERT_PATH || './certs/localhost.pem',
  httpsKeyPath: process.env.HTTPS_KEY_PATH || './certs/localhost-key.pem',
};
