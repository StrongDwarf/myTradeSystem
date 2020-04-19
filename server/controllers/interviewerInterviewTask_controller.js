/**
 * 面试官面试任务表
 * 
 * @author 朱泽聪
 * @createTime 2019-4-12
 * @createReason 项目初始化
 */

require('../models/interviewer_interview_task_model')
const mongoose = require('mongoose')
const InterviewerInterviewTask = mongoose.model('InterviewerInterviewTask')
const errorType = require('./constants/error_type')
const successType = require('./constants/success_type')

const InterviewerInterviewTaskController = {
    addOne(obj){
        var interviewerInterviewTask = new InterviewerInterviewTask(obj)
        interviewerInterviewTask.save((err,doc) => {
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
        InterviewerInterviewTask.find({
            jobNumber:req.body.number
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
    },
    // 更新面试时间
    updateSelectedTimeList(req,res){
        console.log(req.body)
        if(!req.body.jobNumber || !req.body.taskNumber || !req.body.timeList){
            res.json({
                error:true,
                message:errorType.INPUT_JSON_ERROR
            })
            return
        }
        
    },
    // 面试官新增面试时间
    addSelectedTimeList(req,res){
        console.log(req.body)
        if(!req.body.jobNumber || !req.body.taskNumber || !req.body.timeList){
            res.json({
                error:true,
                message:errorType.INPUT_JSON_ERROR
            })
            return
        }
        InterviewerInterviewTask.findOne({
            jobNumber:req.body.jobNumber,
            taskNumber:req.body.taskNumber
        }).exec((err,doc) => {
            if(err){
                console.log(err)
                res.json({
                    error:true,
                    message:errorType.DB_FIND_ERROR
                })
                return
            }
            if(!doc){
                res.json({
                    error:true,
                    message:errorType.DB_NOT_FOUND
                })
                return
            }
            // doc.timeBeforeList = '[]'
            if(typeof doc.timeBeforeList == 'object'){
                doc.timeBeforeList = '[]'
            }
            let selectedTimeList = JSON.parse(doc.timeBeforeList)
            selectedTimeList = [... new Set(selectedTimeList.concat(JSON.parse(req.body.timeList)))]
            doc.timeBeforeList = JSON.stringify(selectedTimeList)
            
            doc.save((err,doc) => {
                if(err){
                    console.error(err)
                    res.json({
                        error:true,
                        message:errorType.DB_SAVE_ERROR
                    })
                    return
                }
                res.json({
                    success:true,
                    data:{}
                })
            })
        })
    },
    // 获取面试官面试任务细节
    getInterviewTaskDetail(req,res){
        if(!req.body.taskNumber || !req.body.jobNumber){
            res.json({
                error:true,
                message:errorType.INPUT_JSON_ERROR
            })
            return
        }
        InterviewerInterviewTask.findOne({
            taskNumber:req.body.taskNumber,
            jobNumber:req.body.jobNumber
        }).exec((err,doc) => {
            if(err){
                console.error(err)
                res.json({
                    error:true,
                    message:errorType.DB_FIND_ERROR
                })
                return
            }
            if(!doc){
                doc = {}
            }
            res.json({
                success:true,
                data:{
                    taskDetail:doc
                }
            })
        })
    }
}

module.exports = InterviewerInterviewTaskController