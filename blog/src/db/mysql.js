const mysql = require('mysql')
const {MYSQL_CONF} = require('../conf/db.js')

// 连接数据库
const con = mysql.createConnection(MYSQL_CONF)

// 连接数据库
con.connect()

// 执行sql语句
function exec(sql) {
    return new Promise((resolve, reject) => {
        con.query(sql, (err, result) => {
            if (err) {
                reject(err)
                return
            }
            return resolve(result)
        })
    })
}

module.exports = {
    exec,
    escape: mysql.escape
}