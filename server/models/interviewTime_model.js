/**
 * 面试时间model
 * 
 * @author 朱泽聪
 * @createTime 2019-6-11
 * @createReason 项目初始化
 */

let mongoose = require('mongoose'),
	Schema = mongoose.Schema;
let InterviewTimeSchema = new Schema({
    // 姓名
    name:{
        type:String,
        required:true
    },
    // 工号
    jobNumber:{
        type:String
    },
    // 面试编号
    interviewNumber:{
        type:String
    },
    // 时间类型, 1:面试官选择的时间, 2:候选者选择的时间
    type:{
        type:String,
        required:true
    },
    // 选择的时间,数组内元素格式 yy-mm-dd-hh-mm:yy-mm-dd-hh-mm
    selectedTimeList:{
        type:Array
    }
})
mongoose.model('InterviewTime',InterviewTimeSchema)