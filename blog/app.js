const handleBlogRouter = require('./src/router/blog.js')
const handleUserRouter = require('./src/router/user.js')
const querystring = require('querystring')
const {set, get} = require('./src/db/redis.js')
const {access} = require('./src/utils/log.js')
// session数据
const SESSION_DATA = {}
// 设置cookie过去时间
const setCookieExpires = () => {
    const date = new Date()
    date.setTime(date.getTime() + (24 * 60 * 60 * 1000))
    return date.toGMTString()
}

const getPostData = (req) => {
    const promise = new Promise ((resolve, reject) => {

        if (req.method !== 'POST') {
            resolve({})
            return
        }

        if (req.headers['content-type'] !== 'application/json') {
            resolve({})
            return
        }

        let postData = ''
        req.on('data', chunk => {
            postData += chunk.toString()
            console.log('data ', postData)
        })
        
        req.on('end', () => {
            if (!postData) {
                resolve({})
                return
            } 
            console.log('end ', postData)
            resolve(
                JSON.parse(postData)
            )
        })
    })
    
    return promise
}
const app = (req, res) => {
    // 写入日志
    access(`
        ${req.method} -- ${req.url} -- ${req.headers['user-agent']} -- ${Date.now()}
    `)

    let url = req.url
    req.path = url.split('?')[0]

    // 设置传输的数据格式
    res.setHeader('Content-type', 'application/json')
    // 获取get参数
    req.query = querystring.parse(url.split('?')[1])
    
     // 获取cookie
    req.cookie = {}
    const cookieStr = req.headers.cookie || ''
    cookieStr.split(';').forEach(item => {
        if (!item) {
            return
        }
        const arr = item.split('=')
        const key = arr[0].trim()
        const val = arr[1].trim()
        req.cookie[key] = val
    })
    console.log('cookie is ', req.headers.cookie)
    // 处理session
    // let userId = req.cookie.userid
    // let needSetCookie = false
    // if (userId) {
    //     if (!SESSION_DATA[userId]) {
    //         SESSION_DATA[userId] = {}
    //     }
    // } else {
    //     needSetCookie = true
    //     userId = `${Date.now()}_${Math.random()}` 
    //     SESSION_DATA[userId] = {}
    // }

    // req.session = SESSION_DATA[userId]
    let userId = req.cookie.userid
    let needSetCookie = false
    if (!userId) {
        needSetCookie = true
        userId = `${Date.now()}_${Math.random()}`
        set(userId, {})
        console.log('进来了')
    }
    
    req.sessionId = userId
    get(req.sessionId).then(sessionData => {
        if (sessionData == null) {
            // 设置redis的session
            set(req.sessionId, {})
            // 设置session
            req.session = {}
        } else {
            req.session = sessionData
        }

        // 处理 post 数据
        return getPostData(req)
    })
    .then(postData => {
        console.log('data is ', postData)
        req.body = postData
        
        const blogResult = handleBlogRouter(req, res)
        console.log('blogResult is ', blogResult)
        if (blogResult) {
            blogResult.then(blogData => {
                if (needSetCookie) {
                    res.setHeader('Set-Cookie', `userid=${userId}; path=/; httpOnly; expires=${setCookieExpires()};`)
                }
                res.end(
                    JSON.stringify(blogData)
                )
            })
            return
        }
        
        const userResult = handleUserRouter(req, res)
        if (userResult) {
            userResult.then(userData => {
                if (needSetCookie) {
                    res.setHeader('Set-Cookie', `userid=${userId}; path=/; httpOnly; expires=${setCookieExpires()};`)
                }
                res.end(
                    JSON.stringify(userData)
                )
            })
            return
        }

        // 未命中的路由 返回404
        res.writeHead(404, {"Content-type":"text/plain"})
        res.write("404 Not Found\n")
        res.end()
    })
    
}

module.exports = app