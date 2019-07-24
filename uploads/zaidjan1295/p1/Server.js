const url = require('url')
const express = require('express');
const path = require('path');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const jwt = require('jwt-simple');
const moment = require('moment');

const app = express();

var conn = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "ACDC"
});

conn.connect((err) => {
	if (err) throw err;
	console.log("Connected!");
});

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.set('jwtTokenSecret', 'wassup');

app.post('/SignUp', (req, res) => {
	//0 error in sql
	//1 success;
	//2 = username taken 
	//not encrypting pass
	console.log(req.body);
	var username = req.body.username;
	var phonenum = req.body.phonenum;
	var password = req.body.password;
	var check = `SELECT * FROM users WHERE username = \'${username}\'`;
	conn.query(check, (err, che) => {
		if(err) {
			res.status(500).json({msg: "Some error"});
			throw err;
		} 
		if(che.length == 0) {
			var sql = `INSERT INTO users (username, password, phonenum) VALUES (\'${username}\', \'${password}\', \'${phonenum}\')`;
			conn.query(sql, (err, result) => {
				if (err) {
					res.sendStatus(500);
					throw err;
				}
				console.log("values inserted");
				res.status(200).json({msg:"Login sucess"});
			})
		} else {
			console.log("username already taken")
			res.sendStatus(401);
		}
	})	
})

app.post('/Login', (req, res) => {
	var username = req.body.username;
	var password = req.body.password;
	var sql = `SELECT * FROM users WHERE username = \'${username}\'`;
	conn.query(sql, (err, result) => {
		if (err) throw err;
		// console.log(result);
		// console.log(result.password);
		// console.log(password);
		if(result[0].password == password) {
			var expires = moment().add(7, 'days').valueOf();
			var token = jwt.encode({
  				iss: username,
  				exp: expires
			}, app.get('jwtTokenSecret'));
			// console.log(token);
			res.send(token);
		} else {
			res.sendStatus(401);
		}
	})
});

app.get('/Projects', (req, res) => {
	var sql = `SELECT * FROM PROJECTS`;
	conn.query(sql, (err, result) => {
		if (err) throw err;
		res.send(result);
	})	
})

app.get('/Members', (req, res) => {
	var sql = `SELECT * FROM MEMBERS`;
	conn.query(sql, (err, result) => {
		if (err) throw err;
		res.send(result);
	})	
})

app.listen(8000);