import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const logsDir = path.join(__dirname, '../logs');

// Ensure logs directory exists
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

export const logAction = (action, userId, details, status = 'success') => {
  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp,
    action,
    userId,
    details,
    status
  };

  const logFile = path.join(logsDir, `audit-${new Date().toISOString().split('T')[0]}.log`);
  
  fs.appendFileSync(logFile, JSON.stringify(logEntry) + '\n');
};

export const logDeviceAction = (action, deviceId, userId, details) => {
  logAction(`DEVICE_${action}`, userId, { deviceId, ...details });
};

export const logAuthAction = (action, userId, details, status = 'success') => {
  logAction(`AUTH_${action}`, userId, details, status);
};

export const logOfficerAction = (action, officerId, userId, details) => {
  logAction(`OFFICER_${action}`, userId, { officerId, ...details });
};

export const logStudentAction = (action, studentId, userId, details) => {
  logAction(`STUDENT_${action}`, userId, { studentId, ...details });
};
