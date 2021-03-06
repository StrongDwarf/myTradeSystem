/**
 * 获取今天的日期
 */
function getNowDateYYYYMMDD() {
    /*
    let date = new Date()
    let year = date.getFullYear()
    let month = (date.getMonth() + 1) > 9 ? (date.getMonth() + 1) : "0" + (date.getMonth() + 1)
    let day = date.getDate() > 9 ? date.getDate() : "0" + date.getDate()
    return "" + year + month + day*/
    return getWorkDayList(3)[0]
}

/**
 * 获取昨天的日期
 */
function getYesTerDateYYYYMMDD() {
    let date = new Date((new Date()).getTime() - 1000*60*60*24)
    let year = date.getFullYear()
    let month = (date.getMonth() + 1) > 9 ? (date.getMonth() + 1) : "0" + (date.getMonth() + 1)
    let day = date.getDate() > 9 ? date.getDate() : "0" + date.getDate()
    return "" + year + month + day
}

function getNowDateHHMMSS(){
    return ((new Date()) + "").slice(16,24)
}

/**
 * 获取最近n天的工作日列表:从最近到最远
 */
function getWorkDayList(n){
    let workDayList = ["20200424","20200423","20200422","20200421","20200420","20200417","20200416","20200415","20200414","20200413","20200412","20200411"]
    return workDayList.slice(0,n)
}

module.exports = {
    getNowDateYYYYMMDD,
    getWorkDayList,
    getNowDateHHMMSS,
    getYesTerDateYYYYMMDD
}