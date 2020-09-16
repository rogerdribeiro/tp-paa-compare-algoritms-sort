const insertSort = require('../algorithms/insertSort')
const mergeSort = require('../algorithms/mergeSort')
const radixSort = require('../algorithms/radixSort')

module.exports = ()=> ({
  radix: radixSort,
  merge:mergeSort,
  insert: insertSort
})