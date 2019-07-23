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
            }
            traverse(jsonObj.entries, path, octokit, inputData);
        }      
    }
    else {
        return
    }
}

function octokitStuff(octokit, inputData, path){
    octokit.repos.createOrUpdateFile({
		owner : inputData.uname,
		repo : inputData.templateName,
		path : path,
		message: 'some message here',
		content : ''
    })
    .then(data => {
        console.log("files inserted gitHUb")
    })
    .catch(err => {
        // console.log(err)
        if (err.status === 404){                    
            octokit.repos.createForAuthenticatedUser({
                name: inputData.templateName,
            })
            .then(data => {
                console.log("repo created")
                octokit.repos.createOrUpdateFile({
                    owner : inputData.uname,
                    repo : inputData.templateName,
                    path : path,
                    message: 'some message here',
                    content : ''
                })
            })
            .catch(error => {
                console.log("repo creation failed")
            })
        }
    })
}

module.exports = {
    traverse: traverse
}