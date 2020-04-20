var http = require('http')
var componentData = require("./data/companyData")
var async = require("async")
var fs = require('fs');
var path = require("path");
var fsUtil = require('./utils/fsUtil')


/**
 * 使用HTTP获取历史交易
 * @param {*} options 
 */
function getHistoryData(symbol, scale, ma, datelen) {
    
    console.log("开始获取历史数据,编号-->" + symbol)
    return new Promise(resolve => {
        // symbol=sz002681&scale=60&ma=5&datalen=1023
        let url = "http://money.finance.sina.com.cn/quotes_service/api/json_v2.php/CN_MarketData.getKLineData" +
            "?symbol=" + symbol + "&scale=" + scale + "&ma=" + ma + "&datalen=" + datelen
        // 拼接参数
        http.get(url, function (res) {
            var data = '';
            res.on('data', function (chunk) {
                data += chunk;
            });
            res.on('end', function () {
                console.log("获取历史数据成功,编号-->" + symbol)
                resolve(eval(data))
            })
        })
    })
}

/**
 * 获取连续3天都是跌的股票代码
 */
async function getThreeDropCode() {
    console.log("开始获取连跌3天的股票代码")
    // 连跌3天的股票代码
    let dropThreeCodeObj = {
        shCodeList: [],
        szCodeList: [],
        cybCodeList: []
    }
    // 连续缩量3天的股票代码
    let volumnReduceObj = {
        shCodeList: [],
        szCodeList: [],
        cybCodeList: []
    }

    new Promise(resolve => {
        getDoCompanyCodeList().then(codeList => {
            codeList = [...new Set(codeList)]

            for(let i=0;i<componentData.shComponentCodeList.length;i++){
                for(let j=0;j<codeList.length;j++){
                    if(componentData.shComponentCodeList[i]==codeList[j]){
                        console.log("股票代码为" + componentData.shComponentCodeList[i] + "的股票,已经校验过,不需重复校验")
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

            /*
            // 去除已经校验过的代码
            componentData.shComponentCodeList.forEach((code1, index) => {
                codeList.forEach(code2 => {
                    if (code1 == code2) {
                        console.log("股票代码为" + code1 + "的股票,已经校验过,不需重复校验")
                        componentData.shComponentCodeList.splice(index, 1)
                    }
                })
            })

            componentData.szComponentCodeList.forEach((code1, index) => {
                codeList.forEach(code2 => {
                    if (code1 == code2) {
                        console.log("股票代码为" + code1 + "的股票,已经校验过,不需重复校验")
                        componentData.szComponentCodeList.splice(index, 1)
                    }
                })
            })*/

            resolve(componentData)
        })
    }).then(data => {
        var task = []

        console.log("开始校验上证股票")
        componentData.shComponentCodeList.forEach((companyCode) => {

            task.push(callback => {
                getHistoryData("sh" + companyCode, "60", "5", "13").then(dataList => {
                    // 加入doCompanyCode,防止重复获取
                    addToDoCompanyCodeList(companyCode)

                    console.log("判断是否连跌3天")
                    if (isDropThreeDay(dataList)) {
                        console.log("是连跌3天")
                        addToDropThreeDayCodeList(companyCode)
                        dropThreeCodeObj.shCodeList.push(companyCode)
                    } else {
                        console.log("不是连跌3天")
                    }

                    console.log("判断是否缩量3天")
                    if (isVolumnReduce(dataList)) {
                        console.log("是缩量3天")
                        addToVolumnReduceCodeList(companyCode)
                        volumnReduceObj.shCodeList.push(companyCode)
                    } else {
                        console.log("不是缩量3天")
                    }

                    if (isVolumnReduce(dataList) && isDropThreeDay(dataList)) {
                        addToDropAndReduceCodeList(companyCode)
                    }

                    setTimeout(function () {
                        callback(null)
                    }, 10000)
                }).catch(err => {
                    console.log(err)
                })
            })
        })

        task.push(callback => {
            console.log("上证股票校验完毕,上证中连跌3天的股票代码为-->" + JSON.stringify(dropThreeCodeObj.shCodeList))
            console.log("上证股票校验完毕,上证中缩量3天的股票代码为-->" + JSON.stringify(volumnReduceObj.shCodeList))
            console.log("上证股票中连续缩量下跌3天的股票代码为-->" + JSON.stringify(getInnerArray(volumnReduceObj.shCodeList, dropThreeCodeObj.shCodeList)))

            console.log("开始校验深圳股票")
            callback(null)
        })

        componentData.szComponentCodeList.forEach((companyCode) => {

            task.push(callback => {
                getHistoryData("sz" + companyCode, "60", "5", "13").then(dataList => {
                    // 加入doCompanyCode,防止重复获取
                    addToDoCompanyCodeList(companyCode)

                    console.log("判断是否连跌3天")
                    if (isDropThreeDay(dataList)) {
                        console.log("是连跌3天")
                        addToDropThreeDayCodeList(companyCode)
                        dropThreeCodeObj.szCodeList.push(companyCode)
                    } else {
                        console.log("不是连跌3天")
                    }

                    console.log("判断是否缩量3天")
                    if (isVolumnReduce(dataList)) {
                        console.log("是缩量3天")
                        addToVolumnReduceCodeList(companyCode)
                        volumnReduceObj.szCodeList.push(companyCode)
                    } else {
                        console.log("不是缩量3天")
                    }

                    if (isVolumnReduce(dataList) && isDropThreeDay(dataList)) {
                        addToDropAndReduceCodeList(companyCode)
                    }

                    setTimeout(function () {
                        callback(null)
                    }, 10000)
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

/**
 * 判断是否连续跌了3天
 */
function isDropThreeDay(dataList) {
    if (!dataList || dataList.length != 13) {
        console.log("当前股票数据异常")
        console.log("异常数据" + dataList)
        return false
    }
    // 最近4天的收盘价格
    let oneDayPrice = dataList[0].close,
        twoDayPrice = dataList[4].close,
        threeDayPrice = dataList[8].close,
        fourDayPrice = dataList[12].close;
    console.log("最近4天的收盘价格为-->" + oneDayPrice + "," + twoDayPrice + "," + threeDayPrice + "," + fourDayPrice)

    if (oneDayPrice > twoDayPrice) {
        return false
    }

    if (twoDayPrice > threeDayPrice) {
        return false
    }

    if (threeDayPrice > twoDayPrice) {
        return false
    }

    if (fourDayPrice > threeDayPrice) {
        return false
    }

    return true
}

/**
 * 判断是否连续3天交易量缩量
 */
function isVolumnReduce(dataList) {
    if (!dataList || dataList.length != 13) {
        console.log("当前股票数据异常")
        console.log("异常数据" + dataList)
        return false
    }

    let oneVolumn = Number(dataList[1].volume) + Number(dataList[2].volume) + Number(dataList[3].volume) + Number(dataList[4].volume)
    let twoVolumn = Number(dataList[5].volume) + Number(dataList[6].volume) + Number(dataList[7].volume) + Number(dataList[8].volume)
    let threeVolumn = Number(dataList[9].volume) + Number(dataList[10].volume) + Number(dataList[11].volume) + Number(dataList[12].volume)

    console.log("最近3天的成交量为-->" + oneVolumn + "," + twoVolumn + "," + threeVolumn + ",")

    if (oneVolumn < twoVolumn) {
        return false
    }
    if (twoVolumn < threeVolumn) {
        return false
    }

    return true
}

/**
 * 数组取交集
 */
function getInnerArray(arr1, arr2) {
    if (!arr1 || arr1.length == 0) {
        return []
    }

    if (!arr2 || arr2.length == 0) {
        return []
    }
    arr1 = [...new Set(arr1)]

    let innerArray = []

    arr1.forEach(item1 => {
        arr2.forEach(item2 => {
            if (item1 == item2) {
                innerArray.push(item1)
            }
        })
    })

    return innerArray
}

/**
 * 以附加的方式添加到文件中
 */
function addToFile(fileName, String) {
    fs.writeFile('./try4.txt', 'HelloWorld\n', { 'flag': 'a' }, function (err) {
        if (err) {
            console.log(err);
        }
    });
}

/**
 * 从文件中读
 */
function readFormFile(fileName) {
    return new Promise(resolve => {
        fs.readFile('./try4.txt', 'utf-8', function (err, data) {
            if (err) {
                throw err;
            }
            resolve(data);
        });
    })
}

/**
 * 获取已经校验了的股票代码
 */
function getDoCompanyCodeList() {
    let rootPath = fsUtil.getRootPath()
    let doCompanyCodeFilePath = rootPath + "\\data\\dayData\\" + getNowDateYYYYMMDD() + "\\doCompanyCode.txt"
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
 * 写入已经校验了的股票代码
 */
function addToDoCompanyCodeList(companyCode) {
    let rootPath = fsUtil.getRootPath()
    let doCompanyCodeFilePath = rootPath + "\\data\\dayData\\" + getNowDateYYYYMMDD() + "\\doCompanyCode.txt"
    fsUtil.addToFile(doCompanyCodeFilePath, companyCode + ",")
}

/**
 * 写入连跌3天的股票代码
 */
function addToDropThreeDayCodeList(companyCode) {
    let rootPath = fsUtil.getRootPath()
    let doCompanyCodeFilePath = rootPath + "\\data\\dayData\\" + getNowDateYYYYMMDD() + "\\dropThreeDayCode.txt"
    fsUtil.addToFile(doCompanyCodeFilePath, companyCode + ",")
}

/**
 * 写入缩量3天的股票代码
 */
function addToVolumnReduceCodeList(companyCode) {
    let rootPath = fsUtil.getRootPath()
    let doCompanyCodeFilePath = rootPath + "\\data\\dayData\\" + getNowDateYYYYMMDD() + "\\volumnReduce.txt"
    fsUtil.addToFile(doCompanyCodeFilePath, companyCode + ",")
}

/**
 * 写入缩量3天并且连跌3天的股票代码
 */
function addToDropAndReduceCodeList(companyCode) {
    let rootPath = fsUtil.getRootPath()
    let doCompanyCodeFilePath = rootPath + "\\data\\dayData\\" + getNowDateYYYYMMDD() + "\\dropAndReduce.txt"
    fsUtil.addToFile(doCompanyCodeFilePath, companyCode + ",")
}

/**
 * 获取今天的日期
 */
function getNowDateYYYYMMDD() {
    let date = new Date()
    let year = date.getFullYear()
    let month = (date.getMonth() + 1) > 9 ? (date.getMonth() + 1) : "0" + (date.getMonth() + 1)
    let day = date.getDate() > 9 ? date.getDate() : "0" + date.getDate()
    return "" + year + month + day
}



getDoCompanyCodeList().then(data => {
    console.log("data",data)
})
getThreeDropCode()
/*
addToFile()
addToFile()
addToFile()
addToFile()

readFormFile().then(data => {
    console.log("data",data)
})
let rootPath = path.resolve('./')
fsUtil.addToFile(rootPath + "\\data\\dayData\\20200419\\doCompanyCode.txt","600302")
getDoCompanyCodeList().then(data => {
    console.log("data",data)
})

addToDoCompanyCodeList("600100")
addToDoCompanyCodeList("600101")
addToDoCompanyCodeList("600102")

addToDoCompanyCodeList("600101")
addToDoCompanyCodeList("600102")
addToDoCompanyCodeList("600103")
addToDoCompanyCodeList("600104")
addToDoCompanyCodeList("600105")

addToDropThreeDayCodeList("600101")
addToVolumnReduceCodeList("600101")
addToDropAndReduceCodeList("600101")

addToDropThreeDayCodeList("600102")
addToVolumnReduceCodeList("600102")
addToDropAndReduceCodeList("600102")

let dataList = [
    {day:"2020-04-14 15:00:00",open:"2608.625",high:"2623.155",low:"2606.820",close:"2623.036",volume:"1368909700",ma_price5:2605.498,ma_volume5:954984660},
    {day:"2020-04-15 10:30:00",open:"2617.907",high:"2623.092",low:"2612.430",close:"2614.785",volume:"1516527900",ma_price5:2610.293,ma_volume5:1099919480},
    {day:"2020-04-15 11:30:00",open:"2615.121",high:"2616.889",low:"2607.854",close:"2614.677",volume:"829194400",ma_price5:2612.59,ma_volume5:991340780}
    ,{day:"2020-04-15 14:00:00",open:"2614.744",high:"2620.616",low:"2610.463",close:"2614.449",volume:"730499800",ma_price5:2615.11,ma_volume5:1034859320},
    {day:"2020-04-15 15:00:00",open:"2613.982",high:"2614.572",low:"2606.659",close:"2609.139",volume:"895790100",ma_price5:2615.217,ma_volume5:1068184380},
    {day:"2020-04-16 10:30:00",open:"2596.144",high:"2611.068",low:"2595.968",close:"2609.485",volume:"1633383900",ma_price5:2612.507,ma_volume5:1121079220},
    {day:"2020-04-16 11:30:00",open:"2610.182",high:"2615.060",low:"2601.505",close:"2602.723",volume:"754475700",ma_price5:2610.095,ma_volume5:968668780},
    {day:"2020-04-16 14:00:00",open:"2603.134",high:"2614.611",low:"2603.134",close:"2611.890",volume:"697485000",ma_price5:2609.537,ma_volume5:942326900},
    {day:"2020-04-16 15:00:00",open:"2612.127",high:"2616.981",low:"2607.936",close:"2613.142",volume:"1109037300",ma_price5:2609.276,ma_volume5:1018034400},
    {day:"2020-04-17 10:30:00",open:"2626.647",high:"2638.334",low:"2617.632",close:"2637.021",volume:"1965444600",ma_price5:2614.852,ma_volume5:1231965300},
    {day:"2020-04-17 11:30:00",open:"2636.975",high:"2639.477",low:"2630.274",close:"2638.028",volume:"683726500",ma_price5:2620.561,ma_volume5:1042033820},
    {day:"2020-04-17 14:00:00",open:"2638.503",high:"2650.742",low:"2637.153",close:"2648.942",volume:"1029393400",ma_price5:2629.805,ma_volume5:1097017360},
    {day:"2020-04-17 15:00:00",open:"2648.231",high:"2650.053",low:"2632.845",close:"2637.907",volume:"1163680500",ma_price5:2635.008,ma_volume5:1190256460}]

let dataList = [{day:"2020-04-14 15:00:00",open:"1.150",high:"1.150",low:"1.140",close:"1.150",volume:"30770880",ma_price5:1.144,ma_volume5:28365485},{day:"2020-04-15 10:30:00",open:"1.140",high:"1.150",low:"1.140",close:"1.140",volume:"19204390",ma_price5:1.144,ma_volume5:28345243},{day:"2020-04-15 11:30:00",open:"1.140",high:"1.150",low:"1.140",close:"1.150",volume:"32777620",ma_price5:1.146,ma_volume5:29214403},{day:"2020-04-15 14:00:00",open:"1.150",high:"1.150",low:"1.130",close:"1.140",volume:"33666766",ma_price5:1.146,ma_volume5:33335776},{day:"2020-04-15 15:00:00",open:"1.130",high:"1.150",low:"1.130",close:"1.130",volume:"20572912",ma_price5:1.142,ma_volume5:27398514},{day:"2020-04-16 10:30:00",open:"1.130",high:"1.140",low:"1.130",close:"1.140",volume:"24367866",ma_price5:1.14,ma_volume5:26117911},{day:"2020-04-16 11:30:00",open:"1.140",high:"1.140",low:"1.130",close:"1.140",volume:"7129200",ma_price5:1.14,ma_volume5:23702873},{day:"2020-04-16 14:00:00",open:"1.140",high:"1.140",low:"1.130",close:"1.140",volume:"12437060",ma_price5:1.138,ma_volume5:19634761},{day:"2020-04-16 15:00:00",open:"1.130",high:"1.140",low:"1.130",close:"1.130",volume:"24746627",ma_price5:1.136,ma_volume5:17850733},{day:"2020-04-17 10:30:00",open:"1.140",high:"1.140",low:"1.130",close:"1.140",volume:"22245400",ma_price5:1.138,ma_volume5:18185231},{day:"2020-04-17 11:30:00",open:"1.130",high:"1.140",low:"1.130",close:"1.140",volume:"5750140",ma_price5:1.138,ma_volume5:14461685},{day:"2020-04-17 14:00:00",open:"1.140",high:"1.140",low:"1.130",close:"1.140",volume:"19474440",ma_price5:1.138,ma_volume5:16930733},{day:"2020-04-17 15:00:00",open:"1.130",high:"1.140",low:"1.130",close:"1.140",volume:"1147683",ma_price5:1.138,ma_volume5:18672858}]
    console.log(isVolumnReduce(dataList))*/