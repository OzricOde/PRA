const config = require('./config')
const env = require('../env')
const mysql = require('mysql')

const checkDatabase = (databaseName, tableName) => {
    console.log("****************checking database*************************")
    return new Promise((resolve, reject) => {
        const con = mysql.createConnection(env.env);        
        con.connect((err) => {
            if(err) reject(err);
            const sql = `CREATE DATABASE IF NOT EXISTS ${databaseName}`;
            con.query(sql, (err) => {
                if(err) reject(err)
                con.end((err) => {
                    if(err) reject(err);
                    resolve("database checked")
                })
            })
        }) 
    })    
}

module.exports = {
    checkDatabase
}