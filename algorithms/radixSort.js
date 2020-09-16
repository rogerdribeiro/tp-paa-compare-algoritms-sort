function radixSort(arr) {
  const max = getMax(arr);
  for (let i = 0; i < max; i++) {
    let buckets = Array.from({ length: 10 }, () => [ ])
    for (let j = 0; j < arr.length; j++) {
      buckets[getPosition(arr[ j ], i)].push(arr[ j ]);
    }
    arr = [ ].concat(...buckets);
  }
  return arr
}

function getPosition(num, place){
  return  Math.floor(Math.abs(num)/Math.pow(10,place))% 10
}

function getMax(arr) {
  let max = 0;
  for (let num of arr) {
    if (max < num.toString().length) {
      max = num.toString().length
    }
  }
  return max
}

module.exports = radixSort;