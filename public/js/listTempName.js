var val = ""
function handleChange(event) {    
    val = event.target.value
}

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

var data = extractUrl();

function createListItem(name) {
    var uname = data.uname;
    var token = data.token

    let html = `<div class="w3-card-4"><header class="w3-container w3-blue">
      <a href=./viewTemp.html?repoName=${name}&token=${token}&uname=${uname}>${name}</a></div><div class="w3-container"><p>Enter Description here</p></div><br>`
    document.getElementById("repoNameList").innerHTML +=  html
}

function createListItemGit(arr){
    console.log(arr)
    var uname = data.uname;
    var token = data.token
    let html = `<div class="w3-card-4"><header class="w3-container w3-red">
      <a href=./viewTemp.html?repoName=${arr.templateName}&token=${token}&uname=${uname}>${arr.gitUrl}</a></div>
      <div class="w3-container"><p>The GitHub Repository Was Created With Template <strong>${arr.templateType}</strong></p></div><br>`
    document.getElementById("gitLinks").innerHTML +=  html
}


function handleClick(event) { 
    document.getElementById("repoNameList").innerHTML = ""  
    console.log(data)
    var uname = data.uname
    // console.log(email)
    axios.get(`http://localhost:8000/listTemps?uname=${uname}`)
        .then(response => {
            var names = response.data    
            // var arr = JSON.parse(names)
            console.log(names)
            for(var i =0; i < names.length; i++)
                createListItem(names[i])
        })
        .catch(err => {
            console.log("man wtf", err)
        })
}

function handleClickGit(event){
    document.getElementById("gitLinks").innerHTML = ""
    var uname = data.uname
    axios.get(`http://localhost:8000/listGitLink?uname=${uname}`)
        .then(response => {
            // console.log(response.data)    
            var arr = response.data
            // console.log(names)
            for(var i =0; i < arr.length; i++)
                createListItemGit(arr[i])
        })
        .catch(err => {
            console.log("man wtf", err)
        })
}
