/**
 * 面试官面试任务
 * 
 * @author 朱泽聪
 * @createTime 2019-6-12
 * @createReason 项目初始化
 */

let mongoose = require('mongoose'),
Schema = mongoose.Schema;
let InterviewerInterviewTaskSchema = new Schema({
    // 面试任务编号
    taskNumber:{
        type:String,
        required:true
    },
    // 面试官编号
    jobNumber:{
        type:String,
        required:true
    },
    // 面试官预选择的时间列表
    timeBeforeList:{
        type:Array,
        default:[]
    },
    // 面试官选择的时间列表
    timeList:{
        type:Array,
        default:[]
    },
    // 面试官是否到场列表
    isPresentList:{
        type:Array,
        default:[]
    },
    // 面试官对面试者的评价列表
    evaluateList:{
        type:Array,
        default:[]
    },
    // 面试官对面试者的打分列表
    gradeList:{
        type:Array,
        default:[]
    },
    // 面试任务进度 0:面试任务刚发布,1:面试官已选择完面试时间,2:已通知候选者选择面试时间
    //             3:候选者已选择面试时间(预留,不用),4:正在面试,5:面试完毕,6:已筛选出通过者,7:面试已结束
    process:{
        type:String,
        default:0
    },
})
mongoose.model('InterviewerInterviewTask',InterviewerInterviewTaskSchema)