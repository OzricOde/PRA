const fs = require('fs')
const path = require('path')
// var ignoreModules = ['node_module']
//add ignore folders

module.exports = function list(dir) {
    const walk = entry => {
      return new Promise((resolve, reject) => {
        fs.exists(entry, exists => {
          if (!exists) {
            return resolve({});
          }
          return resolve(new Promise((resolve, reject) => {
            fs.lstat(entry, (err, stats) => {
              if (err) {
                return reject(err);
              }
              if (!stats.isDirectory()) {
                return resolve({
                  name: path.basename(entry),
                });
              }
              resolve(new Promise((resolve, reject) => {
                fs.readdir(entry, (err, files) => {
                  if (err) {
                    return reject(err);
                  }
                  Promise.all(files.map(child => walk(path.join(entry, child)))).then(children => {
                    resolve({
                      name: path.basename(entry),
                      entries: children
                    });
                  }).catch(err => {
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

