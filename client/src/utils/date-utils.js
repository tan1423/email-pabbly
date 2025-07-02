import moment from 'moment-timezone';

// Convert date to user's timezone safely
export const convertToTimezone = (dateString, timezone) => {
  if (!dateString || !timezone || !timezone.key) {
    return 'Invalid Date';
  }

  const momentDate = moment(dateString);
  if (!momentDate.isValid()) {
    return 'Invalid Date';
  }

  return momentDate.tz(timezone.key).format('ddd, MMM D, YYYY, h:mm A');
};
