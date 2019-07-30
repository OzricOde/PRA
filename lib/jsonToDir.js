const fs = require('fs')

function traverse(jsonObj, path, octokit, inputData, fin) {
    if(jsonObj !== null && typeof jsonObj == "object" ){          
        if(jsonObj.constructor === Array){
            for(var i = 0; i < jsonObj.length; i++){
                traverse(jsonObj[i], path, octokit, inputData, fin);
            }            
        }
        else{
            if(jsonObj.hasOwnProperty("entries")){
                path += jsonObj.name + '/'
            }
            else {
                path += jsonObj.name
                let contents = jsonObj.contents
                let buff = new Buffer(fs.readFileSync(contents));
                let base64data = buff.toString('base64');
                fin[fin.length] = {
                    owner : inputData.uname,
                    repo : inputData.randomName,
                    path : path.replace(`${inputData.templateName}/`, ""),
                    message: '',
                    content : base64data,
                }        
            }
            traverse(jsonObj.entries, path, octokit, inputData, fin);
        }      
    }
    else {
        return
    }
}

module.exports = {
    traverse: traverse
}