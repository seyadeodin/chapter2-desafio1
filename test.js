const a = [ 1, 2, 3, 4, 5]
const b = [ 2, 3, 5]

function arrayDiff(a, b) {
  const filtered = a.filter(number =>{
    let isDifferent = true 
    for(let item in b){
    if (number == b[item]){
      isDifferent = false
    }
  }
    return isDifferent      
  })  
  return filtered
}

console.log(arrayDiff(a, b))