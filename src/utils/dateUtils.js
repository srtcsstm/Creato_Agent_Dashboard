// src/utils/dateUtils.js

/**
 * Parses a date string into a Date object.
 * It first tries standard Date parsing, then falls back to "DD-MM-YYYY HH:mm" format.
 * @param {string} dateStr - The date string to parse.
 * @returns {Date|null} A Date object if parsing is successful, otherwise null.
 */
export const parseDDMMYYYYHHMM = (dateStr) => {
  if (!dateStr) return null;

  // 1. Try parsing as a standard ISO or recognized date string first
  // This handles formats like "YYYY-MM-DD HH:mm:ss+00:00" or "YYYY-MM-DDTHH:mm:ss.sssZ"
  try {
    const standardDate = new Date(dateStr);
    if (!isNaN(standardDate.getTime())) {
      return standardDate;
    }
  } catch (e) {
    // Standard parsing failed, continue to custom parsing
  }

  // 2. If standard parsing fails, try custom "DD-MM-YYYY HH:mm" format
  const parts = dateStr.match(/(\d{2})-(\d{2})-(\d{4}) (\d{2}):(\d{2})/);
  if (parts) {
    const [, day, month, year, hours, minutes] = parts;
    // Month is 0-indexed in JavaScript Date objects
    const date = new Date(year, month - 1, day, hours, minutes);
    // Check if the date is valid (e.g., "31-02-2023" would result in March 2)
    if (date.getFullYear() == year && date.getMonth() == (month - 1) && date.getDate() == day) {
      return date;
    }
  }
  
  console.warn(`Failed to parse date string: "${dateStr}". Returning null.`);
  return null;
};

/**
 * Formats a Date object into "DD-MM-YYYY HH:mm" string.
 * @param {Date|string} dateInput - The Date object or ISO date string to format.
 * @returns {string} The formatted date string (e.g., "25-12-2023 14:30") or "N/A".
 */
export const formatDateToDDMMYYYYHHMM = (dateInput) => {
  let dateObj;
  if (typeof dateInput === 'string') {
    dateObj = parseDDMMYYYYHHMM(dateInput); // Use the robust parser
  } else if (dateInput instanceof Date) {
    dateObj = dateInput;
  } else {
    return 'N/A';
  }

  if (dateObj && !isNaN(dateObj.getTime())) {
    const day = String(dateObj.getDate()).padStart(2, '0');
    const month = String(dateObj.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
    const year = dateObj.getFullYear();
    const hours = String(dateObj.getHours()).padStart(2, '0');
    const minutes = String(dateObj.getMinutes()).padStart(2, '0');
    return `${day}-${month}-${year} ${hours}:${minutes}`;
  }
  return 'N/A';
};

/**
 * Formats a Date object into "YYYY-MM-DD" string for HTML date inputs.
 * @param {Date|string} dateInput - The Date object or date string to format.
 * @returns {string} The formatted date string (e.g., "2023-12-25") or empty string.
 */
export const formatDateToYYYYMMDD = (dateInput) => {
  let dateObj;
  if (typeof dateInput === 'string') {
    dateObj = parseDDMMYYYYHHMM(dateInput); // Use the robust parser
  } else if (dateInput instanceof Date) {
    dateObj = dateInput;
  } else {
    return '';
  }

  if (dateObj && !isNaN(dateObj.getTime())) {
    return dateObj.toISOString().split('T')[0];
  }
  return '';
};

/**
 * Formats a Date object into "YYYY-MM-DDTHH:mm" string for HTML datetime-local inputs.
 * @param {Date|string} dateInput - The Date object or date string to format.
 * @returns {string} The formatted date string (e.g., "2023-12-25T14:30") or empty string.
 */
export const formatDateToYYYYMMDDTHHMM = (dateInput) => {
  let dateObj;
  if (typeof dateInput === 'string') {
    dateObj = parseDDMMYYYYHHMM(dateInput); // Use the robust parser
  } else if (dateInput instanceof Date) {
    dateObj = dateInput;
  } else {
    return '';
  }

  if (dateObj && !isNaN(dateObj.getTime())) {
    // toISOString returns UTC, we need local time for datetime-local input
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    const hours = String(dateObj.getHours()).padStart(2, '0');
    const minutes = String(dateObj.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }
  return '';
};

/**
 * Formats a Date object into an ISO 8601 string (YYYY-MM-DDTHH:mm:ss.sssZ) for NocoDB.
 * @param {Date|string} dateInput - The Date object or date string to format.
 * @returns {string} The ISO 8601 formatted string or empty string.
 */
export const formatDateToISOString = (dateInput) => {
  let dateObj;
  if (typeof dateInput === 'string') {
    dateObj = parseDDMMYYYYHHMM(dateInput); // Use the robust parser
  } else if (dateInput instanceof Date) {
    dateObj = dateInput;
  } else {
    return '';
  }

  if (dateObj && !isNaN(dateObj.getTime())) {
    return dateObj.toISOString();
  }
  return '';
};

/**
 * Calculates a date 'days' ago from today and returns it in YYYY-MM-DD format.
 * @param {number} days - The number of days to go back.
 * @returns {string} The date in 'YYYY-MM-DD' format.
 */
export const getStartDateForDaysAgo = (days) => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return formatDateToYYYYMMDD(date);
};
