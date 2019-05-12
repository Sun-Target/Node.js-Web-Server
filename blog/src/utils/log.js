const fs = require('fs')
const path = require('path')

function writeLog(writeStream, log) {
    writeStream.write(log + '\n')
}

function createWriteStream(fileName) {
    const fullName = path.join(__dirname, '../', '../', 'logs', fileName)
    const writeStream = fs.createWriteStream(fullName, {
        flags: 'a'
    })

    return writeStream
}

// 写入日志
const accessWriteStream = createWriteStream('access.log')
function access(log) {
    writeLog(accessWriteStream, log)
}

module.exports = {
    access
}