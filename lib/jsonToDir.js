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
                octokitStuff(octokit, inputData, path)
                // console.log("file: ", path)
            }
            traverse(jsonObj.entries, path, octokit, inputData);
        }      
    }
    else {
        return
    }
}

function octokitStuff(octokit, inputData, path){
    console.log("path", path)
    octokit.repos.createOrUpdateFile({
		owner : inputData.uname,
		repo : inputData.repoName,
		path : path,
		message: 'some message here',
		content : ''
    })
    .then(data => {
        console.log(data)
    })
    .catch(err => {
        console.log(err)
    })
}

module.exports = {
    traverse: traverse
}