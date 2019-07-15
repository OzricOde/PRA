const createColumns = (obj, csv) => {
    const fs = require('fs');
    const writeStream = fs.createWriteStream(`./public/marks_${csv}`);
    const usn = obj.usn;
    var subcodes = [];
    subCodes = obj.marks.map((temp) => {
        var aux = [];
        aux.push(temp.subCode);
        aux.push(temp.subName);
        aux.push('total');
        return aux;
    })
    // console.log("subcodes ", subcodes)
    writeStream.write(`USN, Name, ${subCodes}\n`)
    writeStream.end();
}

module.exports = {
    createColumns
}