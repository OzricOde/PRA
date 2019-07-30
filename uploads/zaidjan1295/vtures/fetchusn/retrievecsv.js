var csv= require('csv');
var obj=csv();

function const_usn(usn){
    this.USN = usn;
}

var MyData =[];
const usnData =(csv)=>{
    console.log("csv ", csv)
    var relCsv = `./fetchusn/${csv}`
    return new Promise( (resolve,reject)=> {
    obj.from.path(relCsv).to.array((data)=>{
        for(var i=0;i<data.length;i++){
            MyData.push(new const_usn(data[i][0]));
        }      
        resolve(data);
    })
 });
}

module.exports = {
    usnArray: usnData
}


//module.export =CSV();