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

data = extractUrl()
var uname = data.uname
var token = data.token

document.getElementById("nav").innerHTML += `
<ul>
  <li><a href="./addTemp.html?uname=${uname}&token=${token}">Add Template</a></li>
  <li><a href="./listTempName.html?uname=${uname}&token=${token}">List Templates</a></li>
</ul>
`


  
