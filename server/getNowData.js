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
async function getNowData() {

    new Promise(resolve => {
        dataStoreUtil.getDoNowDataCodeList().then(doNowDataCodeList => {
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
                networkUtil.getNowData(codeListTmp).then(dataStr => {
                    // 加入doCompanyCode,防止重复获取
                    dataStoreUtil.addToDoNowDataCodeList(codeListTmp)
                    
                    // 将字符串类型的数据转换成数组类型
                    let arrTmp = dataTranUtil.getNowDataFormStr(dataStr)

                    // 将实时数据转换成历史数据
                    arrTmp.forEach((item,index) => {
                        arrTmp[index] = dataTranUtil.getHistoryDataFormNowData(item)
                    })

                    console.log("将数据存储到文件系统中")
                    console.log("存储的数据长度为",arrTmp.length)
                    dataStoreUtil.storeNowData(arrTmp)

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
    getNowData
}