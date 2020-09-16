
const labels = [100,1000,10000,100000,1000000].slice(0,5);
const results = 
[{"length":100,"radix":[0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,1,0,1,0,0],"merge":[0,0,0,0,1,0,1,0,0,0,0,0,0,1,0,0,0,0,0,1],"insert":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]},{"length":1000,"radix":[1,0,1,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,1],"merge":[1,2,1,1,1,1,1,2,1,1,2,1,1,1,1,1,1,4,1,1],"insert":[1,0,0,1,1,0,0,0,1,0,0,1,0,0,0,0,1,0,0,0]},{"length":10000,"radix":[2,2,1,1,1,0,1,1,0,1,1,1,2,1,1,1,1,1,1,1],"merge":[15,13,12,12,12,12,11,12,12,12,13,12,11,12,12,12,13,11,12,12],"insert":[33,33,33,33,32,34,33,32,33,32,33,33,33,33,33,33,33,34,33,33]},{"length":100000,"radix":[17,17,18,17,18,17,17,18,17,18,17,17,17,17,17,18,18,18,17,17],"merge":[881,878,876,881,879,882,880,879,876,881,875,879,885,877,877,882,876,884,881,881],"insert":[3260,3253,3246,3274,3253,3246,3255,3256,3256,3249,3255,3281,3258,3259,3251,3262,3244,3254,3268,3259]},{"length":1000000,"radix":[297,308,326,313,312,326,325,313,327,313,324,318,325,324,321,323,322,324,323,323],"merge":[136319,135612,136410,181106,147614,148364,180090,135541,136978,155334,135487,147752,136684,155285,135988,147910,154700,136122,148384,147748],"insert":[328296,329177,328747,328217,328652,328683,328804,328275,328877,329728,328495,328746,328301,328238,328867,328284,328256,328691,328660,328014]}]
const datasetMax = ['merge','radix','insert']
  .map((label,index)=> ({
    label: `${label}_MAX`, 
    data: results.slice(0,5).map(item=> Math.max(...item[label])),
    borderColor: ['rgba(75, 192, 192, 1)','rgba(12, 12, 12, 1)','rgba(45, 45, 192, 1)'][index],
    backgroundColor: ['rgba(75, 192, 192, 0.2)','rgba(111, 111, 111, 0.1)','rgba(1, 45, 192, 0.1)'][index],
  }))

console.table(
  datasetMax
)

const datasetMin = ['merge','radix','insert']
  .map((label,index)=> ({
    label: `${label}_MIN`, 
    data: results.slice(0,5).map(item=> Math.min(...item[label])),
    borderColor: ['rgba(75, 192, 192, 1)','rgba(12, 12, 12, 1)','rgba(45, 45, 192, 1)'][index],
    backgroundColor: ['rgba(75, 192, 192, 0.2)','rgba(111, 111, 111, 0.1)','rgba(1, 45, 192, 0.1)'][index],
  }))

const datasetRate = ['merge','radix','insert']
  .map((label,index)=> ({
    label: `${label}_RATE`, 
    data: results.slice(0,5).map(item=> item[label].reduce((acc,item)=> acc+item ,0)/20),
    borderColor: ['rgba(75, 192, 192, 1)','rgba(12, 12, 12, 1)','rgba(45, 45, 192, 1)'][index],
    backgroundColor: ['rgba(75, 192, 192, 0.2)','rgba(111, 111, 111, 0.1)','rgba(1, 45, 192, 0.1)'][index],
  }))

var ctx = document.getElementById("myChart").getContext('2d');
var myChart = new Chart(ctx, {
  type: 'line',
  data: {
    labels,
    datasets: [...datasetMin,... datasetMax, ...datasetRate],
  },
});
