const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs')
const fse = require('fs-extra')
const dirTree = require('directory-tree')


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
    var repoLocation = "z:/vtures"
    if (!fs.existsSync(`uploads/${uname}`)){
        fs.mkdirSync(`uploads/${uname}`);
    }
    if (!fs.existsSync(`uploads/${uname}/${repoName}`)){
        fs.mkdirSync(`uploads/${uname}/${repoName}`);
    }
    var currDir = `uploads/${uname}/${repoName}`
    fse.copy(repoLocation, currDir, function (err) {
        if (err)
            throw err
        else{
            const tree = dirTree(currDir);
            console.log("tree", tree)
            stringTree = JSON.stringify(tree)
            res.send(stringTree)
        }
        
    });
})

app.get('./auth', (req, res) => {
    res.send(",fdf,kjkdfj")
})

app.get('./redirect', (req, res) => {
    res.send("dflkjgdlfkgdl;fkj")
})

app.get('./createRepo', (req, res) => {

})

app.get('./editTemplate', (req, res) => {
    
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