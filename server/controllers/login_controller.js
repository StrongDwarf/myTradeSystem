/**
 * 登录相关控制器
 * 
 * @author 朱泽聪
 * @createTime 2019-06-11
 * @createReason 项目初始化
 */

const interviewData = require('../data/interview_data')
const errorType = require('./constants/error_type')
const interviewerController = require('./interviewer_controller')
const candidaterController = require('./candidater_controller')

/**
 * 登录控制器
 * 
 * @param {name:姓名,jobNumber:工号|interviewNumber:面试编号,type:登录者类型} req 
 * @param {*} res 
 */
let login = function (req, res) {
    if (!req.body.name || !(req.body.jobNumber || req.body.interviewNumber)) {
        res.json({
            error: true,
            message: errorType.INPUT_JSON_ERROR
        })
        return
    }
    // 面试官登录
    if (req.body.type == '1'){
        interviewerController.login(req,res)
        return
    // 候选人登录
    }else if (req.body.type == '2'){
        candidaterController.login(req,res)
        return
    } else {
        res.json({
            error:true,
            message:errorType.INPUT_JSON_ERROR
        })
    }
}

module.exports = {
    login:login
}

