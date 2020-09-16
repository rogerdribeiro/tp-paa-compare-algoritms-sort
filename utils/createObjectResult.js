const getAlgorithms = require("./getAlgorithms")

module.exports = function createObjectResult(numInstances){
  const obj = []
  const algorithms = Object.entries(getAlgorithms());
  for(let i=0; i<numInstances; i++){
    obj[i] = {
      length: null
    };
    algorithms.map(([key,])=> {
      obj[i][key] = []
    })
  }
  return obj
}