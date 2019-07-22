function extractUrl() {
    var url = document.location.href,
    params = url.split('?')[1].split('&')
    // console.log(params)
    data = {}; 
    var tmp;
    for (var i = 0, l = params.length; i < l; i++) {
            tmp = params[i].split('=');
            data[tmp[0]] = tmp[1];
    }
    return data
}

function handleClick() {
    var data = extractUrl();
    var username = data.uname;
    var repoName = document.getElementById('repoName').value
    var fileLocation = document.getElementById('fileLocation').value
    console.log("useraname", username, "reponame", repoName, "filelocation", fileLocation)
    axios.post('http://localhost:8000/addTemp',{repoName: repoName, fileLocation:fileLocation, uname:username})
        .then(response => {
            console.log(response)
            if(response.data.status === 0)
                document.getElementById('response').innerHTML = 'Failure!'
            else
                document.getElementById('response').innerHTML = 'Succces!'
            document.getElementById('repoName').value = ""
            document.getElementById('fileLocation').value  = ""
        })
        .catch(err => {
            console.log("man wtf", err)
        })
}