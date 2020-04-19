const errorType = require('../constants/error_type')

/**
 * 数据库错误处理
 */

module.exports = {
    notFound(){
        return {
            error:true,
            message:errorType.DB_NOT_FOUND
        }
    },
    saveError(err){
        console.error(err)
        return {
            error:true,
            message:errorType.DB_SAVE_ERROR
        }
    },
    findError(err){
        console.error(err)
        return {
            error:true,
            message:errorType.DB_FIND_ERROR
        }
    },
    removeError(err){
        console.error(err)
        return {
            error:true,
            message:errorType.DB_REMOVE_ERROR
        }
    }
}