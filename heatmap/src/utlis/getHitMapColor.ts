const getHitMapColor = (temperature: number) => {
  if(temperature < 3.9){
    return 'rgb(69, 117, 180)'
  } else if(temperature >= 3.9 && temperature < 5){
    return 'rgb(116, 173, 209)'
  } else if(temperature >= 5 && temperature < 6.1){
    return 'rgb(171, 217, 233)'
  } else if(temperature >= 6.1 && temperature < 7.2){
    return 'rgb(224, 243, 248)'
  } else if(temperature >= 7.2 && temperature < 8.3){
    return 'rgb(255, 255, 191)'
  } else if(temperature >= 8.3 && temperature < 9.5){
    return 'rgb(254, 224, 144)'
  } else if(temperature >= 9.5 && temperature < 10.6){
    return 'rgb(253, 174, 97)'
  } else if(temperature >= 10.6 && temperature < 11.7){
    return 'rgb(244, 109, 67)'
  } else {
    return 'rgb(215, 48, 39)'
  }
}

export default getHitMapColor
