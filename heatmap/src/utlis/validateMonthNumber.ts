const validateMonthNumber = (month: number) => {
  if(month === 12){
    return 0
  }

  return month
}

export default validateMonthNumber;
