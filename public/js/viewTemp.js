function createId(name, parentId, iter) {
    if(iter === undefined)
        return `${parentId}-${name}`
    else    
        return `${parentId}-${iter}`
}

function folder(name, parentId){
    let location = createId(name, parentId)
    let html = `<li><span class="caret" >${name}</span><ul class="nested" id=${location}>`
    document.getElementById(parentId).innerHTML += html
    return location
}

function file(name, parentId, iter, contents){
    let location = createId(name, parentId, iter)
    contents = contents.replace(/\"/g, '-');
    let html = `<li id=${location}>
                    <a class="button" href="#popup1" content="${contents}" onclick="getContents(event)">${name}</a>
                </li>`  
    document.getElementById(parentId).innerHTML += html

    return location
}

function getContents(event) {
    console.log(event.target)
    var fileLocation = event.target.getAttribute('content')
    // fileLocation = fileLocation.replace(/-/g, '/');
    console.log(fileLocation)
    axios.post('http://localhost:8000/fileContents',{fileLocation: fileLocation})
        .then(data => {
            console.log("daat", data.data)
            document.getElementById("popup2").innerHTML = data.data
            document.getElementById("popup2").innerHTML += `<a class="close" href="">&times;</a> `
        })  
        .catch(err => {
            console.log("something went wrong")
        })   
}

function traverse(jsonObj, parentId, iter) {
    if(jsonObj !== null && typeof jsonObj == "object" ){          
        if(jsonObj.constructor === Array){
            for(var i = 0; i < jsonObj.length; i++){
                traverse(jsonObj[i], parentId, i);
            }            
        }
        else{
            let locationObj = ""
            if(jsonObj.hasOwnProperty("entries")){
                locationObj = folder(jsonObj.name, parentId)
            }
            else {
                locationObj = file(jsonObj.name, parentId, iter, jsonObj.contents)
            }
            traverse(jsonObj.entries, locationObj);
        }      
    }
    else {
        return
    }
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

function animate(){
    console.log("running hopefully at end")
    var toggler = document.getElementsByClassName("caret");
        var i;
        for (i = 0; i < toggler.length; i++) {
            toggler[i].addEventListener("click", function() {
                this.parentElement.querySelector(".nested").classList.toggle("active");
                this.classList.toggle("caret-down");
            });
        }
}

function gitSubmit() {
    var param = extractUrl();
    var yaml = document.getElementById("textYaml").value
    console.log(yaml)
    // console.log(param)
    axios.post('http://localhost:8000/gitSubmit',{templateName: param.repoName, token:param.token, uname:param.uname, yaml})
        .then(response => {
            console.log(response)
            if(response.data.status === 1){
                document.getElementById("gitLink").innerHTML = `<a href="https://github.com/${param.uname}/${param.repoName}" target="_blank">RepoLink!</a>`
            }
            else{
                document.getElementById("gitLink").innerHTML = `Error Creating Repo`
            }
        })
        .catch(err => {
            console.log("man wtf", err)
        })
}

function toggle(x){
    if(x.style.visibility === "hidden")
        x.style.visibility = "visible"
    else 
        x.style.visibility = "hidden"
}

function init(){
    var param = extractUrl();
    axios.post('http://localhost:8000/viewTemp',{templateName: param.repoName, token:param.token, uname:param.uname})
        .then(response => {
            var string = response.data
            console.log(string) 
            var json = JSON.parse(string.template)
            console.log("starting taversing", json)
            traverse(json, "root") 
            animate()
        })
        .catch(err => {
            console.log("man wtf", err)
        })
}