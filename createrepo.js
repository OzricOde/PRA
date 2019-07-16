var request = require("request");

var options = { method: 'POST',
  url: 'https://api.github.com/user/repos',
  headers: 
   { 'Postman-Token': 'd495bb27-7a35-42d2-864a-718d3802c54e',
     'cache-control': 'no-cache',
     'Content-Type': 'application/json',
     'User-Agent' : 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36',
     'Authorization': 'Bearer 74ed38b9caf196d0b6b40845cb5cae86d5c5e093 ' },
  body: 
   { name: 'Hello-World',
     description: 'This is your first repository',
     homepage: 'https://github.com',
     private: false,
     has_issues: true,
     has_projects: true,
     has_wiki: true },
  json: true };

request(options, function (error, response, body) {
  if (error) throw new Error(error);

  console.log(body);
});