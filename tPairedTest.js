
// Welch t-test:  ported from C# code
// - https://msdn.microsoft.com/ja-jp/magazine/mt620016.aspx

// ACM Algorithm #209 Gauss
const P0 = [
    +0.000124818987,
    -0.001075204047,
    +0.005198775019,
    -0.019198292004,
    +0.059054035642,
    -0.151968751364,
    +0.319152932694,
    -0.531923007300,
    +0.797884560593,
];
const P1 = [
    -0.000045255659,
    +0.000152529290,
    -0.000019538132,
    -0.000676904986,
    +0.001390604284,
    -0.000794620820,
    -0.002034254874,
    +0.006549791214,
    -0.010557625006,
    +0.011630447319,
    -0.009279453341,
    +0.005353579108,
    -0.002141268741,
    +0.000535310849,
    +0.999936657524,
];
function pol(x, c) {
    return c.reduce((r, c) => r * x + c, 0);
}

// integral amount of ND(mean=0, SD=1) returns between 0 and 1
// - gauss(z) = (1 + erf(z * 2**-0.5))/2
function gauss(z) {
    if (z === 0) return 0.5;
    const y = Math.abs(z) / 2;
    const p = y >= 3 ? 1 : y < 1 ? pol(y * y, P0) * y * 2 : pol(y - 2, P1);
    return z > 0 ? (1 + p) / 2 : (1 - p) / 2;
}
//console.log(norm(-3)); // ~~ 0.0013
//console.log(norm(-2)); // ~~ 0.023
//console.log(norm(-1)); // ~~ 0.16


// ACM Algorithm #395 (student t-distribution: df as double)
// t-dist : distribution for average of (df+1)-samples from ND(mean=0, SD=1)
// student(t, df) returns
//   integral probability of both side area (< -t) and (t <) of t-dist(df)
const Ps = [-0.4, -3.3, -24, -85.5];
function student(t, df) {
    const a = df - 0.5;
    const b = 48 * a * a;
    const y0 = (t * t) / df;
    const y = a * (y0 > 1e-6 ? Math.log(y0 + 1) : y0);
    const s = (pol(y, Ps) / (0.8 * y * y + 100 + b) + y + 3) / b + 1;
    return 2 * gauss(-s * (y ** 0.5));
}
//console.log(student(1, 1000)); // ~~ 0.32
//console.log(student(2, 1000)); // ~~ 0.046
//console.log(student(3, 1000)); // ~~ 0.0027

// welch's t-test
function tTest(x, y) {
    console.assert(x.length > 1 && y.length > 1);
    const nX = x.length, nY = y.length, nX1 = nX - 1, nY1 = nY - 1;
    const meanX = x.reduce((r, v) => r + v, 0) / nX;
    const meanY = y.reduce((r, v) => r + v, 0) / nY;
    const varX = x.reduce((r, v) => r + (v - meanX) ** 2, 0) / nX1;
    const varY = y.reduce((r, v) => r + (v - meanY) ** 2, 0) / nY1;
    // see: t and nu of https://en.wikipedia.org/wiki/Welch%27s_t-test
    const avX = varX / nX, avY = varY / nY;
    const t = (meanX - meanY) / ((avX + avY) ** 0.5);
    const df = ((avX + avY) ** 2) / ((avX ** 2) / nX1 + (avY ** 2) / nY1);
    const p = student(t, df);
    return {p, t, df, meanX, meanY};
}

// example sets
const x = [88, 77, 78, 85, 90, 82, 88, 98, 90];
const y = [81, 72, 67, 81, 71, 70, 82, 81];
// console.log(tTest(x, y));
//{ p: 0.003793077554352986,
//  t: 3.4232952676183435,
//  df: 14.936596725791068,
//  meanX: 86.22222222222223,
//  meanY: 75.625 }
// (0.3% when x and y are from same population)

// student t-test
function tTest0(x, y) {
    console.assert(x.length === y.length && x.length > 1);
    const n = x.length, n1 = n - 1;
    const meanX = x.reduce((r, v) => r + v, 0) / n;
    const meanY = y.reduce((r, v) => r + v, 0) / n;
    const varX = x.reduce((r, v) => r + (v - meanX) ** 2, 0) / n1;
    const varY = y.reduce((r, v) => r + (v - meanY) ** 2, 0) / n1;
    // see: https://en.wikipedia.org/wiki/Student%27s_t-test#Equal_sample_sizes,_equal_variance
    const t = (meanX - meanY) / (((varX + varY) / n) ** 0.5);
    const df = n1 * 2; // as 2n-2
    const p = student(t, df);
    return {p, t, df, meanX, meanY};
}

// samples from
// - http://www.obihiro.ac.jp/~masuday/resources/stat/r_t-test01.html
const x0 = [57, 120, 101, 137, 119, 117, 104, 73, 53, 68, 118];
const y0 = [89,  30,  82,  50,  39,  22,  57, 32, 96, 31,  88];
// console.log(tTest0(x0, y0));
//{ p: 0.003000142155019314,
//  t: 3.376406863007222,
//  df: 20,
//  meanX: 97,
//  meanY: 56 }
// (0.3% when x and y are from same population)

// paired t-test
function tPairedTest(x, y) {
    console.assert(x.length === y.length && x.length > 1);
    const n = x.length, n1 = n - 1;
    const d = x.map((v, i) => v - y[i]);
    const meanD = d.reduce((r, v) => r + v, 0) / n;
    const varD = d.reduce((r, v) => r + (v - meanD) ** 2, 0) / n1;
    const t = meanD / ((varD / n) ** 0.5);
    const df = n1;
    const p = student(t, df);
    return {p, t, df, meanD, varD};
}

const results = [{"length":100,"radix":[0,1,0,0,0,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0],"merge":[0,0,0,1,0,0,0,1,0,0,0,1,0,1,0,0,0,0,0,0],"insert":[0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0]},{"length":1000,"radix":[2,0,2,1,0,0,1,1,1,1,0,1,0,0,0,0,0,0,1,0],"merge":[1,3,2,2,2,1,1,1,1,1,2,1,1,1,1,1,1,6,1,1],"insert":[1,0,1,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0]},{"length":10000,"radix":[2,2,1,1,1,1,2,1,1,1,1,1,1,1,1,1,1,1,1,1],"merge":[19,15,13,12,13,13,18,14,12,14,15,12,13,13,12,12,12,12,13,15],"insert":[34,34,34,35,34,40,34,34,35,34,35,35,34,34,35,35,35,34,34,35]},{"length":100000,"radix":[20,19,21,26,22,20,20,20,21,19,22,20,20,23,21,23,20,21,23,17],"merge":[910,880,933,923,933,914,892,898,907,894,904,909,890,901,895,893,889,907,893,936],"insert":[3441,3279,3531,3277,3257,3297,3278,3277,3265,3271,3273,3254,3272,3261,3276,3280,3260,3262,3285,3274]},{"length":1000000,"radix":[303,327,331,316,312,338,324,313,322,316,323,326,326,319,324,319,325,320,326,319],"merge":[182270,139558,140816,184715,151746,152299,142055,139175,139361,158535,141210,151230,139471,158882,139737,152920,159187,140558,138757,152503],"insert":[333098,332386,332811,332025,331892,331773,332155,332359,332061,332551,331662,332129,331908,332026,332261,331666,333874,331948,332290,331221]}]
// from https://bellcurve.jp/statistics/course/9453.html

let testT = []
results.map(result=> {
  const insert_X_merge =tPairedTest(result.insert, result.merge).p
  const insert_X_radix =tPairedTest(result.insert, result.radix).p
  const merge_X_radix =tPairedTest(result.merge, result.radix).p
  testT.push({
    length: result.length,
    insert_X_merge: insert_X_merge < 0.05 ? 'merge' : insert_X_merge < 0.95 ?  'EMPATE': 'merge',
    insert_X_radix: insert_X_radix  < 0.05 ? 'radix' : insert_X_radix < 0.95 ? 'EMPATE':'radix' ,
    merge_X_radix: merge_X_radix < 0.05 ? 'radix':  merge_X_radix < 0.95 ? 'EMPATE':'radix',
  })
})
console.table(testT)
//{ p: 0.19982695443268672,
//  t: 1.5339299776947408,
//  df: 4,
//  meanD: 10,
//  varD: 212.5 }
//(19% when x1 and y1are from same population.
//  usually "improved from x to y (population changed)" rejected with p > 5%)