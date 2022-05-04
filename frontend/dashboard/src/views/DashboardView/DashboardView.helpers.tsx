export const getDayGreeting = () => {
  const date = new Date();
  const hours = date.getHours();
  if (hours < 12) {
    return 'good_morning_user';
  }

  if (hours < 18) {
    return 'good_afternoon_user';
  }

  return 'good_evening_user';
};
