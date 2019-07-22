var val = ""
function handleChange(event) {    
    val = event.target.value
}

function createListItem(name) {
    let html = `
    <li><a href=./viewTemp.html?repoName=${name}>${name}</a></li>
    `
    document.getElementById("repoNameList").innerHTML +=  html
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

function handleClick(event) {
    var data = extractUrl();
    console.log(data)
    var uname = data.uname
    // console.log(email)
    axios.get(`http://localhost:8000/listTemps?uname=${uname}`,)
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
