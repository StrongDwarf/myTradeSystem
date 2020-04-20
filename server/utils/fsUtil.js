var path = require("path");
var fs = require('fs');

/**
 * 写文件,如果没有,就创建
 */
function addToFile(filePath,str){
    fs.exists(filePath,(exists) => {
        if(!exists){
            let arrTmp = filePath.split("\\")
            arrTmp.pop()
            let fsMk = arrTmp.join("\\")
            fs.mkdir(fsMk,(err) => {
                if(err){
                    return console.error(err);
                }
                fs.writeFile(filePath, str, { 'flag': 'a' }, function(err) {
                    if (err) {
                        console.log(err);
                    }
                });
            })
        }else{
            fs.writeFile(filePath, str, { 'flag': 'a' }, function(err) {
                if (err) {
                    console.log(err);
                }
            });
        }
    })
}

/**
 * 从文件中读
 */
function readFormFile(filePath){
    return new Promise(resolve => {
        fs.readFile(filePath, 'utf-8', function(err, data) {
            if (err) {
                throw err;
            }
            resolve(data);
        });
    })
}

/**
 * 获取当前路径
 */
function getRootPath(){
    return path.resolve('./')
}


module.exports = {
    addToFile,
    readFormFile,
    getRootPath
}