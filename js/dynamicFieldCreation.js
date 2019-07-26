$(document).click(function(event) {
    var tag = $(event.target)[0];
    var id = tag.getAttribute('id')
    var level = parseInt(tag.getAttribute('level'))
    var lat = parseInt(tag.getAttribute('lat'))
    var type = tag.innerHTML
    var parTag = $(event.target)[0].parentNode
    var parLevel = parseInt(parTag.getAttribute('level'))
    var parLat = parseInt(parTag.getAttribute('lat'))
    var gparTag = parTag.parentNode
    var glatestLat = parseInt(gparTag.lastElementChild.getAttribute('lat'))
    // console.log(latestLat)
    if(type === 'Add folder')
        addFolder(id, level, lat, parLevel, parLat, gparTag, glatestLat)
    else if(type === "Add nested folder")
        addNestedFolder(id, level, lat, parLevel, parLat)
    else if(type === "Add File")
        addFile(id, level, lat, parTag);
});

var repo = {};

var addFolder = (id, level, lat, parLevel, parLat, gparTag, latestLat) => {    
    //chnage lat values
    var testString= 
    `
    <div class="prompt" id="${parLevel}main${parLat}" level="${parLevel}" lat="${latestLat+1}">
        <button type="button" level="${parLevel}" lat="${latestLat+1}">Add folder</button>
        <button type="button" level="${parLevel}" lat="${latestLat+1}">Add nested folder</button><br>
        <div id="${parLevel}addNested${latestLat+1}">
        </div>          
    </div>
    `
    console.log("gparTag", gparTag)
    gparTag.innerHTML += testString
}
var addNestedFolder = (id, level, lat) => {

}
var addFile = (id, level, lat, parTag) => {
    console.log("level", level, "lat", lat)
    latestLat = document.getElementById(`${level}files${lat}`).getElementsByTagName("input").length;
    console.log("latestLat", latestLat);
    // console.log("level=", level, "lat", lat, "latestLat", latestLat)
    var testString = `
    <input type="text" name="${level}files${latestLat}">`
    document.getElementById(`${level}files${lat}`).innerHTML += testString

}
var addSub = () => {
    var testString =
    `
    <div class="prompt" id="${parLevel}main${parLat}" level="${parLevel}" lat="${latestLat+1}">
        <button type="button" level="${parLevel}" lat="${latestLat+1}">Add folder</button>
        <button type="button" level="${parLevel}" lat="${latestLat+1}">Add nested folder</button><br>
        <div id="${parLevel}addNested${latestLat+1}">
        </div>
        <div id = ${parLevel}files${latestLat+1}>
            <button type="button" level="${parLevel}" lat="${latestLat+1}">Add File</button><br>
        </div>            
    </div>
    `

}