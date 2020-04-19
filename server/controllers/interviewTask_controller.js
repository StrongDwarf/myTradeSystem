/**
 * 面试任务控制器
 * 所有面试任务相关的数据请求都要经过这层
 * 
 * @author 朱泽聪
 * @createTime 2019-6-13
 * @createReason 项目初始化
 */

const CandidaterInterviewTaskController = require('./candidaterInterviewTask_controller')
const InterviewerInterviewTaskController = require('./interviewerInterviewTask_controller')
const errorType = require('./constants/error_type')

let interviewTaskController = {
    // 获取任务列表
    getTaskList(req,res){
        if(!(req.body.name && req.body.number && req.body.type)){
            res.json({
                error:true,
                message:errorType.INPUT_JSON_ERROR
            })
            return
        }
        if(req.body.type == '1'){
            InterviewerInterviewTaskController.getTaskList(req,res)
            return
        }else if (req.body.type == '2'){
            CandidaterInterviewTaskController.getTaskList(req,res)
            return
        }else{
            res.json({
                error:true,
                message:errorType.INPUT_JSON_ERROR
            })
            return
        }
    },
}

module.exports = interviewTaskController