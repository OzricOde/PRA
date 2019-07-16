const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs')
const fse = require('fs-extra')
const dirTree = require('directory-tree')
const mysql = require('mysql')
const ncp = require('ncp').ncp
const dirToJson = require('./lib/dirToJson')

var conn = mysql.createConnection({
    host: "localhost",
    user: "root",
    upass: "",
    database: "PRA"
});

app.listen(8000, ()=> {
    console.log('app listening at port 8000');
});

app.post('/create', (req, res) => {
    var uname = "zaid"
    var repoName = "vtures";
    var repoLocation = "F:/Code/Sources/Node/vtures"
    if (!fs.existsSync(`uploads/${uname}`)){
        fs.mkdirSync(`uploads/${uname}`);
    }
    if (!fs.existsSync(`uploads/${uname}/${repoName}`)){
        fs.mkdirSync(`uploads/${uname}/${repoName}`);
    }
    var currDir = `uploads/${uname}/${repoName}`
    ncp(repoLocation, currDir, function (err) {
        if (err){
			res.status(500).json({msg: "Some error"});
			console.log(err)
		}		
        else{
			res.status(200).json({msg:"sucess"});
			const tree = dirToJson(currDir)
				.then(data => {
					// console.log(JSON.stringify(data))
					temp = JSON.stringify(data)
					var sql = `select uid from user where uname = '${uname}'`
    				conn.connect((err) => {
						if(err) throw err;
						conn.query(sql, (err, result) => {
							if(err) throw err
							var uid = result[0].uid;
							sql = `INSERT INTO repo (uid, template) VALUES ('${uid}', '${temp}')`;
							conn.query(sql,(err, result) => {
								if(err) throw err;
								console.log(result)
							})
						})
					})
				});            
		}        
    });
})

app.get('/auth', (req, res) => {
    res.send(",fdf,kjkdfj")
})

app.get('/redirect', (req, res) => {
    res.send("dflkjgdlfkgdl;fkj")
})

app.get('/createRepo', (req, res) => {

})

app.get('/template', (req, res) => {

})

app.post('/signUp', (req, res) => {
	console.log(req.body);
	var uname = req.body.uname;
	var upass = req.body.upass;
	var check = `SELECT * FROM users WHERE uname = \'${uname}\'`;
	conn.query(check, (err, che) => {
		if(err) {
			res.status(500).json({msg: "Some error"});
			throw err;
		} 
		if(che.length == 0) {
			var sql = `INSERT INTO users (uname, upass) VALUES (\'${uname}\', \'${upass}\')`;
			conn.query(sql, (err, result) => {
				if (err) {
					res.sendStatus(500);
					throw err;
				}
				console.log("values inserted");
				res.status(200).json({msg:"Login sucess"});
			})
		} else {
			console.log("uname already taken")
			res.sendStatus(401);
		}
	})	
})

app.post('/login', (req, res) => {
	var uname = req.body.uname;
	var upass = req.body.upass;
	var sql = `SELECT * FROM users WHERE uname = \'${uname}\'`;
	conn.query(sql, (err, result) => {
		if (err) throw err;
		if(result[0].upass == upass) {
			res.send("correct");
		} else {
			res.sendStatus(401);
		}
	})
});