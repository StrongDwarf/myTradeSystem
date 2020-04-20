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

module.exports = {
    getInnerArray
}