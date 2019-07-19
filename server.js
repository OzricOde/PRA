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
    				// conn.connect((err) => {
						// if(err) throw err;
						pool.query(sql, (err, result) => {
							if(err) throw err
							var uid = result[0].uid;
							sql = `INSERT INTO repo (uid, template, templateName) VALUES ('${uid}', '${temp}', '${repoName}')`;
							pool.query(sql,(err, result) => {
								if(err) throw err;
								// console.log(result)
								// conn.end((err) => {
									// if(err) throw err
									res.sendFile(path.join(__dirname+'/public/success.html'))
								// });
							})
						})
					// })
				});            
		}        
	});
})

app.post('/listTemps', (req, res) => {
	console.log("triggered list template")
	var uname = req.body.uname
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
			// console.log(result[0])
			var template = result[0].template;
			// ((err) => {
				// if(err) throw err
				// console.log(template)
				res.send(JSON.stringify(template))
			// })
			
		})
	// })
})
// app.post('/signUp', (req, res) => {
// 	console.log(req.body);
// 	var uname = req.body.uname;
// 	var upass = req.body.upass;
// 	var check = `SELECT * FROM users WHERE uname = \'${uname}\'`;
// 	pool.query(check, (err, che) => {
// 		if(err) {
// 			res.status(500).json({msg: "Some error"});
// 			throw err;
// 		} 
// 		if(che.length == 0) {
// 			var sql = `INSERT INTO users (uname, upass) VALUES (\'${uname}\', \'${upass}\')`;
// 			pool.query(sql, (err, result) => {
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

app.get('/login', (req, res) => {
	req.session.csrf_string = randomString.generate();
	const githubAuthUrl =
		'https://github.com/login/oauth/authorize?' +
		qs.stringify({
		client_id: process.env.CLIENT_ID,
		redirect_uri: redirect_uri,
		state: req.session.csrf_string,
		scope: 'user:email'
		});
	res.redirect(githubAuthUrl);
});

app.all('/redirect', (req, res) => {
    // Here, the req is request object sent by GitHub
    console.log('Request sent by GitHub: ');
    console.log(req.query);  
    // req.query should look like this:
    // {
    //   code: '3502d45d9fed81286eba',
    //   state: 'RCr5KXq8GwDyVILFA6Dk7j0LbFNTzJHs'
    // }
    const code = req.query.code;
    const returnedState = req.query.state;  
    if (req.session.csrf_string === returnedState) {
		// Remember from step 5 that we initialized
		// If state matches up, send request to get access token
		// the request module is used here to send the post request
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
			// The response will contain your new access token
			// this is where you store the token somewhere safe
			// for this example we're just storing it in session
			console.log('Your Access Token: ');
			console.log(qs.parse(body));
			req.session.access_token = qs.parse(body).access_token;
	
			// Redirects user to /user page so we can use
			// the token to get some data.
			res.redirect('/user');
			}
		);
		} else {
		// if state doesn't match up, something is wrong
		// just redirect to homepage
		res.redirect('/');
    }
});

app.get('/user', (req, res) => {
    // GET request to get emails
    // this time the token is in header instead of a query string
    request.get(
      {
        url: 'https://api.github.com/user/public_emails',
        headers: {
          Authorization: 'token ' + req.session.access_token,
          'User-Agent': 'Login-App'
        }
      },
      (error, response, body) => {
        res.send(
          "<p>You're logged in! Here's all your emails on GitHub: </p>" +
          body +
          '<p>Go back to <a href="/">log in page</a>.</p>'
        );
      }
    );
});