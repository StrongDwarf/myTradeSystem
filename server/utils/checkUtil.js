/**
 * 判断是否连续n天一直是连续下跌
 */
function isAwayDrop(dataList,n){
    if(dataList.length < n+1){
        return false
    }

    // 下跌,即今天的close比昨天的close低
    for(let i =0;i<n;i++){
        if(Number(dataList[i].close) > Number(dataList[i+1].close)){
            return false
        }
    }
    return true
}

/**
 * 判断是否一直是阴线
 */
function isAwayShade(dataList,n){
    if(dataList.length < n+1){
        return false
    }
    // 阴线,即close比open高
    for(let i =0;i<n;i++){
        if(Number(dataList[i].close) > Number(dataList[i].open)){
            return false
        }
    }
    return true
}

/**
 * 判断是否一直是缩量
 */
function isAwayReduce(dataList,n){
    if(dataList.length < n+1){
        return false
    }
    // 缩量,及今天的交易量比昨天的交易量低
    for(let i =0;i<n;i++){
        if(Number(dataList[i].volume) > Number(dataList[i+1].volume)){
            return false
        }
    }
    return true
}

/**
 * 判断是否在n天内缩量了rate
 */
function isReduceRate(dataList,n,rate){
    if(dataList.length < n+1){
        return false
    }
    // 在3天内缩量了0.5,表示今天的量比昨天或者前天最高的量减少了0.5
    let largestVolume = 0
    for(let i =0;i<n;i++){
        if(Number(dataList[i].volume) > largestVolume){
            largestVolume = Number(dataList[i].volume)
        }
    }
    if((largestVolume - dataList[0].volume)/largestVolume > rate){
        return true
    }
    return false
}

module.exports = {
    isAwayDrop,
    isAwayShade,
    isAwayReduce,
    isReduceRate
}