var string = ""
function init(){
    var param = extractUrl();
    axios.post('http://localhost:8000/editYaml',{templateName: param.repoName, token:param.token, uname:param.uname, gid:param.gid})
        .then(response => {
            console.log(response.data)
            string = response.data
            // document.getElementById('main').innerHTML = response.data
        })
        .catch(err => {
            console.log("man wtf", err)
        })
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

function handleClick(){
    var pre = document.getElementById("pre").value;
    var pos = document.getElementById("pos").value;
    var dev = document.getElementById("dev").value;    
    var options = [pre, pos, dev]
    var param = extractUrl();
    var uname = param.uname
    var gitUrl = param.gitUrl
    var token = param.token
    axios.post('http://localhost:8000/editString', {options, gitUrl, uname, token})
        .then(data => {
            console.log("got updated")
        })
        .catch(err => {
            console.log("failure")
        })    
}