/**
 * 面试任务总表
 * 
 * @author 朱泽聪
 * @createTime 2019-6-12
 * @createReason 项目初始化
 */

let mongoose = require('mongoose'),
Schema = mongoose.Schema;
let InterviewTotalTaskSchema = new Schema({
    // 面试名称 例:保洁2019校招1面
    name:{
        type:String
    },
    taskNumber:{
        type:String
    },
    // 计划录取人数
    admissionCount:{
        type:String
    },
    // 单场面试时间
    interviewTime:{
        type:String
    },
    // 面试地点
    address:{
        type:String
    },
    // 面试官名单
    interviewerList:{
        type:Array
    },
    // 候选人名单
    candidaterList:{
        type:Array
    },
})
mongoose.model('InterviewTotalTask',InterviewTotalTaskSchema)