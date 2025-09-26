export const getWeekRange = (date: Date = new Date()) => {
  const current = new Date(date);
  const day = current.getUTCDay();
  const diffToMonday = (day + 6) % 7;
  const weekStart = new Date(Date.UTC(current.getUTCFullYear(), current.getUTCMonth(), current.getUTCDate() - diffToMonday));
  const weekEnd = new Date(weekStart);
  weekEnd.setUTCDate(weekStart.getUTCDate() + 7);

  return {
    weekStart,
    weekEnd,
    key: `${weekStart.getUTCFullYear()}-W${String(getWeekNumber(current)).padStart(2, '0')}`
  };
};

export const getWeekNumber = (date: Date) => {
  const tmpDate = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  const dayNum = tmpDate.getUTCDay() || 7;
  tmpDate.setUTCDate(tmpDate.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(tmpDate.getUTCFullYear(), 0, 1));
  return Math.ceil(((tmpDate.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
};
