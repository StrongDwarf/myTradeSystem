/**
 * 数据存储工具类
 */
var fsUtil = require('./fsUtil')
var dateUtil = require('./dateUtil')
var fs = require('fs')

const dayDataFileName = "dayTradeData.txt"
const nowDataFileName = "nowTradeData.txt"
const newMoneyFlowFileName = "newMoneyFlow.txt"
const QQnewMoneyFlowFileName = "qqNewMoneyFlow.txt"
const doCompanyFileName = "doCompanyCode.txt"
const doNowDataFileName = "doNowData.txt"
const doNowMoneyFlowFileName = "doMoneyFlow.txt"
const resultFileName = "result.txt"

/**
 * 添加到每日数据中
 */
function addToDayTradeData(companyCode,data){
    let rootPath = fsUtil.getRootPath()
    let filePath = rootPath + "\\data\\dayData\\" + data.day + "\\" + dayDataFileName
    let str = companyCode + ":" + data.open + "," + data.close + "," + data.high + "," + data.low + "," + data.volumn + ";\n"
    fsUtil.addToFile(filePath, str)
}

/**
 * 添加到每日结果中
 */
function addTodayResult(codeList){
    let str = dateUtil.getNowDateHHMMSS() + ": "
    codeList.forEach(code => {
        str += code +  ","
    })
    str += "\n"

    let rootPath = fsUtil.getRootPath()
    let filePath = rootPath + "\\data\\dayData\\" + dateUtil.getNowDateYYYYMMDD() + "\\" + resultFileName
    fsUtil.addToFile(filePath, str)
}

/**
 * 添加到实时的数据中
 */
function addToNewTradeData(dataList){
    let str = ""
    dataList.forEach(newData => {
        str += newData.code + ":" + newData.open + "," + newData.close + "," + newData.high + "," + newData.low + "," + newData.volumn + ";\n"
    })

    let rootPath = fsUtil.getRootPath()
    let filePath = rootPath + "\\data\\dayData\\" + dateUtil.getNowDateYYYYMMDD() + "\\" + nowDataFileName
    fsUtil.addToFile(filePath, str)
}

/**
 * 添加到qq实时资金流向数据中
 */
function storeQQNewMoneyFlowData(dataStr){
    dataStr = dataStr.replace(/v\_ff\_/g,"").replace(/\~/g,",").replace(/\=/g,":").replace(/\"/g,"").replace(/;/g,";\n")
    let rootPath = fsUtil.getRootPath()
    let filePath = rootPath + "\\data\\dayData\\" + dateUtil.getNowDateYYYYMMDD() + "\\" + QQnewMoneyFlowFileName
    fsUtil.addToFile(filePath, dataStr)
}

/**
 * 添加到实时资金流向数据中
 * 
 * {"r0_in":"0.0000","r0_out":"0.0000","r0":"0.0000","r1_in":"2960654.0000","r1_out":"1904322.0000","r1":"4864976.0000",
 * "r2_in":"6117636.0000","r2_out":"5513356.0000","r2":"11691850.0000","r3_in":"7865522.0000","r3_out":"6755830.0000",
 * "r3":"14621352.0000","curr_capital":"568545","name":"\u9996\u521b\u80a1\u4efd","trade":"3.2300","changeratio":"-0.00308642",
 * "volume":"9679500.0000","turnover":"17.025","r0x_ratio":"180","netamount":"2770304.0000","symbol":"sh600008"}
 */
function addToNewMoneyFlow(dataList){
    let str = ""
    dataList.forEach(newData => {
        str += newData.symbol + ":" + newData.r0_in + "," + newData.r0_out + "," + newData.r1_in + "," + newData.r1_out + ","
             + newData.r2_in + "," + newData.r2_out + "," + newData.r3_in + "," + newData.r3_out + ";\n"
    })

    let rootPath = fsUtil.getRootPath()
    let filePath = rootPath + "\\data\\dayData\\" + dateUtil.getNowDateYYYYMMDD() + "\\" + newMoneyFlowFileName
    fsUtil.addToFile(filePath, str)
}

/**
 * 写入已经校验了的代码
 */
function addToDoCompanyCodeList(companyCode) {
    let rootPath = fsUtil.getRootPath()
    let doCompanyCodeFilePath = rootPath + "\\data\\dayData\\" + dateUtil.getNowDateYYYYMMDD() + "\\" + doCompanyFileName
    fsUtil.addToFile(doCompanyCodeFilePath, companyCode + ",")
}

/**
 * 获取某天的数据
 * @param {String} day 那天,
 * @param {Boolean} isNow 是否使用实时获取的数据
 */
function getDataByDay(day,isNow){
    let rootPath = fsUtil.getRootPath()
    let filePath = rootPath + "\\data\\dayData\\" + day + "\\"
    if(isNow){
        filePath += nowDataFileName
    }else{
        filePath += dayDataFileName
    }
    return new Promise(resolve => {
        fsUtil.readFormFile(filePath).then(str => {
            let codeDataList = []

            str = str.replace(/\ +/g, "").replace(/[\r\n]/g, "")
            
            let itemDataStrList = str.split(";")
            itemDataStrList.pop()
            itemDataStrList.forEach(item => {
                let codeData = {
                    code:null,
                    open:null,
                    close:null,
                    high:null,
                    low:null,
                    volume:null
                }

                let arrTmp = item.split(":")
                if(arrTmp.length != 2){
                    return
                }

                let arrTmp2 = arrTmp[1].split(",")
                if(arrTmp2.length != 5){
                    return
                }
                codeData.code = arrTmp[0]
                codeData.open = arrTmp2[0]
                codeData.close = arrTmp2[1]
                codeData.high = arrTmp2[2]
                codeData.low = arrTmp2[3]
                codeData.volume = arrTmp2[4]

                codeDataList.push(codeData)
            })

            resolve(codeDataList)
        })
    })
}

/**
 * 获取某天的资金流动数据
 */
function getMoneyDataByDay(day){
    let rootPath = fsUtil.getRootPath()
    let filePath = rootPath + "\\data\\dayData\\" + day + "\\" + newMoneyFlowFileName
    return new Promise(resolve => {
        fsUtil.readFormFile(filePath).then(str => {
            let codeDataList = []

            str = str.replace(/\ +/g, "").replace(/[\r\n]/g, "")
            
            let itemDataStrList = str.split(";")
            itemDataStrList.pop()
            itemDataStrList.forEach(item => {

                let codeData = {
                    code:null,
                    r0_in:null,
                    r0_out:null,
                    r1_in:null,
                    r1_out:null,
                    r2_in:null,
                    r2_out:null,
                    r3_in:null,
                    r3_out:null
                }

                let arrTmp = item.split(":")
                if(arrTmp.length != 2){
                    return
                }

                let arrTmp2 = arrTmp[1].split(",")
                if(arrTmp2.length < 5){
                    return
                }
                codeData.code = arrTmp[0]
                codeData.r0_in = arrTmp2[0]
                codeData.r0_out = arrTmp2[1]
                codeData.r1_in = arrTmp2[2]
                codeData.r1_out = arrTmp2[3]
                codeData.r2_in = arrTmp2[4]
                codeData.r2_out = arrTmp2[5]
                codeData.r3_in = arrTmp2[6]
                codeData.r3_out = arrTmp2[7]

                codeDataList.push(codeData)
            })

            resolve(codeDataList)
        })
    })
}

/**
 * 读取某天的数据
 */
function getQQMoneyDataByDay(day){
    let rootPath = fsUtil.getRootPath()
    let filePath = rootPath + "\\data\\dayData\\" + day + "\\" + QQnewMoneyFlowFileName
    return new Promise(resolve => {
        fsUtil.readFormFile(filePath).then(str => {
            let codeDataList = []

            str = str.replace(/\ +/g, "").replace(/[\r\n]/g, "")
            
            let itemDataStrList = str.split(";")
            itemDataStrList.pop()
            itemDataStrList.forEach(item => {

                let codeData = {
                    code:null,
                    mainIn:null,
                    mainOut:null,
                    mainClearIn:null,
                    mainClearRate:null,
                    littleIn:null,
                    littleOut:null,
                    littleClearIn:null,
                    littleClearRate:null,
                    moneySum:null,
                    codeName:null,
                }

                let arrTmp = item.split(":")
                if(arrTmp.length != 2){
                    return
                }

                let arrTmp2 = arrTmp[1].split(",")
                if(arrTmp2.length < 5){
                    return
                }
                codeData.code = arrTmp2[0]
                codeData.mainIn = Number(arrTmp2[1])
                codeData.mainOut = Number(arrTmp2[2])
                codeData.mainClearIn = Number(arrTmp2[3])
                codeData.mainClearRate = Number(arrTmp2[4])
                codeData.littleIn = Number(arrTmp2[5])
                codeData.littleOut = Number(arrTmp2[6])
                codeData.littleClearIn = Number(arrTmp2[7])
                codeData.littleClearRate = Number(arrTmp2[8])
                codeData.moneySum = Number(arrTmp2[9])
                codeData.codeName = arrTmp2[12]

                codeDataList.push(codeData)
            })

            resolve(codeDataList)
        })
    })
}

/**
 * 存储数据
 * @param {*} companyCode 代码
 * @param {*} dataList 数据列表
 */
function storeHistoryData(companyCode,dataList){
    // 将dataList根据年月日区分开
    
    // 整理日期格式
    dataList.forEach(item => {
        item.day = item.day.slice(0,10).split("-").join("")
    })

    let newDataList = []
    let dayList = []

    dataList.forEach(item => {
        let isExist = false
        dayList.forEach(day => {
            if(item.day == day){
                isExist = true
            }
        })
        if(!isExist){
            dayList.push(item.day)
            newDataList.push({
                day:item.day,
                open:0,
                high:0,
                low:0,
                close:0,
                volumnList:[]
            })
        }
    })

    dataList.forEach(item => {
        newDataList.forEach(newData => {
            if(item.day == newData.day){
                if(newData.open == 0){
                    newData.open = item.open
                }
                if(newData.high == 0){
                    newData.high = item.high
                }
                if(newData.low == 0){
                    newData.low = item.low
                }
                if(newData.high < item.high){
                    newData.hight = item.high
                }
                if(newData.low > item.low){
                    newData.low = item.low
                }
                newData.close = item.close
                newData.volumnList.push(item.volume)
            }
        })
    })

    newDataList.forEach(newData => {
        let sum = 0
        newData.volumnList.forEach(item => {
            sum += Number(item)
        })
        newData.volumn = sum
    })

    newDataList.forEach(newData => {
        if(newData.volumnList.length == 4){
            addToDayTradeData(companyCode,newData)
        }
    })
    
}

/**
 * 存储实时数据
 */
function storeNowData(dataList){
    let str = ""
    dataList.forEach(nowData => {
        str += nowData.code + ":" + nowData.open + "," + nowData.close + "," + nowData.high + "," + nowData.low + "," + nowData.volume + ";\n"
    })

    let filePath = fsUtil.getRootPath() + "\\data\\dayData\\" + dateUtil.getNowDateYYYYMMDD() + "\\" + nowDataFileName
    fsUtil.addToFile(filePath, str)
}

/**
 * 存储资金流动数据
 */
function storeMoneyData(dataList){
    let str = ""
    dataList.forEach(newData => {
        str += newData.symbol + ":" + newData.r0_in + "," + newData.r0_out + "," + newData.r1_in + "," + newData.r1_out + ","
             + newData.r2_in + "," + newData.r2_out + "," + newData.r3_in + "," + newData.r3_out + ";\n"
    })

    let filePath = fsUtil.getRootPath() + "\\data\\dayData\\" + dateUtil.getNowDateYYYYMMDD() + "\\" + newMoneyFlowFileName
    fsUtil.addToFile(filePath, str)
}

/**
 * 获取已经校验了的代码
 */
function getDoCompanyCodeList() {
    let rootPath = fsUtil.getRootPath()
    let doCompanyCodeFilePath = rootPath + "\\data\\dayData\\" + dateUtil.getNowDateYYYYMMDD() + "\\" + doCompanyFileName
    return new Promise(resolve => {
        fsUtil.readFormFile(doCompanyCodeFilePath).then(str => {
            str = str.replace(/\ +/g, "").replace(/[\r\n]/g, "")
            let codeList = str.split(",")
            codeList = [...new Set(codeList)]
            resolve(codeList)
        })
    })
}

/**
 * 写入已经获取了实时数据的代码
 */
function addToDoNowDataCodeList(codeList) {
    let str = ""
    codeList.forEach(code => {
        str += code+","
    })

    let rootPath = fsUtil.getRootPath()
    let doNowDataFilePath = rootPath + "\\data\\dayData\\" + dateUtil.getNowDateYYYYMMDD() + "\\" + doNowDataFileName
    fsUtil.addToFile(doNowDataFilePath, str)
}

function getDoNowDataCodeList() {
    let rootPath = fsUtil.getRootPath()
    let doNowDataFilePath = rootPath + "\\data\\dayData\\" + dateUtil.getNowDateYYYYMMDD() + "\\" + doNowDataFileName
    return new Promise(resolve => {
        fsUtil.readFormFile(doNowDataFilePath).then(str => {
            str = str.replace(/\ +/g, "").replace(/[\r\n]/g, "")
            let codeList = str.split(",")
            codeList = [...new Set(codeList)]
            resolve(codeList)
        })
    })
}

/**
 * 写入已经获取了实时数据的代码
 */
function addToDoMoneyDataCodeList(codeList) {
    let str = ""
    codeList.forEach(code => {
        str += code+","
    })

    let rootPath = fsUtil.getRootPath()
    let doNowDataFilePath = rootPath + "\\data\\dayData\\" + dateUtil.getNowDateYYYYMMDD() + "\\" + doNowMoneyFlowFileName
    fsUtil.addToFile(doNowDataFilePath, str)
}

function getDoMoneyDataCodeList() {
    let rootPath = fsUtil.getRootPath()
    let doNowDataFilePath = rootPath + "\\data\\dayData\\" + dateUtil.getNowDateYYYYMMDD() + "\\" + doNowMoneyFlowFileName
    return new Promise(resolve => {
        fsUtil.readFormFile(doNowDataFilePath).then(str => {
            str = str.replace(/\ +/g, "").replace(/[\r\n]/g, "")
            let codeList = str.split(",")
            codeList = [...new Set(codeList)]
            resolve(codeList)
        })
    })
}

/**
 * 文件系统初始化方法
 */
function fsInit(){
    let fsMk = fsUtil.getRootPath() + "\\data\\dayData\\" + dateUtil.getNowDateYYYYMMDD() + "\\"
    let yesterFsMk = fsUtil.getRootPath() + "\\data\\dayData\\" + dateUtil.getYesTerDateYYYYMMDD() + "\\"
    console.log("开始执行文件初始化方法")

    // 把昨天的实时数据转换成历史数据
    fsUtil.readFormFile(yesterFsMk + nowDataFileName).then(str => {
        fsUtil.writeToFile(yesterFsMk + dayDataFileName,str)
    })

    // 创建今天的文件目录
    fsUtil.createFileMk(fsMk).then(() => {
        fsUtil.clearFile(fsMk + dayDataFileName)
        fsUtil.clearFile(fsMk + nowDataFileName)
        fsUtil.clearFile(fsMk + newMoneyFlowFileName)
        fsUtil.clearFile(fsMk + QQnewMoneyFlowFileName)
        fsUtil.clearFile(fsMk + doCompanyFileName)
        fsUtil.clearFile(fsMk + doNowDataFileName)
        fsUtil.clearFile(fsMk + doNowMoneyFlowFileName)
        fsUtil.clearFile(fsMk + resultFileName)
    })
}


module.exports = {
    // 写入已经校验了的代码
    addToDoCompanyCodeList,
    // 添加到每日数据中
    addToDayTradeData,
    // 获取指定日期的数据
    getDataByDay,
    // 添加到实时数据中
    addToNewTradeData,
    // 存储数据
    storeHistoryData,
    // 获取已经获取了历史数据的代码列表
    getDoCompanyCodeList,
    // 添加到已经获取了实时数据的列表中
    addToDoNowDataCodeList,
    // 获取已经获取了实时数据的代码列表
    getDoNowDataCodeList,
    // 添加到已经获取了实时资金流动的列表中
    addToDoMoneyDataCodeList,
    // 获取已经获取了实时资金流动的代码列表
    getDoMoneyDataCodeList,
    storeNowData,
    addTodayResult,
    storeMoneyData,
    getMoneyDataByDay,
    fsInit,
    storeQQNewMoneyFlowData,
    getQQMoneyDataByDay
}

