const request = require('request');
const fs = require('fs');
const config = require('./config')
const fetchData = (usn, frontData)=> {
    var obj = config.config(usn, frontData)
    var headers  = obj[frontData.year].headers;
    var body = obj[frontData.year].body;
    var url = obj[frontData.year].url;
    return new Promise(function(resolve, reject) {
        request({
            url: url,
            method: "POST",
            headers: headers,
            formData: body
        }, function (error, response, body){
            if(error) reject(error)
            resolve(body);
        });
       })

}
module.exports = {
    fetchData: fetchData
}