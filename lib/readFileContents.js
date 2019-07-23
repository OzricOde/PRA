const fs = require('fs')
const path = require('path')

// dir = `f:/test20`

module.exports = function list(dir) {
    const walk = entry => {
        return new Promise((resolve, reject) => {
        fs.exists(entry, exists => {
            if (!exists) return resolve({}); //post leaf nodes      
            return resolve(new Promise((resolve, reject) => {
                fs.lstat(entry, (err, stats) => {
                if (err) return reject(err);
                if (!stats.isDirectory()) {
                    // return resolve({
                    //   name: path.basename(entry),
                    // });
                    // console.log("path to file", `${path.dirname(entry)}\\${file.name}`)
                    let filename = path.basename(entry)
                    var pathRead = `${path.dirname(entry)}\\${filename}`
                    let text = fs.readFileSync(pathRead, 'utf8') 
                    let file = {
                        name: filename,
                        contents: text
                    }
                    // console.log(text)
                    return resolve(file)
                }
                resolve(new Promise((resolve, reject) => {
                    fs.readdir(entry, (err, files) => {
                    if (err) {
                        return reject(err);
                    }
                    Promise.all(files.map(child => walk(path.join(entry, child))))
                        .then(children => {
                            // resolve({
                            //   name: path.basename(entry),
                            //   entries: children
                            // });
                            var folder = {
                                name: path.basename(entry),
                                entries: children
                            }
                            // console.log("folder.name=",folder.name)
                            console.log("path to folder", path.dirname(entry))
                            resolve(folder)
                        })
                        .catch(err => {
                            reject(err);
                        });
                    });
                }));
                });
            }));
        });

    });
    } 
    return walk(dir);
}

