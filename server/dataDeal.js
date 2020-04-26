var http = require('http')
var componentData = require("./data/companyData")
var async = require("async")
var fs = require('fs');
var path = require("path");
var fsUtil = require('./utils/fsUtil')
var checkUtil = require('./utils/checkUtil')
var arrayUtil = require('./utils/arrayUtil')
var dataTranUtil = require("./utils/dataTranUtil")
var dateUtil = require("./utils/dateUtil")
var dataStoreUtil = require("./utils/dataStoreUtil")
var getNowData = require("./getNowData")
var getNowMoneyFlow = require("./getNowMoneyFlow")


function dataDeal(){
    let options = {
        dayNumber:5,        // 要校验的天数
        rate:0.5,             // 缩量比例,为0表示不校验缩量比例
        checkDorp:false,     // 校验下跌
        checkReduce:true,   // 校验缩量
        checkShade:false,    // 校验阴线
        checkReduceRate:true,// 校验缩量比例
        isUseNowData:true,     // 是否使用实时数据
        nowDataVolumeRate:1,   // 今日数据交易量转换比例
        lowestPrice:8,              // 最低价,设置最低价时,将除去价格低于最低价的代码
        useBlackCodeList:true, // 是否使用黑名单, 使用黑名单后,将清除在黑名单中的代码
        isStoreToFileSys:true, // 是否保存到文件系统中 设置保存到文件系统中后,将将合格的代码保存到文件系统中
        isMainIn:false,          // 是否筛选主力资金流入
    }

    let workDayList = dateUtil.getWorkDayList(options.dayNumber + 1),     // 工作日列表
        task = [],               // 任务数组
        workDayDataList = [],    // 工作日数据二维数组
        codeDataObj = {},        // 代码数据
        dorpCodeList = [],
        reduceCodeList = [],
        shadeCodeList = [],
        reduceRateList = [],
        resultCodeList = []

    // 使用实时数据
    if(options.isUseNowData){
        console.log("使用实时数据")
        let todayStr = workDayList.shift()
        task.push(callback => {
            dataStoreUtil.getDataByDay(todayStr,true).then(codeDataList => {
                // 实时数据交易量修正
                codeDataList.forEach(codeData => {
                    codeData.volume = codeData.volume*options.nowDataVolumeRate
                })

                workDayDataList.push(codeDataList)
                callback(null)
            }).catch(err => {
                console.error(err)
            })
        })
    }

    workDayList.forEach(workDay => {
        task.push(callback => {
            dataStoreUtil.getDataByDay(workDay).then(codeDataList => {
                workDayDataList.push(codeDataList)
                callback(null)
            }).catch(err => {
                console.error(err)
            })
        })
    })

    async.waterfall(task, function (err, result) {
        if(err){
            console.log(err)
        }

        console.log("成功获取所有数据,开始进行数据转换")
        codeDataObj = dataTranUtil.transDataFormDayToCode(workDayDataList)
        console.log("成功进行数据转换,开始筛选合格数据")
        let num = 0
        for(let code in codeDataObj){
            num ++
        }

        for(let code in codeDataObj){
            if(checkUtil.isAwayDrop(codeDataObj[code],options.dayNumber)){
                dorpCodeList.push(code)
            }
        }

        for(let code in codeDataObj){
            if(checkUtil.isAwayReduce(codeDataObj[code],options.dayNumber)){
                reduceCodeList.push(code)
            }
        }

        for(let code in codeDataObj){
            if(checkUtil.isAwayShade(codeDataObj[code],options.dayNumber)){
                shadeCodeList.push(code)
            }
        }
        for(let code in codeDataObj){
            if(checkUtil.isReduceRate(codeDataObj[code],options.dayNumber,options.rate)){
                reduceRateList.push(code)
            }
        }

        if(options.checkDorp){
            if(dorpCodeList.length == 0){
                resultCodeList = []
            }else{
                if(resultCodeList.length == 0){
                    resultCodeList = dorpCodeList
                }else{
                    resultCodeList = arrayUtil.getInnerArray(resultCodeList,dorpCodeList)
                }
            }
        }

        if(options.checkReduce){
            if(reduceCodeList.length == 0){
                resultCodeList = []
            }else{
                if(resultCodeList.length == 0){
                    resultCodeList = reduceCodeList
                }else{
                    resultCodeList = arrayUtil.getInnerArray(resultCodeList,reduceCodeList)
                }
            }
        }

        if(options.checkShade){
            if(shadeCodeList.length == 0){
                resultCodeList = []
            }else{
                if(resultCodeList.length == 0){
                    resultCodeList = shadeCodeList
                }else{
                    resultCodeList = arrayUtil.getInnerArray(resultCodeList,shadeCodeList)
                }
            }
        }

        if(options.checkReduceRate){
            if(reduceRateList.length == 0){
                resultCodeList = []
            }else{
                if(resultCodeList.length == 0){
                    resultCodeList = reduceRateList
                }else{
                    resultCodeList = arrayUtil.getInnerArray(resultCodeList,reduceRateList)
                }
            }
        }

        // 是否使用黑名单
        if(options.useBlackCodeList){
            arrayUtil.fliterInArr2(resultCodeList,componentData.blackComponentCodeList)
        }

        // 是否剔除低价
        if(options.lowestPrice > -1){
            let lowestCodeList = []
            for(let code in codeDataObj){
                if(Number(codeDataObj[code][0].close) > options.lowestPrice){
                    lowestCodeList.push(code)
                }
            }
            resultCodeList = arrayUtil.getInnerArray(resultCodeList,lowestCodeList)
        }
        console.log("筛选主力流动之前的数据集为",resultCodeList)

        if(options.isMainIn){
            getTodayMainIn().then(mainInList => {
                resultCodeList = arrayUtil.getInnerArray(resultCodeList,mainInList)

                console.log("符合条件的数据集为",resultCodeList)
                if(options.isStoreToFileSys){
                    dataStoreUtil.addTodayResult(resultCodeList)
                }
            })
        }else{
            console.log("符合条件的数据集为",resultCodeList)
            if(options.isStoreToFileSys){
                dataStoreUtil.addTodayResult(resultCodeList)
            }
        }

        


    })
}

/**
 * 资金流动相关处理操作
 */
function getTodayMainIn(){
    return new Promise((resolve,reject) => {
        let task = []
        let resultCode = []

        dataStoreUtil.getQQMoneyDataByDay(dateUtil.getWorkDayList()[0]).then(codeDataList => {
                
            // 数据处理
            codeDataList.forEach(codeData => {
                if(codeData.mainClearIn > 0){
                    resultCode.push(codeData.code)
                }
            })

            console.log("主力资金流入数为" + resultCode.length + "  第一个为" + resultCode[0])
            resolve(resultCode)
        }).catch(err => {
            console.error(err)
        })
    })
}



function main(){
    // 文件初始化
    dataStoreUtil.fsInit()

    // 数据初始化
    getNowData.getNowData()
    getNowMoneyFlow.getQQMoneyData()

    // 数据处理
}


main()
// dataDeal()