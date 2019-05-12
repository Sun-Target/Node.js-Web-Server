const redis = require('redis')
const {REDIS_CONF} = require('../conf/db.js')
console.log(REDIS_CONF)
const redisClient = redis.createClient(REDIS_CONF.port, REDIS_CONF.host)

redisClient.on('error', err => {
    console.log(err)
})

function set (key, val) {
    if (typeof val === 'object') {
        val = JSON.stringify(val)
    }
    redisClient.set(key, val, redis.print)
}

function get (key) {
    let promise = new Promise((resolve, reject) => {
        redisClient.get(key, (err, val) => {
            if (err) {
                reject(err)
                return
            }

            if (val === null) {
                resolve(null)
                return
            }

            try{
                resolve(JSON.parse(val))
            } catch (err) {
                resolve(val)
            }
            console.log('val ', val)
        })
    })
    return promise
}
set('hahaha', {})
get('hahaha').then((sessionData) => {
    console.log(sessionData)
})
module.exports = {
    set,
    get
}