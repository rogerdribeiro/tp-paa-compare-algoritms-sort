module.exports = function getInstances(numInstances=5){
  const instances = []
  for(let i=0; i<numInstances; i++){
    instances[i] = [];
    for(let j=1; j<=20; j++){
      const intance = require(`../instances/${i+1}/${j}.json`);
      instances[i].push(intance);
    }
  }
  return instances;
}