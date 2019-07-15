const mysql = require('mysql');
const config = require('./config')
const env = require('../env')

const checkTable = (frontData) => {
    return new Promise ((resolve, reject) => {
        console.log("**************checking table**************")
        var con = env.env;
        const databaseName = config.resolveDbName(frontData);
        const tableName = config.resolveTableName(frontData);
        con.database = databaseName;
        con = mysql.createConnection(env.env);
        con.connect((err) => {        
            const sql = `CREATE TABLE ${tableName}( USN VARCHAR(20), subCode VARCHAR(20), ia INT, ex INT, tot INT, grade VARCHAR(5))`;
            con.query(sql, (err, result) => {
                if(err){
                    if(err.code === 'ER_TABLE_EXISTS_ERROR') resolve('table exists')
                    else reject(err);
                }
                console.log("Table created");
                con.end((err) => {
                    if(err) reject(err);
                    resolve("database set up")                            
                });
            });
        })    
    })
}

module.exports = {
    checkTable
}