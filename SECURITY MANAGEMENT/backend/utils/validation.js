export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone) => {
  const phoneRegex = /^[0-9]{10,}$/;
  return phoneRegex.test(phone.replace(/\D/g, ''));
};

export const validatePassword = (password) => {
  return password && password.length >= 6;
};

export const validateDeviceId = (deviceId) => {
  return deviceId && deviceId.trim().length > 0;
};

export const validateStudentId = (studentId) => {
  return studentId && studentId.trim().length > 0;
};

export const validateOfficerId = (officerId) => {
  return officerId && officerId.trim().length > 0;
};

export const validateSerialNumber = (serialNumber) => {
  return serialNumber && serialNumber.trim().length > 0;
};

export const validateDeviceType = (deviceType) => {
  const validTypes = ['laptop', 'desktop', 'tablet', 'mobile'];
  return validTypes.includes(deviceType?.toLowerCase());
};

export const validateStatus = (status) => {
  return ['login', 'logout'].includes(status);
};
