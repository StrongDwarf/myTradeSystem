/**
 * 面试总任务控制器
 * 
 * @author 朱泽聪
 * @createTime 2019-6-11
 * @createReason 项目初始化
 */

const mongoose = require('mongoose')
const dbErrorFunc = require('./errorDealFunc/db_error_func')
require('../models/interview_total_task_model')
const successType = require('./constants/success_type')
const errorType = require('./constants/error_type')
const InterviewData = require('../data/interview_data')
let InterviewTotalTask = mongoose.model('InterviewTotalTask')
const CandidaterController = require('./candidater_controller')
const InterviewerController = require('./interviewer_controller')
const CandidaterInterviewTaskController = require('./candidaterInterviewTask_controller')
const InterviewerInterviewTaskController = require('./interviewerInterviewTask_controller')


let interviewTotalTaskController = {
    addOneTest(obj) {
        console.log('开始执行数据插入')
        let interviewTotalTask = new InterviewTotalTask(obj)
        interviewTotalTask.save((err, doc) => {
            if (err) { res.json(dbErrorFunc.saveError(err)); return }
            console.log(successType.DB_SAVE_SUCCESS)
            console.log(doc)
        })
    },
    getTaskDetail(req,res){
        InterviewTotalTask.findOne({
            taskNumber:req.body.taskNumber
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
                res.json({
                    success:true,
                    data:{
                        taskDetail:{}
                    }
                })
                return
            }
            res.json({
                success:true,
                data:{
                    taskDetail:doc
                }
            })
            return
        })
    }
}

/**
 * 总任务数据初始化
 */
function totalTaskInit() {
    console.log('总任务数据初始化')
    interviewTotalTaskController.addOneTest(InterviewData.INTERVIEW_TOTAL_TASK_DATA)
    
    let candidaterList = InterviewData.INTERVIEW_TOTAL_TASK_DATA.candidaterList
    let interviewerList = InterviewData.INTERVIEW_TOTAL_TASK_DATA.interviewerList
    let taskNumber = InterviewData.INTERVIEW_TOTAL_TASK_DATA.taskNumber
    for (let item of candidaterList) {
        CandidaterController.addOne(item)
        let obj = {
            taskNumber:taskNumber,
            interviewNumber:item.interviewNumber
        }
        CandidaterInterviewTaskController.addOne(obj)
    }
    for (let item of interviewerList) {
        InterviewerController.addOne(item)
        let obj = {
            taskNumber:taskNumber,
            jobNumber:item.jobNumber
        }
        InterviewerInterviewTaskController.addOne(obj)
    }
    
}

 // totalTaskInit()


module.exports = interviewTotalTaskController