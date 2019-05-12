const fs = require('fs')
const path = require('path')

// function getContentFile (fileName,callback) {
//     const fullFileName = path.resolve(__dirname, 'files', fileName)
//     fs.readFile(fullFileName, (err, data) => {
//         if (err) {
//             console.error(err)
//             return
//         }

//         callback(data.toString())
//     })
// }

// getContentFile('a.json', aData => {
//     console.log('this is a', aData)
//     getContentFile('b.json', bData => {
//         console.log('this is b', bData)
//         getContentFile('c.json', cData => {
//             console.log('this is c', cData)
//         })
//     })
// })

function getContentFile (fileName) {
    console.log(fileName)
    const fullFileName = path.resolve(__dirname, 'files', fileName)
    const promise = new Promise((resolve, reject) => {
        fs.readFile(fullFileName, (err, data) => {
            console.log(err)
            if (err) {
                reject(err)
                return
            }
    
            resolve(
                JSON.parse(data.toString())
            )
        })
    })
    return promise
}

getContentFile('a.json').then(aData => {
    console.log('this aData', aData, aData.next)
    return getContentFile(aData.next)
}).then(bData => {
    console.log('this bData', bData)
    return getContentFile(bData.next)
}).then(cData => {
    console.log('this cData', cData)
}).catch(err => {
    console.log(err)
})