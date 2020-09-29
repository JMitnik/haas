const filterDate = (startDate?: Date | null, endDate?: Date | null): any[] | [] => {
  let dateRange: any[] | [] = [];

  if (startDate && !endDate) {
    dateRange = [
      { createdAt: { gte: startDate } },
    ];
  } else if (!startDate && endDate) {
    dateRange = [
      { createdAt: { lte: endDate } },
    ];
  } else if (startDate && endDate) {
    dateRange = [
      { createdAt: { gte: startDate } },
      { createdAt: { lte: endDate } },
    ];
  }

  return dateRange;
};

export default filterDate;
