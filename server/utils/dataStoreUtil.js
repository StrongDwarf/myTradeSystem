/**
 * 数据存储工具类
 */
var fsUtil = require('./fsUtil')
var dateUtil = require('./dateUtil')

const dayDataFileName = "dayTradeData.txt"
/**
 * 添加到每日数据中
 */
function addToDayTradeData(companyCode,data){
    let rootPath = fsUtil.getRootPath()
    let filePath = rootPath + "\\data\\dayData\\" + data.day + "\\dayTradeData.txt"
    let str = companyCode + ":" + data.open + "," + data.close + "," + data.high + "," + data.low + "," + data.volumn + ";\n"
    fsUtil.addToFile(filePath, str)
}

/**
 * 写入已经校验了的代码
 */
function addToDoCompanyCodeList(companyCode) {
    let rootPath = fsUtil.getRootPath()
    let doCompanyCodeFilePath = rootPath + "\\data\\dayData\\" + dateUtil.getNowDateYYYYMMDD() + "\\doCompanyCode.txt"
    fsUtil.addToFile(doCompanyCodeFilePath, companyCode + ",")
}

/**
 * 获取某天的数据
 */
function getDataByDay(day){
    let rootPath = fsUtil.getRootPath()
    let filePath = rootPath + "\\data\\dayData\\" + day + "\\" + dayDataFileName
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

module.exports = {
    // 写入已经校验了的代码
    addToDoCompanyCodeList,
    // 添加到每日数据中
    addToDayTradeData,
    getDataByDay

}

