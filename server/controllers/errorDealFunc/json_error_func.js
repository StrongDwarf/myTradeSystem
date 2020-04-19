const errorType = require('../constants/error_type')

/**
 * JSON错误处理
 */

module.exports = {
    jsonTypeError(req,res){
        res.json({
            error:true,
            message:errorType.INPUT_JSON_ERROR
        })
        return
    }
}