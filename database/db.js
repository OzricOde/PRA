var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user:"root",
  pass:""
  
});

con.connect(function(err) {
  if (err)  console.log(err);
  console.log("Connected!");
});