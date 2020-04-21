/**
 * 数据存储工具类
 */
var fsUtil = require('./fsUtil')
var dateUtil = require('./dateUtil')

const dayDataFileName = "dayTradeData.txt"
const nowDataFileName = "nowTradeData.txt"
const doCompanyFileName = "doCompanyCode.txt"

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
 * 存储数据
 * @param {*} companyCode 代码
 * @param {*} dataList 数据列表
 */
function storeData(companyCode,dataList){
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

module.exports = {
    // 写入已经校验了的代码
    addToDoCompanyCodeList,
    // 添加到每日数据中
    addToDayTradeData,
    // 获取指定日期的数据
    getDataByDay,
    // 添加到实时数据中
    addToNewTradeData,
    storeData,
    getDoCompanyCodeList
}

