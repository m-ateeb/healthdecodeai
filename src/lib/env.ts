// Environment variable validation utility
export function validateEnvVars() {
  const required = [
    'MONGODB_URI',
    'JWT_SECRET',
    'RESEND_API_KEY',
    'RESEND_FROM_EMAIL'
  ];

  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.error('Missing required environment variables:', missing);
    throw new Error(`Missing environment variables: ${missing.join(', ')}`);
  }

  // Validate JWT secret length
  if (process.env.JWT_SECRET && process.env.JWT_SECRET.length < 32) {
    console.warn('JWT_SECRET should be at least 32 characters long for security');
  }

  console.log('Environment variables validated successfully');
}

export function getEnvVar(key: string, defaultValue?: string): string {
  const value = process.env[key];
  if (!value && !defaultValue) {
    throw new Error(`Environment variable ${key} is required`);
  }
  return value || defaultValue!;
}
