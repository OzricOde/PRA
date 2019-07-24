const addToCsv = (obj, csv) => {
    // console.log("obj = ",obj )
    const fs = require('fs');
    const writeStream = fs.createWriteStream(`./public/marks_${csv}`,{flags:'a'});
    var usn = obj.usn;
    var name = obj.name;
    var rows = [];
    rows = obj.marks.map((temp) => {
        var aux = [];
        aux.push(temp.ia);
        aux.push(temp.external);
        aux.push(temp.total);
        return aux;
    })
    // console.log("rows", rows)
    writeStream.write(`${usn}, ${name}, ${rows}\n`)
    writeStream.end();
    console.log("csv entry made")
}

module.exports = {
    addToCsv
}

//***************************************************************************************************
  // html = request('http://localhost/resultSample.html', function (error, response, body) {
  // usn = '1AY16CS118'
  //  var res = scrapeData.processdata(body, usn);
  //  console.log(res);
  //  // const writeStream = fs.createWriteStream('post3.csv');
  //  // writeStream.write(`usn,subcode,internal,external,total,subcode,internal,external,total,subcode,internal,external,total,subcode,internal,external,total,subcode,internal,external,total,subcode,internal,external,total,subcode,internal,external,total,subcode,internal,external,total\n`);
  //   createcsv(res)
  // })