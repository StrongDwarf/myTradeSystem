/**
 * 面试官信息model
 * 
 * @author 朱泽聪
 * @createTime 2019-6-11
 * @createReason 选择面试时间
 */

let mongoose = require('mongoose'),
	Schema = mongoose.Schema;
let InterviewerSchema = new Schema({
    // 姓名
    name:{
        type:String
    },
    // 工号
    jobNumber:{
        type:String
    },
    // 手机号
    phone:{
        type:String
    },
    // 邮箱
    email:{
        type:String
    }
})
mongoose.model('Interviewer',InterviewerSchema)