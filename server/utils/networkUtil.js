var http = require('http')

/**
 * 使用HTTP获取历史交易
 * @param {*} options 
 */
function getHistoryData(symbol, scale, ma, datelen) {
    
    console.log("开始获取历史数据,编号-->" + symbol)
    return new Promise((resolve,reject) => {
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
        }).on('error',(e) => {
            console.log("获取数据失败",e.message)
            reject("获取数据失败")
        })
    })
}

/**
 * 使用HTTP获取实时数据
 */
function getNowData(codeList){
    console.log("开始获取实时数据")
    
    return new Promise((resolve,reject) => {
        let url = "http://hq.sinajs.cn/list="
        if(!codeList || codeList.length == 0){
            resolve("")
        }

        codeList.forEach(code => {
            url += code + ","
        })

        http.get(url, function (res) {
            var data = '';
            res.on('data', function (chunk) {
                data += chunk;
            });
            res.on('end', function () {
                console.log("获取实时数据成功")
                resolve(data)
            })
        }).on('error',(e) => {
            console.log("获取数据失败",e.message)
            reject("获取数据失败")
        })
    })
}

/**
 * 使用HTTP获取实时资金流向
 */
function getMoneyFlow(codeList){
    console.log("开始获取实时资金流向")
    
    return new Promise((resolve,reject) => {
        let url = "http://vip.stock.finance.sina.com.cn/quotes_service/api/json_v2.php/MoneyFlow.ssi_ssfx_flzjtj?daima="
        if(!codeList || codeList.length == 0){
            resolve("")
        }

        codeList.forEach(code => {
            url += code + ","
        })

        http.get(url, function (res) {
            var data = '';
            res.on('data', function (chunk) {
                data += chunk;
            });
            res.on('end', function () {
                console.log("获取实时资金流向成功")
                resolve(data)
            })
        }).on('error',(e) => {
            console.log("获取数据失败",e.message)
            reject("获取数据失败")
        })
    })
}

/**
 * 
 * @param {*} codeList 
 */
function getQQMoneyFlow(codeList){
    console.log("开始获取数据")
    return new Promise((resolve,reject) => {
        let url = "http://qt.gtimg.cn/q="
        if(!codeList || codeList.length == 0){
            resolve("")
        }

        codeList.forEach(code => {
            url += "ff_" + code + ","
        })

        http.get(url, function (res) {
            var data = '';
            res.on('data', function (chunk) {
                data += chunk;
            });
            res.on('end', function () {
                resolve(data)
            })
        }).on('error',(e) => {
            console.log("获取数据失败",e.message)
            reject("获取数据失败")
        })
    })
}

module.exports = {
    getHistoryData,
    getNowData,
    getMoneyFlow,
    getQQMoneyFlow
}
