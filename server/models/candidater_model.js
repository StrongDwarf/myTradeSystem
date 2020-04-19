/**
 * 面试官信息model
 * 
 * @author 朱泽聪
 * @createTime 2019-6-11
 * @createReason 项目初始化
 */

let mongoose = require('mongoose'),
	Schema = mongoose.Schema;
let CandidaterSchema = new Schema({
    // 姓名
    name:{
        type:String,
        required:true
    },
    // 面试编号
    interviewNumber:{
        type:String,
        required:true
    },
    // 手机号
    phone:{
        type:String,
    },
    // 邮箱地址
    email:{
        type:String,
    },
    // 在线简历URL
    resumeUrl:{
        type:String
    }
})
mongoose.model('Candidater',CandidaterSchema)