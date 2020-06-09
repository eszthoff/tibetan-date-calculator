const getDateStr = (date: Date): string => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const dayNr = date.getDate();

  return `${year}-${(`0${month}`).slice(-2)}-${(`0${dayNr}`).slice(-2)}`;
};

export default getDateStr;
