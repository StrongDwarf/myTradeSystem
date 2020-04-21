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
    console.log("开始获取实时数据,代码列表-->" + codeList)
    let url = "http://hq.sinajs.cn/list="
    let codeStr = ""
    
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

module.exports = {
    getHistoryData,
    getNowData
}
