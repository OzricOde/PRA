const fs = require('fs')
const path = require('path')

module.exports = function list(dir) {
    const walk = entry => {
        return new Promise((resolve, reject) => {
        fs.exists(entry, exists => {
            if (!exists) return resolve({}); //post leaf nodes      
            return resolve(new Promise((resolve, reject) => {
                fs.lstat(entry, (err, stats) => {
                if (err) return reject(err);
                if (!stats.isDirectory()) {
                    let filename = path.basename(entry)
                    var pathRead = `${path.dirname(entry)}\\${filename}`
                    pathRead = pathRead.replace(/\\/g, '/');
                    let file = {
                        name: filename,
                        contents: pathRead,
                    }
                    return resolve(file)
                }
                resolve(new Promise((resolve, reject) => {
                    fs.readdir(entry, (err, files) => {
                    if (err) {
                        return reject(err);
                    }
                    Promise.all(files.map(child => walk(path.join(entry, child))))
                        .then(children => {
                            var folder = {
                                name: path.basename(entry),
                                entries: children
                            }
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