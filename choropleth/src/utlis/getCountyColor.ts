export const getCountyColor = (rate: number) => {
    if (rate < 3) {
        return '#e5f5e0'
    } else if (rate >= 3 && rate < 12) {
        return '#e5f5e0'
    } else if (rate >= 12 && rate < 21) {
        return '#c7e9c0'
    } else if (rate >= 21 && rate < 30) {
        return '#a1d99b'
    } else if (rate >= 30 && rate < 39) {
        return '#74c476'
    } else if (rate >= 39 && rate < 48) {
        return '#41ab5d'
    } else if (rate >= 48 && rate < 57) {
        return '#238b45'
    } else if (rate >= 57) {
        return '#006d2c'
    }
}

export default getCountyColor
