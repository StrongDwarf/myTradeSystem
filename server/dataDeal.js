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

function main(){
    let options = {
        dayNumber:3,        // 要校验的天数
        rate:0.4,             // 缩量比例,为0表示不校验缩量比例
        checkDorp:false,     // 校验下跌
        checkReduce:true,   // 校验缩量
        checkShade:true,    // 校验阴线
        checkReduceRate:false,// 校验缩量比例
        isUseNowData:false,     // 是否使用实时数据
        nowDataVolumeRate:1,   // 实时数据交易量转换比例

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

    workDayList.forEach(workDay => {
        task.push(callback => {
            console.log("开始获取"+workDay+"数据")
            dataStoreUtil.getDataByDay(workDay).then(codeDataList => {
                console.log("成功获取" + workDay + "数据")
                console.log(workDay + "数据的长度为" + codeDataList.length)
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
        console.log("转换后的数据长度为" + num)

        console.log("开始筛查连续下跌" + options.dayNumber + "天的数据")
        for(let code in codeDataObj){
            if(checkUtil.isAwayDrop(codeDataObj[code],options.dayNumber)){
                dorpCodeList.push(code)
            }
        }
        console.log("筛查成功")

        console.log("开始筛查连续缩量" + options.dayNumber + "天的数据")
        for(let code in codeDataObj){
            if(checkUtil.isAwayReduce(codeDataObj[code],options.dayNumber)){
                reduceCodeList.push(code)
            }
        }
        console.log("筛查成功")

        console.log("开始筛查连续阴线" + options.dayNumber + "天的数据")
        for(let code in codeDataObj){
            if(checkUtil.isAwayShade(codeDataObj[code],options.dayNumber)){
                shadeCodeList.push(code)
            }
        }
        console.log("筛查成功")

        console.log("开始筛查按比例缩量" + options.dayNumber + "天的数据")
        for(let code in codeDataObj){
            if(checkUtil.isReduceRate(codeDataObj[code],options.dayNumber,options.rate)){
                reduceRateList.push(code)
            }
        }
        console.log("筛查成功")

        console.log("连续下跌" + options.dayNumber + "天的数据集为",dorpCodeList)
        console.log("连续缩量" + options.dayNumber + "天的数据集为",reduceCodeList)
        console.log("连续阴线" + options.dayNumber + "天的数据集为",shadeCodeList)
        console.log("比例缩量" + options.dayNumber + "天的数据集为",reduceRateList)

        console.log("开始根据条件合并数据")
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

        console.log("数据合并完成,合并后的数据为",resultCodeList)
    })
}

main()
