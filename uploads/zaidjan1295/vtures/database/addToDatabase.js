const mysql = require('mysql');
const env = require('../env')
const config = require('./config')

const addToDatabase = (obj, frontData) => {
    var con = env.env;
    const databaseName = config.resolveDbName(frontData);
    const tableName = config.resolveTableName(frontData);
    con.database = databaseName;
    con = mysql.createConnection(env.env);
    con.connect((err) => {
        if(err) throw(err)
        const usn = obj.usn;
        var ia, ex, total, subCode;
        obj.marks.map((temp) => {
            var sql = `SHOW TABLES LIKE '${tableName}';`
            con.query(sql, (err, result)=>{
                // console.log("temp", temp)
                subCode = temp.subCode;
                ia = temp.ia;
                ex = temp.external;
                total = temp.total;
                grade = temp.result;
                if(err) throw err;
                // else if(result.length === 0){
                //     console.log("****************creating table**************");
                //     createTable.createTable(con, frontData)
                //         .then((data) => {
                //             console.log("data", data)
                //             sql = `INSERT INTO ${tableName} VALUES ('${usn}','${subCode}','${ia}', '${ex}','${total}','${grade}')`;
                //             // console.log("query", sql)
                //             con.query(sql, (err, result) => {
                //                 if(err) console.log(err);
                //                 console.log("1 record inserted after creation of table");                
                //             })
                //         })
                //         .catch((err) => console.log(err))
                // }
                else {
                    // console.log("subcode in sql call", subCode)
                    sql = `INSERT INTO ${tableName} VALUES ('${usn}','${subCode}','${ia}', '${ex}','${total}','${grade}')`;
                    con.query(sql, (err, result) => {
                        if(err) console.log(err);
                        // console.log("query", sql)
                        console.log("1 record inserted");                
                    })
                }                
            })
        })
    })
}

module.exports = {
    addToDatabase
}
	