const getQuarter = (d: Date) => {
  d = d || new Date()
  const m = Math.floor(d.getMonth()/3) + 2
  return m > 4? m - 4 : m
}

export default getQuarter
