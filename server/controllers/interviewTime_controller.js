/**
 * 面试时间控制器
 * 
 * @author 朱泽聪
 * @createTime 2019-6-11
 * @createReason 项目初始化
 */

const InterviewTime = require('../../models/interviewTime_model')
const jsonErrorFunc = require('./errorDealFunc/json_error_func')
const dbErrorFunc = require('./errorDealFunc/db_error_func')

let interviewTime_controller = {
    // 面试官相关操作
    interviewer:{
        /**
         * 获取已选时间列表
         * 
         * @param {jobNumber:面试官工号,name:面试官姓名,type:用户类型1:面试官,2:候选人} req 
         * @param {*} res 
         */
        getSelectedTimeList(req,res){
            if(!req.body.jobNumber || !req.body.name || req.body.name !== 1){ return jsonErrorFunc.jsonTypeError(req,res) }
            let findObj = {
                jobNumber:req.body.jobNumber,
                name:req.body.name,
                type:req.body.type
            }
            InterviewTime.findOne(findObj).exec((err,doc)=>{
                if(err) { res.json(dbErrorFunc.findError(err));return }
                if(!doc){
                    findObj.selectedTimeList = []
                    let interviewTime = new InterviewTime(findObj)
                    interviewTime.save((err,doc) =>{
                        if(err){res.json(dbErrorFunc.saveError(err));return}
                        res.json({
                            success:true,
                            data:doc
                        })
                    })
                    return
                }
                res.json({
                    success:true,
                    data:doc
                })
            })
        },

        /**
         * 更新已选时间列表
         * 
         * @param {jobNumber:面试官工号,selectedTimeList:选择的时间列表,name:面试官姓名,type:用户类型,} req 
         * @param {*} res 
         */
        updateSelectedTimeList(req,res){
        },
    },
    // 候选人相关操作
    candidater:{

    }
}


module.exports = interviewTime_controller

