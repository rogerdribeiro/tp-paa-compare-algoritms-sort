const fs = require('fs');
const generateInstance = require('./generateInstance');

function createInstances(instances=5){
  let length = 100;
  for(let i=0; i<instances; i++){
    for(let j=1; j<=20; j++){
      const array = generateInstance(length);
      fs.writeFile(`instances/${i+1}/${j}.json`, JSON.stringify(array), (err)=> err && console.log(err))
    }
    length = length * 10;
    console.log(i+1)
  }
}
createInstances();
module.exports = createInstances