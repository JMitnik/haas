const isValidDate = (dateString: string): boolean => {
  const date = new Date(dateString);

  return date instanceof Date && !Number.isNaN(date.getSeconds());
};

export default isValidDate;
