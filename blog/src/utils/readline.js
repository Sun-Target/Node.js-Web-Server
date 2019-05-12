const fs = require('fs')
const path = require('path')
const readline = require('readline')

const fullName = path.join(__dirname, '../', '../', 'logs', 'access.log')

const readStream = fs.createReadStream(fullName)

const rl = readline.createInterface({
    input: readStream
})

let chromeNum = 0
let sum = 0

rl.on('line', (lineData) => {
    if (!lineData) {
        return
    }

    sum++

    let arr = lineData.split('--')

    if (arr[2] && arr[2].indexOf('Chrome') != -1) {
        chromeNum++
    }
})

rl.on('close', () => {
    console.log('占比', chromeNum/sum)
})