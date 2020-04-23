var http = require('http')
var componentData = require("./data/companyData")
var async = require("async")
var fs = require('fs');
var path = require("path");
var fsUtil = require('./utils/fsUtil')
var dataStoreUtil = require('./utils/dataStoreUtil')
var networkUtil = require('./utils/networkUtil')
var dataTranUtil = require('./utils/dataTranUtil')

/**
 * 获取数据
 */
async function getMoneyData() {

    new Promise(resolve => {
        dataStoreUtil.getDoMoneyDataCodeList().then(doNowDataCodeList => {
            doNowDataCodeList = [...new Set(doNowDataCodeList)]

            let newDataCodeList = []
            componentData.shComponentCodeList.forEach(shCode => {
                newDataCodeList.push("sh" + shCode)
            })
            componentData.szComponentCodeList.forEach(shCode => {
                newDataCodeList.push("sz" + shCode)
            })

            for(let i=0;i<newDataCodeList.length;i++){
                for(let j=0;j<doNowDataCodeList.length;j++){
                    if(newDataCodeList[i]==doNowDataCodeList[j]){
                        console.log("代码为" + newDataCodeList[i] + "的数据,已经获取过,不需要重复获取")
                        newDataCodeList.splice(i,1)
                        i--;
                        j--;
                    }
                }
            }

            resolve(newDataCodeList)
        })
    }).then(newDataCodeList => {
        console.log("需要获取数据的总数为",newDataCodeList.length)
        var task = []
        for(let i = 0;i<newDataCodeList.length;){
            let j = i + 200
            if(j > newDataCodeList.length){
                j = newDataCodeList.length
            }
            let codeListTmp = newDataCodeList.slice(i,j)
            task.push(callback => {
                console.log("开始获取实时数据-->",codeListTmp.length)
                networkUtil.getMoneyFlow(codeListTmp).then(dataStr => {
                    // 加入doCompanyCode,防止重复获取
                    dataStoreUtil.addToDoMoneyDataCodeList(codeListTmp)
                    
                    // 将dataStr转换成数组
                    let dataArr = dataTranUtil.getMoneyDataFormStr(dataStr)

                    dataStoreUtil.storeMoneyData(dataArr)

                    setTimeout(function () {
                        callback(null)
                    }, 4000)
                }).catch(err => {
                    console.log(err)
                })
            })

            i = j
        }

        async.waterfall(task, function (err, result) {
            if (err) return console.log(err);
        })
    })
}

/**
 * 获取数据
 */
async function getQQMoneyData() {

    new Promise(resolve => {
        dataStoreUtil.getDoMoneyDataCodeList().then(doNowDataCodeList => {
            doNowDataCodeList = [...new Set(doNowDataCodeList)]

            let newDataCodeList = []
            componentData.shComponentCodeList.forEach(shCode => {
                newDataCodeList.push("sh" + shCode)
            })
            componentData.szComponentCodeList.forEach(shCode => {
                newDataCodeList.push("sz" + shCode)
            })

            for(let i=0;i<newDataCodeList.length;i++){
                for(let j=0;j<doNowDataCodeList.length;j++){
                    if(newDataCodeList[i]==doNowDataCodeList[j]){
                        console.log("代码为" + newDataCodeList[i] + "的数据,已经获取过,不需要重复获取")
                        newDataCodeList.splice(i,1)
                        i--;
                        j--;
                    }
                }
            }

            resolve(newDataCodeList)
        })
    }).then(newDataCodeList => {
        console.log("需要获取数据的总数为",newDataCodeList.length)
        var task = []
        for(let i = 0;i<newDataCodeList.length;){
            let j = i + 200
            if(j > newDataCodeList.length){
                j = newDataCodeList.length
            }
            let codeListTmp = newDataCodeList.slice(i,j)
            task.push(callback => {
                console.log("开始获取实时数据-->",codeListTmp.length)
                networkUtil.getQQMoneyFlow(codeListTmp).then(dataStr => {
                    
                    dataStoreUtil.storeQQNewMoneyFlowData(dataStr)

                    setTimeout(function () {
                        callback(null)
                    }, 4000)
                }).catch(err => {
                    console.log(err)
                })
            })

            i = j
        }

        async.waterfall(task, function (err, result) {
            if (err) return console.log(err);
        })
    })
}

module.exports = {
    getQQMoneyData
}