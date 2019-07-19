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

function handleClick(event) {
    axios.post('http://localhost:8000/listTemps',{uname: val})
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
