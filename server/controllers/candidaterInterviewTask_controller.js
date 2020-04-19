/**
 * 候选人面试任务表
 * 
 * @author 朱泽聪
 * @createTime 2019-4-12
 * @createReason 项目初始化
 */

require('../models/candidater_interview_task_model')
const mongoose = require('mongoose')
const CandidaterInterviewTask = mongoose.model('CandidaterInterviewTask')
const errorType = require('./constants/error_type')
const successType = require('./constants/success_type')

const CandidaterInterviewTaskController = {
    addOne(obj){
        var candidaterInterviewTask = new CandidaterInterviewTask(obj)
        candidaterInterviewTask.save((err,doc) => {
            if(err){
                console.error(err)
                console.log(errorType.DB_SAVE_ERROR)
                return
            }
            console.log(successType.DB_SAVE_SUCCESS)
            console.log(doc)
        })
    },
    getTaskList(req,res){
        CandidaterInterviewTask.find({
            interviewNumber:req.body.number
        }).exec((err,docs) => {
            if(err){
                console.error(err)
                res.json({
                    error:true,
                    message:errorType.DB_FIND_ERROR
                })
                return
            }
            if(!docs){
                res.json({
                    success:true,
                    taskList:[]
                })
                return
            }
            res.json({
                success:true,
                data:{
                    taskList:docs
                }
            })
        })
    }
}

module.exports = CandidaterInterviewTaskController