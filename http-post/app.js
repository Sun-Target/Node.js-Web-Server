const http = require('http')
const querystring = require('querystring')

const server = http.createServer((req, res) => {
  if (req.method === 'POST') {
      console.log('content-type: ', req.headers['content-type'])
      let postData = ""
      req.on('data', chunk => {
          postData = chunk.toString()
      })
      req.on('end', () => {
          console.log(postData)
          res.end('Hello World2')
      })
  }  
})

server.listen(8000)
console.log('OK')