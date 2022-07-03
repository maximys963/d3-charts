const decimalAdjust = (type: string, value: number, exp: number) => {
    // Если степень не определена, либо равна нулю...
    if (typeof exp === 'undefined' || +exp === 0) {
        // @ts-ignore
        return Math[type](value);
    }
    value = +value;
    // @ts-ignore
    exp = +exp;
    // Если значение не является числом, либо степень не является целым числом...
    if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
        return NaN;
    }
    // Сдвиг разрядов
    // @ts-ignore
    value = value.toString().split('e');
    // @ts-ignore
    value = Math[type](+(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp)));
    // Обратный сдвиг
    // @ts-ignore
    value = value.toString().split('e');
    // @ts-ignore
    return +(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp));
}

export default decimalAdjust