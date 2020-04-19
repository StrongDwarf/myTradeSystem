/**
 * 错误类型常量,记录所有错误类型,所有的错误类型均需包含到此文件中,在使用时使用调用
 */

module.exports = {
    // 输入错误,在前端传入与接口需要参数不同参数时提示该错误信息
    INPUT_JSON_ERROR:'错误的JSON格式',
    DB_NOT_FOUND:'未发现指定数据',
    DB_SAVE_ERROR:'DB_ERROR:保存数据时出错',
    DB_FIND_ERROR:'DB_ERROR:查询数据时出错',
    DB_REMOVE_ERROR:'DB_ERROR:删除数据时候出错',
    DB_ADD_REPEAT_ERROR:'DB_ERROR:数据已存在,重复添加'
}

