const http = require('http')
const querystring = require('querystring')

const server = http.createServer((req, res) => {
    let method = req.method
    let path = req.path
    let url = req.url
    let query = querystring.parse(url.split('?')[1])
    
    let reqData = {
        method,
        path,
        url,
        query
    }

    if (method === 'GET') {
        res.end(
            JSON.stringify(reqData)
        )
    }

    if (method === 'POST') {
        req.on('data', chunk => {
            reqData.postData  += chunk.toSring()
        })
        req.on('end', () => {
            res.end(
                JSON.stringify(reqData)
            )
        })
    }
})

server.listen(8000)
console.log('OK')