const fs = require('fs')
const {differenceInMilliseconds}= require('date-fns')
const getIntances = require('./utils/getIntances');
const getAlgorithms = require('./utils/getAlgorithms');
const createObjectResult = require('./utils/createObjectResult');

const collectionInstances = getIntances(5);
const algorithms = Object.entries(getAlgorithms()); 
const results = createObjectResult(collectionInstances.length);

collectionInstances.map((collection,indexCollection)=> { 
  results[indexCollection].length = collection[0].length;
  collection.map((intance,index) => { 
    algorithms.map(([key,sort])=> {
      const startTime = new Date()
      console.log(key,'Coleção: ',indexCollection+1, 'Instância:',index+1);
      const sorted = sort(intance);
      results[indexCollection][key][index] = differenceInMilliseconds(new Date(),startTime);
      return sorted;
    });
  });
})

// console.log(results)
fs.writeFile(`results/${new Date().toISOString()}.json`, JSON.stringify(results), (err)=> err && console.log(err))

