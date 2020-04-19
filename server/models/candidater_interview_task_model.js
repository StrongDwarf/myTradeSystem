/**
 * 候选者面试任务
 * 
 * @author 朱泽聪
 * @createTime 2019-6-12
 * @createReason 项目初始化
 */

let mongoose = require('mongoose'),
Schema = mongoose.Schema;
let CandidaterInterviewTaskSchema = new Schema({
    // 面试任务编号
    taskNumber:{
        type:String,
        required:true
    },
    // 候选人编号
    interviewNumber:{
        type:String,
        required:true
    },
    // 候选人是否到场
    isPresent:{
        type:Boolean,
        default:false
    },
    // 候选人得分 [{interviewerId,score}]
    scoreList:{
        type:Array,
        default:[]
    },
    // 候选人所得评价:
    evaluateList:{
        type:Array,
        default:[]
    },
    // 面试官编号
    jobNumberList:{
        type:Array,
        default:[]
    },
    // 候选人面试结果
    isPass:{
        type:Boolean,
        default:false
    },
    // 面试任务进度 0:面试任务刚发布,1:面试官已选择完面试时间,2:已通知候选者选择面试时间
    //             3:候选者已选择面试时间,4:正在面试,5:面试完毕,6:已筛选出通过者
    process:{
        type:String,
        default:0
    },
})
mongoose.model('CandidaterInterviewTask',CandidaterInterviewTaskSchema)