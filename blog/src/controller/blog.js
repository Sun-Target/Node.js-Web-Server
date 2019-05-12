const {exec} = require('../db/mysql.js')
const getList = (author, keyword) => {
    let sql = 'select * from blogs where 1=1 '

    if (author) {
        sql += `and author='${author}' `
    }

    if (keyword) {
        sql += `and title like '%${keyword}%' `
    }

    sql += 'order by createtime desc;'
    console.log(exec(sql).then(res => {
        console.log(res, sql, author, keyword)
    }))
    return exec(sql)
    // return [
    //     {
    //         id:1,
    //         title:'标题A',
    //         content:'内容A',
    //         createTime:"1555823027999",
    //         author:'sunrifa'
    //     },
    //     {
    //         id:2,
    //         title:'标题B',
    //         content:'内容B',
    //         createTime:"1555823070313",
    //         author:'sunrifa'
    //     }
    // ]
}

const getDetail = (id) => {
    let sql = `select * from blogs where id='${id}'`
    return exec(sql).then(row => {
        return row[0]
    })
    // return {
    //     id:1,
    //     title:'标题A',
    //     content:'内容A',
    //     createTime:"1555823027999",
    //     author:'sunrifa'
    // }
}

const newBlog = (blogData = {}) => {
    const title = blogData.title
    const content = blogData.content
    const author = blogData.author
    const createtime = Date.now()

    const sql = `
        insert into blogs (title, content, author, createtime) 
        values('${title}', '${content}', '${author}', ${createtime})
    `

    return exec(sql).then(insertData => {
        return {
            id: insertData.insertId
        }
    })
    // return {
    //     id:3
    // }
}

const updateBlog = (id, postData) => {
    const title = postData.title
    const content = postData.content

    const sql = `update blogs set title='${title}', content='${content}' where id=${id}`

    return exec(sql).then(updateData => {
        if (updateData.affectedRows > 0) {
            return true
        } 
        return false
    })
    // return true
}

const deleteBlog = (id, author) => {
    const sql = `delete from blogs where id=${id} and author='${author}'`
    return exec(sql).then(deleteData => {
        if (deleteData.affectedRows> 0) {
            return true
        }
        return false
    })
    // return true
}

module.exports = {
    getList,
    getDetail,
    newBlog,
    updateBlog,
    deleteBlog
}