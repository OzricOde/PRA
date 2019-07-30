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
const jenkins = require('jenkins')({ baseUrl: 'http://zaidjan1295:alpha1295@localhost:8080', crumbIssuer: true })
require('dotenv').config();


//==========================================================================================================

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

//============================================================================================================

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

//==================================================================================================
function editConfig(uname, templateName){
	var string= `<flow-definition plugin="workflow-job@2.33">
				<actions>
				<org.jenkinsci.plugins.pipeline.modeldefinition.actions.DeclarativeJobAction plugin="pipeline-model-definition@1.3.9"/>
				</actions>
				<description/>
				<keepDependencies>false</keepDependencies>
				<properties/>
				<definition class="org.jenkinsci.plugins.workflow.cps.CpsScmFlowDefinition" plugin="workflow-cps@2.72">
				<scm class="hudson.plugins.git.GitSCM" plugin="git@3.11.0">
				<configVersion>2</configVersion>
				<userRemoteConfigs>
				<hudson.plugins.git.UserRemoteConfig>
				<url>https://github.com/${uname}/${templateName}</url>
				</hudson.plugins.git.UserRemoteConfig>
				</userRemoteConfigs>
				<branches>
				<hudson.plugins.git.BranchSpec>
				<name>*/master</name>
				</hudson.plugins.git.BranchSpec>
				</branches>
				<doGenerateSubmoduleConfigurations>false</doGenerateSubmoduleConfigurations>
				<submoduleCfg class="list"/>
				<extensions/>
				</scm>
				<scriptPath>Jenkinsfile</scriptPath>
				<lightweight>true</lightweight>
				</definition>
				<triggers/>
				<disabled>false</disabled>
				</flow-definition>`
	return string;
}

function doOtherStuff(files, templateName, uname, randomName){
	return new Promise((resolve, reject)=>{
		console.log("doing other stuff")
		fs.readFile(`./uploads/yaml/${randomName}`, (err, content) => {
			if(err) reject(err)
			console.log("file contents", content)
			let buff = new Buffer(content)
			let base64data = buff.toString('base64');
			console.log("base64", base64data)
			var obj = {
				owner:uname,
				repo:templateName,
				path: `yaml`,
				message:"yaml",
				content: base64data
			}
			resolve(obj)
		})
		
	})	
}


function doStuff(res, jsonToDir, token, uname, templateName, octokit, randomName) {
	console.log("foing stuuf")
	var sql = `select template from repo where templateName = '${templateName}'`
	pool.query(sql, (err, result) => {
		if(err) {
			res.send({status:0})
			throw err
		}
		var template = result[0].template;
		template = JSON.parse(template)
		var files = [];
		doOtherStuff(files, templateName, uname, randomName)
			.then(data => {
				files[files.length] = data
				// console.log("files==",files)
				jsonToDir.traverse(template, "", octokit, {uname, templateName, randomName}, files);
				recLoop(files, octokit, 0, uname, templateName, randomName)
				res.send({status:1})
			})
			.catch(err => {
				throw err
			})	
	})
}

function recLoop(files, octokit, i, uname, templateName, randomName){
	// console.log("i=",i, files[i])
	if(i === files.length){
		// console.log(i, "i==",files.length)
		let jenkinsString = `pipeline {
			agent any		  
			stages {
				stage('Build') {
					steps {
						echo 'Building..'
					}
				}
				stage('Test') {
					steps {
						echo 'Testing..'
					}
				}
				stage('Deploy') {
					steps {
						echo 'Deploying....'
					}
				}
			}
		}`
		let buff = new Buffer(jenkinsString)
		let base64data = buff.toString('base64');
		var obj = {
			owner:uname,
			repo:randomName,
			path: "Jenkinsfile",
			message:"jenkin",
			content: base64data
		}	
		octokit.repos.createOrUpdateFile(obj)
			.then(data => {
				console.log("done upload")
				var xml = editConfig(uname, randomName)
				jenkins.job.create(randomName, xml, function(err) {
					if (err) throw err
					console.log("job created")
				});
			})
			.catch(err => {
				console.log(err)
			})
		return
	}
	if(i > files.length) return 
	octokit.repos.createOrUpdateFile(files[i])
		.then(data => {
			console.log(data.status)
			recLoop(files, octokit, i+=1, uname, templateName, randomName)
			return
		})
		.catch(err => {
			console.log("err", err.status)
			recLoop(files, octokit, i+=1, uname, templateName, randomName)
			return 
		})
}

//=================================================================================================================

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


app.post('/gitSubmit',(req, res) => {	
	console.log("in git submit")	
	var token = req.body.token
	var uname = req.body.uname
	var templateName = req.body.templateName
	var randomName = req.body.randomName
	const octokit = new Octokit({auth: `token ${token}`})
	var yaml = req.body.yaml
	var gitUrl = req.body.gitUrl
	var sql = `select uid from user where uname = '${uname}'`
	console.log(sql)
	pool.query(sql, (err, result) => {
		if(err) throw err
		var uid = result[0].uid;
		var sql = `select rid from repo where templateName = '${templateName}'`
		console.log(sql)
		pool.query(sql, (err, result) => {
			if(err) throw err
			var rid = result[0].rid
			yaml = String.raw`${yaml}`
			console.log(yaml)
			sql = `insert into git (uid, templateName, gitUrl, rid) values ('${uid}','${templateName}','github.com/${uname}/${randomName}', '${rid}')`
			console.log(sql)
			pool.query(sql, (err, result)=>{
				if(err){
					res.send({status:0})
					throw err
				} 
				var test = octokit.repos.createForAuthenticatedUser({
					name: randomName,
				})
					.then(data => {
							console.log("repo created")
							res.send({status:1})
							fs.writeFile(`./uploads/yaml/${randomName}`, yaml, function (err) {
								if (err) throw err;
								console.log('Saved!');
								doStuff(res, jsonToDir, token, uname, templateName, octokit, randomName)
							});
							
						})
					.catch(err => {
						if(err.status === 422){								
							fs.writeFile(`./uploads/yaml/${randomName}`, yaml, function (err) {
								if (err) throw err;
								console.log('Saved!');
								doStuff(res, jsonToDir, token, uname, templateName, octokit, randomName)
							});
						}
						else{
							throw err 
						}		
					})
			})
		})
	})
})


app.get('/listTemps', (req, res) => {
	console.log("triggered list template")
	// console.log(req)
	var uname = req.query.uname
	var sql = `select uid from user where uname = '${uname}'`
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
})

app.post('/viewTemp', (req, res) => {
	console.log("triggered view template")	
	var templateName = req.body.templateName
	var sql = `select * from repo where templateName = '${templateName}'`
	// conn.connect((err) => {
		pool.query(sql, (err, result) => {
			if(err) throw err
			var every = result[0];
				res.send(JSON.stringify(every))			
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
	// console.log(req.params)	
	var sql = `select uid from user where uname = '${req.params.uname}'`
	pool.query(sql, (err, result) => {
		if(err) throw err
		console.log(result)
		if(result.length === 0){			
			sql = `insert into user (uname) VALUES ('${req.params.uname}')`
			pool.query(sql, (err, result) => {
				if(err) throw err
				console.log("inserted new user")
			})
		}
		res.sendFile(path.join(__dirname+'/public/redirect.html'))
	})	
})

app.post('/fileContents', (req, res) => {
	var fileLocation = req.body.fileLocation
	var contents = fs.readFileSync(fileLocation, 'utf8');
	contents = String.raw`${contents}`
	contents = contents.replace(/(\r\n|\n|\r)/gm, "");
	// console.log(contents)
	res.send(JSON.stringify(contents))
})
//=======================================================================================

// octokit.repos.listForUser({
//   username: 'vanesssapearlss',
//   }).then(({ data }) => {
//   console.log({data})
// })
//=========================================
// octokit.repos.delete({
//   owner : 'vanesssapearlss',
//   repo : 'copy'
// })
//==========================================