function generateInstance(length){
  let array = [];
  for(let i=0; i<length; i++){
    array.push(Math.floor(Math.random()*i)+1);
  }
  return array;
}

module.exports = generateInstance