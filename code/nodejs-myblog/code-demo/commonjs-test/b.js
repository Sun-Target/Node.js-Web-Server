const { add, mul } = require('./a')
const _ = require('lodash')

const sum = add(10, 20)
const result = mul(100, 200)

console.log(sum)
console.log(result)

const arr = _.concat([1, 2], 3)
console.log('arr...', arr)
