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

function writeToFile(filePath,str){
    fs.writeFile(filePath, str, { 'flag': 'w' }, function(err) {
        if (err) {
            console.log(err);
        }
    });
}

/**
 * 清空文件
 */
function clearFile(filePath){
    console.log("开始清除文件内容,filePath--->" + filePath)
    return new Promise((resolve,reject) => {
        fs.writeFile(filePath, "", { 'flag': 'w' }, function(err) {
            if (err) {
                console.log("清除文件内容失败",err);
                reject(err)
            }
            console.log("清除文件内容成功")
            resolve()
        });
    })
}

/**
 * 从文件中读
 */
function readFormFile(filePath){
    return new Promise(resolve => {
        fs.readFile(filePath, 'utf-8', function(err, data) {
            if (err) {
                resolve("")
            }
            resolve(data);
        });
    })
}

/**
 * 创建目录
 */
function createFileMk(fsMk){
    return new Promise((resolve,reject) => {
        fs.mkdir(fsMk,(err) => {
            resolve()
        })
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
    getRootPath,
    clearFile,
    createFileMk,
    writeToFile
}