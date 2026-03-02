interface IDate {
  month: number;
  year: number;
}

const today: IDate = {
  month: new Date().getMonth() + 1,
  year: new Date().getFullYear(),
};

export const dateFormatter = (date: string) => {
  if (!date) {
    return today;
  }
  const dateString = new Date(date);
  today.month = dateString.getMonth() + 1;
  today.year = dateString.getFullYear();
  return today;
};
