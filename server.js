const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs')
const mysql = require('mysql')
const ncp = require('ncp').ncp
const dirToJson = require('./lib/dirToJson')
const bodyParser = require('body-parser');
const session = require('express-session');
const request = require('request');
const qs = require('querystring');
const url = require('url');
const randomString = require('randomstring');
const Octokit = require('@octokit/rest')
const jsonToDir = require('./lib/jsonToDir')
require('dotenv').config();

const redirect_uri = process.env.HOST + '/redirect';

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

var pool = mysql.createPool({
    host: "localhost",
    user: "root",
    upass: "",
    database: "PRA"
});

app.listen(8000, ()=> {
    console.log('app listening at port 8000');
});

app.get('/', (req, res, next) => {
    res.sendFile(__dirname + '/index.html');
});

app.use(
	session({
	  secret: randomString.generate(),
	  cookie: { maxAge: 60000 },
	  resave: false,
	  saveUninitialized: false
	})
);

app.post('/addTemp', (req, res) => {
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
			res.send({status:0});
			console.log(err)
		}		
        else{
			const tree = dirToJson(currDir)
				.then(data => {
					temp = JSON.stringify(data)
					var sql = `select uid from user where uname = '${uname}'`
						pool.query(sql, (err, result) => {
							if(err) throw err
							var uid = result[0].uid;
							sql = `INSERT INTO repo (uid, template, templateName) VALUES ('${uid}', '${temp}', '${repoName}')`;
							pool.query(sql,(err, result) => {
								if(err) throw err;
									res.send({status:1});
							})
						})
				});            
		}        
	});
})

app.get('/createRepo', (req, res) => {
	var token = req.body.token
	var uname = req.body.uname
    var repoName = req.body.repoName
	var repoLocation = req.body.fileLocation
	const octokit = new Octokit({auth: `token ${token}`})
	jsonToDir.traverse(data, "", octokit, {uname,repoName});
})

app.get('/listTemps', (req, res) => {
	console.log("triggered list template")
	console.log(req)
	var uname = req.query.uname
	// console.log(uname)
	var sql = `select uid from user where uname = '${uname}'`
	// conn.connect((err) => {
		// if(err) throw err;
		pool.query(sql, (err, result) => {
			if(err) throw err
			var uid = result[0].uid;
			sql = `select templateName from repo where uid = ${uid}`
			console.log(uid)
			pool.query(sql, (err, result)=>{
				if(err) throw err
				// console.log(result)
				arr = []
				for(var i = 0; i < result.length; i++){
					arr[arr.length] = result[i].templateName
				}
				res.send(JSON.stringify(arr))
			})
		})
	// })
})

app.post('/viewTemp', (req, res) => {
	console.log("triggered view template")	
	var templateName = req.body.templateName
	console.log("templateName", templateName)
	var sql = `select template from repo where templateName = '${templateName}'`
	// conn.connect((err) => {
		pool.query(sql, (err, result) => {
			if(err) throw err
			var template = result[0].template;
				res.send(JSON.stringify(template))
			
		})
})
app.get('/login', (req, res) => {
	req.session.csrf_string = randomString.generate();
	const githubAuthUrl =
		'https://github.com/login/oauth/authorize?' +
		qs.stringify({
		client_id: process.env.CLIENT_ID,
		redirect_uri: redirect_uri,
		state: req.session.csrf_string,
		scope: 'user,repo'
		});
	res.redirect(githubAuthUrl);
});

app.all('/redirect', (req, res) => {  
    const code = req.query.code;
    const returnedState = req.query.state;  
    if (req.session.csrf_string === returnedState) {
		request.post({
			url:
			'https://github.com/login/oauth/access_token?' +
			qs.stringify({
				client_id: process.env.CLIENT_ID,
				client_secret: process.env.CLIENT_SECRET,
				code: code,
				redirect_uri: redirect_uri,
				state: req.session.csrf_string
				})
			},
			(error, response, body) => {
			req.session.access_token = qs.parse(body).access_token;
			res.redirect(`/user/${req.session.access_token}`);
			}
		);
		} else {
		res.redirect('/');
    }
});

app.get('/user/:token', (req, res) => {
    request.get({
		url: 'https://api.github.com/user',
		headers: {
			Authorization: 'token ' + req.session.access_token,
			'User-Agent': 'Login-App'
    	}
    },
    (error, response, body) => {
		console.log("hop ")
		body = JSON.parse(body)
		var uname = body.login;
		var token = req.params.token
		res.redirect(`/listAll/${uname}/${token}`)		
    });
});

app.get('/listAll/:uname/:token', (req, res) => {
	res.sendFile(path.join(__dirname+'/public/redirect.html'))
})

// octokit.repos.listForUser({
//   username: 'vanesssapearlss',
//   }).then(({ data }) => {
//   console.log({data})
// })



// octokit.repos.createForAuthenticatedUser({
//   name: 'bye',
// })

// octokit.repos.delete({
//   owner : 'vanesssapearlss',
//   repo : 'copy'
// })





