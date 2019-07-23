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

function file(name, parentId, iter){
    let location = createId(name, parentId, iter)
    let html = `<li id=${location}>${name}</li>`
    document.getElementById(parentId).innerHTML += html
    return location
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
                locationObj = file(jsonObj.name, parentId, iter)
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
    console.log(param)
    axios.post('http://localhost:8000/gitSubmit',{templateName: param.repoName, token:param.token, uname:param.uname})
        .then(response => {
            console.log("ksjhfksdjhfkd", response)
        })
        .catch(err => {
            console.log("man wtf", err)
        })
}

function init(){
    var param = extractUrl();
    console.log(param)
    axios.post('http://localhost:8000/viewTemp',{templateName: param.repoName, token:param.token, uname:param.uname})
        .then(response => {
            var jsonString = response.data    
            var json = JSON.parse(jsonString)
            console.log("starting taversing")
            traverse(json, "root") 
            animate()
        })
        .catch(err => {
            console.log("man wtf", err)
        })
}
    
         
