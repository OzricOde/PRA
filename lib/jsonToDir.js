const fs = require('fs')

function traverse(jsonObj, path, octokit, inputData) {
    if(jsonObj !== null && typeof jsonObj == "object" ){          
        if(jsonObj.constructor === Array){
            for(var i = 0; i < jsonObj.length; i++){
                traverse(jsonObj[i], path, octokit, inputData);
            }            
        }
        else{
            if(jsonObj.hasOwnProperty("entries")){
                path += jsonObj.name + '/'
            }
            else {
                path += jsonObj.name
                setTimeout((() => {
                    octokitStuff(octokit, inputData, path, jsonObj.contents)
                }), 3000)                
            }
            traverse(jsonObj.entries, path, octokit, inputData);
        }      
    }
    else {
        return
    }
}

function octokitStuff(octokit, inputData, path, contents){   
    contents = contents.replace(/-/g, '\\');
    // console.log("contents of file", contents)
    let buff = new Buffer(fs.readFileSync(contents));
    let base64data = buff.toString('base64');
    octokit.repos.createOrUpdateFile({
		owner : inputData.uname,
		repo : inputData.templateName,
		path : path,
		message: '',
		content : base64data,
    })
        .then(data => {
            // console.log("data", data)
            console.log("template created")
        })
        .catch(err => {
            console.log("http", err.status);
        })
}

module.exports = {
    traverse: traverse
}