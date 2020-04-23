/**
 * 数据转换类
 */


/**
 * 解析实时数据
    数据类型
    var hq_str_sh600010="包钢股份,1.140,1.140,1.130,1.140,1.120,1.120,1.130,82540021,93029770.000,90923379,1.120,24487000,1.110,12300500,1.100,3466600,1.090,2842400,1.080,54657392,1.130,78585124,1.140,49323604,1.150,26271520,1.160,7948180,1.170,2020-04-21,11:30:00,00,";
    var hq_str_sh600048="保利地产,15.900,15.880,15.900,16.170,15.710,15.890,15.900,44333562,706435460.000,27500,15.890,34500,15.880,24900,15.870,13332,15.860,20700,15.850,79600,15.900,2700,15.910,2500,15.920,5000,15.930,10400,15.940,2020-04-21,11:30:00,00,";
*/
function getNowDataFormStr(str){
    let nowDataList = []

    // 去除空格和换行
    str = str.replace(/\ +/g, "").replace(/[\r\n]/g, "")
    str = str.replace(/varhq\_str\_/g,"")
    str = str.replace(/\"/g,"")
    
    let dataStrList = str.split(";")
    console.log("dataStrList.length",dataStrList.length)
    dataStrList.forEach(dataStr => {
        let dataItem = {
            code:null,
            name:null,
            toDayOpen:null,
            yesterdayClose:null,
            nowPrice:null,
            todayHigh:null,
            todayLow:null,
            volume:null,
            date:null,
            time:null
        }

        let arr = dataStr.split("=")
        if(arr.length == 2){
            dataItem.code = arr[0]
            let dataListTmp = arr[1].split(",")
            if(dataListTmp.length > 10){
                dataItem.name = dataListTmp[0]
                dataItem.toDayOpen = dataListTmp[1]
                dataItem.yesterdayClose = dataListTmp[2]
                dataItem.nowPrice = dataListTmp[3]
                dataItem.todayHigh = dataListTmp[4]
                dataItem.todayLow = dataListTmp[5]
                dataItem.volume = dataListTmp[8]
                dataItem.date = dataListTmp[30]
                dataItem.time = dataListTmp[31]
                nowDataList.push(dataItem)
            }
        }
    })
    console.log("nowDataList.length",nowDataList.length)

    return nowDataList
}

/**
 * 将以天为维度的数据转换为以code为维度的数据
 * 
 * [[{
        code:"sh600010",
        open:"123",
        close:"234",
        high:"233",
        low:"235",
        volume:1324245
    }],[{
        code:"sh600010",
        open:"123",
        close:"234",
        high:"233",
        low:"235",
        volume:1324245
    }]]

    ==》

    let a = {
        "sh600010":[{
            code:"sh600010",
            open:"123",
            close:"234",
            high:"233",
            low:"235",
            volume:1324245
        },{
            code:"sh600010",
            open:"123",
            close:"234",
            high:"233",
            low:"235",
            volume:1324245
        }]
    }
 * 
 */
function transDataFormDayToCode(twoDimensionalArray){
    let resultObj = {}
    twoDimensionalArray.forEach(arrItem => {
        arrItem.forEach(item => {
            if(!resultObj[item.code]){
                resultObj[item.code] = []
            }
            resultObj[item.code].push(item)
        })
    })

    return resultObj
}

/**
 * 将实时数据格式转换为历史数据的格式
 */
function getHistoryDataFormNowData(nowData){
    if(!nowData){
        return {}
    }

    return {
        code:nowData.code,
        open:nowData.toDayOpen,
        close:nowData.nowPrice,
        high:nowData.todayHigh,
        low:nowData.todayLow,
        volume:nowData.volume
    }
}

/**
 * 将实时资金流向的数据转换成对象
 * 
 * [{"r0_in":"0.0000","r0_out":"0.0000","r0":"0.0000","r1_in":"2960654.0000","r1_out":"1904322.0000","r1":"4864976.0000",
 * "r2_in":"6117636.0000","r2_out":"5513356.0000","r2":"11691850.0000","r3_in":"7865522.0000","r3_out":"6755830.0000",
 * "r3":"14621352.0000","curr_capital":"568545","name":"\u9996\u521b\u80a1\u4efd","trade":"3.2300","changeratio":"-0.00308642",
 * "volume":"9679500.0000","turnover":"17.025","r0x_ratio":"180","netamount":"2770304.0000","symbol":"sh600008"},
 * {"r0_in":"53431561.9200","r0_out":"80531768.0900","r0":"136351706.0100","r1_in":"71335003.7300","r1_out":"105584569.1600",
 * "r1":"184952064.8900","r2_in":"49480551.9400","r2_out":"46193072.8400","r2":"99849219.7800","r3_in":"15540418.4500",
 * "r3_out":"15395914.1100","r3":"32934742.5600","curr_capital":"109348","name":"\u4e0a\u6d77\u673a\u573a","trade":"66.8500",
 * "changeratio":"0.00224888","volume":"6774357.0000","turnover":"61.9525","r0x_ratio":"-87.8729","netamount":"-57917788.1600",
 * "symbol":"sh600009"}]
 */
function getMoneyDataFormStr(str){
    if(!str){
        return []
    }
    if(str.length == 0 || str[0] != '[' || str[str.length-1] != ']'){
        return []
    }
    return eval(str)
}


function test(){
    var str = 'var hq_str_sh600010="包钢股份,1.140,1.140,1.120,1.140,1.120,1.120,1.130,129089683,145372013.000,86228917,1.120,20286500,1.110,9269400,1.100,3149100,1.090,1713000,1.080,32645873,1.130,54142314,1.140,41403284,1.150,19956040,1.160,6205280,1.170,2020-04-21,15:00:01,00,";var hq_str_sh600048="保利地产,15.900,15.880,15.930,16.170,15.710,15.920,15.930,72101092,1148517228.000,4300,15.920,28900,15.910,37100,15.900,26000,15.890,70834,15.880,116978,15.930,160400,15.940,298400,15.950,55500,15.960,23500,15.970,2020-04-21,15:00:00,00,";'

    console.log(getNowDataFormStr(str))
}

// test()

module.exports = {
    // 解析实时数据
    getNowDataFormStr,
    // 将以天为维度的数据转换为以code为维度的数据
    transDataFormDayToCode,
    getHistoryDataFormNowData,
    getMoneyDataFormStr
}