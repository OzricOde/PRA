const cheerio  = require('cheerio');
const request = require('request')

function scrape(allmarks) {
    var marks = [];
    for(var i = 0; i < allmarks.length; i += 6){
        if(allmarks[i] === 'P -> PASS'){
            return marks
        }
        if(allmarks[i] !== 'Subject Code'){
            tempObj = {
                subCode: allmarks[i],
                subName: allmarks[i+1],
                ia: allmarks[i+2],
                external: allmarks[i+3],
                total: allmarks[i+4],
                result: allmarks[i+5],
            }
            marks.push(tempObj);
        }
    } 
    return marks;                
}

const processdata = (html,usn) => {  
    // console.log("*************html*************\n",html)  
    console.log("++++++++++usn++++++++++++", usn)
    var $ = cheerio.load(html);
    var allmarks = [];
    var marks = [];
    var allInfo = [];
    $(".col-md-12 .table-responsive").find('td').each((i, el) => {
        const item = $(el).text();
        // console.log(item);
        allInfo.push(item)
    });
    // console.log("allInfo", allInfo)
    var name = allInfo[3].substring(2);
    // console.log(name);
    $(".divTableCell").each((i, el)=> {
        const item = $(el).text();
        // console.log(item);
        allmarks.push(item);
    }) 
    // console.log(allmarks)
    marks = scrape(allmarks);
    var finObj = {
        name: name,
        usn: usn,
        marks: marks
    }
    // console.log("finObj", finObj);
    return finObj;  
}

//******************************** */test env********************************//
// html = request('http://localhost/VTU%20Result.html', function (error, response, body) {
//     usn = '1AY15CS055'
//     var res = processdata(body, usn);
// })
/*****************************************************************************/

module.exports ={
    processdata: processdata
}
