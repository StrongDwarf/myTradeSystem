var http = require('http')
var componentData = require("./data/companyData")
var async = require("async")
var fs = require('fs');
var path = require("path");
var fsUtil = require('./utils/fsUtil')
var dataStoreUtil = require('./utils/dataStoreUtil')
var networkUtil = require('./utils/networkUtil')


/**
 * 获取数据
 */
async function getHistoryData() {

    new Promise(resolve => {
        dataStoreUtil.getDoCompanyCodeList().then(codeList => {
            codeList = [...new Set(codeList)]

            for(let i=0;i<componentData.shComponentCodeList.length;i++){
                for(let j=0;j<codeList.length;j++){
                    if(componentData.shComponentCodeList[i]==codeList[j]){
                        console.log("代码为" + componentData.shComponentCodeList[i] + "的数据,已经获取过,不需要重复获取")
                        componentData.shComponentCodeList.splice(i,1)
                        i--;
                        j--;
                    }
                }
            }

            for(var i=0;i<componentData.szComponentCodeList.length;i++){
                for(var j=0;j<codeList.length;j++){
                    if(componentData.szComponentCodeList[i]==codeList[j]){
                        componentData.szComponentCodeList.splice(i,1)
                        i--;
                        j--;
                    }
                }
            }
            resolve(componentData)
        })
    }).then(data => {
        var task = []

        console.log("开始获取上证数据")
        componentData.shComponentCodeList.forEach((companyCode) => {

            task.push(callback => {
                networkUtil.getHistoryData("sh" + companyCode, "60", "5", "1024").then(dataList => {
                    // 加入doCompanyCode,防止重复获取
                    dataStoreUtil.addToDoCompanyCodeList(companyCode)
                    
                    console.log("将数据存储到文件系统中")
                    dataStoreUtil.storeData("sh" + companyCode,dataList)

                    setTimeout(function () {
                        callback(null)
                    }, 4000)
                }).catch(err => {
                    console.log(err)
                })
            })
        })

        componentData.szComponentCodeList.forEach((companyCode) => {

            task.push(callback => {
                networkUtil.getHistoryData("sz" + companyCode, "60", "5", "1024").then(dataList => {
                    // 加入doCompanyCode,防止重复获取
                    dataStoreUtil.addToDoCompanyCodeList(companyCode)

                    console.log("将数据存储到文件系统中")
                    dataStoreUtil.storeData("sz" + companyCode,dataList)

                    setTimeout(function () {
                        callback(null)
                    }, 4000)
                }).catch(err => {
                    console.log(err)
                })
            })
        })

        async.waterfall(task, function (err, result) {
            if (err) return console.log(err);
        })
    })
}

getHistoryData()