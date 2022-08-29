const getCategoryColor = (category: string) => {
    if(category === 'Action'){
        return '#a29bfe'
    } else if (category === 'Drama'){
        return '#81ecec'
    } else if (category === 'Adventure'){
        return '#55efc4'
    } else if (category === 'Family'){
        return '#74b9ff'
    } else if (category === 'Animation'){
        return '#fab1a0'
    } else if (category === 'Comedy'){
        return '#ff7675'
    } else if (category === 'Biography') {
        return '#ffeaa7'
    }
}

export default getCategoryColor
