const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs')
const mysql = require('mysql')
const ncp = require('ncp').ncp
const dirToJson = require('./lib/dirToJson')
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

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
	// console.log(req.body)
    var uname = req.body.uname
    var repoName = req.body.repoName
    var repoLocation = req.body.fileLocation
    if (!fs.existsSync(`uploads/${uname}`)){
        fs.mkdirSync(`uploads/${uname}`);
    }
    if (!fs.existsSync(`uploads/${uname}/${repoName}`)){
        fs.mkdirSync(`uploads/${uname}/${repoName}`);
    }
    var currDir = `uploads/${uname}/${repoName}`
    ncp(repoLocation, currDir, function (err) {
        if (err){
			res.sendFile(path.join(__dirname+'/public/failure.html'));
			console.log(err)
		}		
        else{
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
							sql = `INSERT INTO repo (uid, template, templateName) VALUES ('${uid}', '${temp}', '${repoName}')`;
							conn.query(sql,(err, result) => {
								if(err) throw err;
								// console.log(result)
								conn.end((err) => {
									if(err) throw err
									res.sendFile(path.join(__dirname+'/public/success.html'))
								});
							})
						})
					})
				});            
		}        
	});
})

app.post('/listTemps', (req, res) => {
	console.log("triggered list template")
	var uname = req.body.uname
	// console.log(uname)
	var sql = `select uid from user where uname = '${uname}'`
	conn.connect((err) => {
		if(err) throw err;
		conn.query(sql, (err, result) => {
			if(err) throw err
			var uid = result[0].uid;
			sql = `select templateName from repo where uid = ${uid}`
			console.log(uid)
			conn.query(sql, (err, result)=>{
				if(err) throw err
				// console.log(result)
				arr = []
				for(var i = 0; i < result.length; i++){
					arr[arr.length] = result[i].templateName
				}
				res.send(JSON.stringify(arr))
			})
		})
	})
})

app.post('/viewTemp', (req, res) => {
	console.log("triggered view template")	
	var templateName = req.body.templateName
	console.log("templateName", templateName)
	var sql = `select template from repo where templateName = '${templateName}'`
	conn.connect((err) => {
		conn.query(sql, (err, result) => {
			if(err) throw err
			// console.log(result[0])
			var template = result[0].template;
			conn.end((err) => {
				if(err) throw err
				// console.log(template)
				res.send(JSON.stringify(template))
			})
			
		})
	})
})

app.get('/redirect', (req, res) => {
    res.send("dflkjgdlfkgdl;fkj")
})

app.get('/createRepo', (req, res) => {

})

app.get('/template', (req, res) => {

})

// app.post('/signUp', (req, res) => {
// 	console.log(req.body);
// 	var uname = req.body.uname;
// 	var upass = req.body.upass;
// 	var check = `SELECT * FROM users WHERE uname = \'${uname}\'`;
// 	conn.query(check, (err, che) => {
// 		if(err) {
// 			res.status(500).json({msg: "Some error"});
// 			throw err;
// 		} 
// 		if(che.length == 0) {
// 			var sql = `INSERT INTO users (uname, upass) VALUES (\'${uname}\', \'${upass}\')`;
// 			conn.query(sql, (err, result) => {
// 				if (err) {
// 					res.sendStatus(500);
// 					throw err;
// 				}
// 				console.log("values inserted");
// 				res.status(200).json({msg:"Login sucess"});
// 			})
// 		} else {
// 			console.log("uname already taken")
// 			res.sendStatus(401);
// 		}
// 	})	
// })

// app.post('/login', (req, res) => {
// 	var uname = req.body.uname;
// 	var upass = req.body.upass;
// 	var sql = `SELECT * FROM users WHERE uname = \'${uname}\'`;
// 	conn.query(sql, (err, result) => {
// 		if (err) throw err;
// 		if(result[0].upass == upass) {
// 			res.send("correct");
// 		} else {
// 			res.sendStatus(401);
// 		}
// 	})
// });